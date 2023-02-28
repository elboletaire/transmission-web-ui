import axios from 'axios'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Torrent, TorrentRequestFields, Tracker } from './interfaces'

import { ReactNode } from 'react'

type ClientProviderProps = {
  rpc?: string
}

export type FilterTypes = 'all' | 'active' | 'downloading' | 'paused' | 'seeding' | 'finished'

export const useClientProvider = ({rpc: r} : ClientProviderProps) => {
  const [ connected, setConnected ] = useState<boolean>(false)
  const [ connecting, setConnecting ] = useState<boolean>(false)
  const [ downloadSpeed, setDownloadSpeed ] = useState<number>(0)
  const [ filterLabels, setFilterLabels ] = useState<string[]>([])
  const [ filterStatus, setFilterStatus ] = useState<FilterTypes>('all')
  const [ filterText, setFilterText ] = useState<string>('')
  const [ filterTrackers, setFilterTrackers ] = useState<string[]>([])
  const [ labels, setLabels ] = useState<string[]>([])
  const [ requestsCooldown ] = useState<number>(1000)
  const [ rpc, setRpc ] = useState<string>(r as string)
  const [ sessid, setSessid ] = useState<string>('')
  const [ session, setSession ] = useState<any>({})
  const [ torrents, setTorrents ] = useState<Torrent[]>([])
  const [ trackers, setTrackers ] = useState<Tracker[]>([])
  const [ updating, setUpdating ] = useState<boolean>(false)
  const [ uploadSpeed, setUploadSpeed ] = useState<number>(0)

  // helper function to make requests passing our sessid
  const makeRequest = useCallback(async (data: any) =>
    await axios.post(rpc, data, {
      headers: {
        'x-transmission-session-id': sessid,
      }
    })
  , [rpc, sessid])

  // fetches session information. Grabs sessid in case of failure
  const fetchSession : () => Promise<any> = useCallback(async () => {
    await makeRequest({
      method: 'session-get'
    })
    .catch((error) => {
      if (error.response && error.response.status === 409 && error.response.headers['x-transmission-session-id']) {
        setSessid(error.response.headers['x-transmission-session-id'])
        console.info('set sessionid:', error.response.headers['x-transmission-session-id'])
        return
      }
    })
  }, [makeRequest])

  // fetches torrent updates
  const fetchTorrents : () => Promise<any> = useCallback(async () => {
    if (updating) {
      return
    }
    setUpdating(true)

    return await makeRequest({
      method: 'torrent-get',
      arguments: {
        fields: TorrentRequestFields,
      },
    }).then((response) => {
      setConnecting(false)
      setConnected(true)
      updateTorrents(response.data.arguments.torrents)
      setUpdating(false)
    })
  }, [makeRequest, updating])

  // sets rpc
  useEffect(() => {
    if (!r || rpc) return

    setRpc(r)
  }, [rpc, r])

  // fetch session id
  useEffect(() => {
    if (!rpc || sessid) return

    setConnecting(true)
    fetchSession()

  }, [fetchSession, rpc, sessid])

  // update torrents state
  const updateTorrents = (tors: Torrent[]) => {
    // total download speed
    const d = tors.reduce((acc, torrent) => acc + torrent.rateDownload, 0)
    setDownloadSpeed(d)
    // total upload speed
    const u = tors.reduce((acc, torrent) => acc + torrent.rateUpload, 0)
    setUploadSpeed(u)
    // get list of trackers
    const t : Tracker[] = []
    const added : string[] = []
    tors.forEach((torrent) => {
      torrent.trackers.forEach((tracker) => {
        if (!added.includes(tracker.sitename)) {
          added.push(tracker.sitename)
          t.push(tracker)
        }
      })
    })
    setTrackers(t.sort((a, b) =>
      a.sitename < b.sitename ? 0 : a.sitename > b.sitename ? 1 : -1
    ))
    // get list of labels
    const labels = tors.reduce((acc, tor) =>
      [...acc, ...tor.labels]
    , [] as string[])
    setLabels([...new Set(labels)])
    // set torrents sorted by name
    setTorrents(tors.sort((a, b) =>
      a.name < b.name ? 0 : a.name > b.name ? 1 : -1
    ))
  }

  // fetch session info
  useEffect(() => {
    if (!sessid.length || !rpc || Object.values(session).length > 0) return

    ;(async () => {
      await makeRequest({
          method: 'session-get',
        })
        .then(({data}) => {
          setSession(data.arguments)
        })
        .catch(() => null)
    })()

  }, [makeRequest, rpc, sessid.length, session])

  // fetch torrent list for the first time
  useEffect(() => {
    if (torrents.length || !Object.values(session).length || !rpc) return
    ;(async () => {
      await fetchTorrents()
    })()

  }, [torrents, rpc, session, makeRequest, fetchTorrents])

  // start fetch torrent interval
  useEffect(() => {
    if (!torrents.length) return
    const inter = setInterval(() => fetchTorrents(), requestsCooldown)
    return () => clearInterval(inter)
  }, [fetchTorrents, requestsCooldown, torrents.length])

  return {
    connected,
    connecting,
    downloadSpeed,
    filterLabels,
    filterStatus,
    filterText,
    filterTrackers,
    labels,
    makeRequest,
    rpc,
    sessid,
    setFilterLabels,
    setFilterStatus,
    setFilterText,
    setFilterTrackers,
    setRpc,
    torrents,
    trackers,
    updating,
    uploadSpeed,
  }
}

export type ClientState = ReturnType<typeof useClientProvider>

export const ClientContext = createContext<ClientState | undefined>(undefined)

export const useClientContext = () => {
  const ctxt = useContext(ClientContext)

  if (!ctxt) {
    throw new Error('useClientContext returned `undefined`, maybe you forgot to wrap the component within <ClientProvider />?')
  }

  return ctxt
}

type ClientProviderComponentProps = ClientProviderProps & {
  children?: ReactNode
}

export const ClientProvider = ({rpc,...rest} : ClientProviderComponentProps) => {
  const value = useClientProvider({rpc})

  return (
    <ClientContext.Provider value={value} {...rest} />
  )
}
