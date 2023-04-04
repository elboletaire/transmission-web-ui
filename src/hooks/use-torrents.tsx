import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { TorrentRequestFields } from './interfaces'
import { useLocalSettingsProvider } from './use-local-settings'
import { useClient } from './use-rpc'
import { SetPayload, useTorrentsReducer } from './use-torrents-reducer'

export const useTorrentsProvider = () => {
  const { torrents, remove, set, setLabels, start, stop } = useTorrentsReducer()
  const [selected, setSelected] = useState<number | null>(null)
  const [updating, setUpdating] = useState<boolean>(false)
  const { connected, makeRequest } = useClient()
  const { fetchTorrentsTimeout } = useLocalSettingsProvider()

  // fetches torrent updates
  const fetchTorrents: (ids?: string | number[]) => Promise<any> = useCallback(
    async (ids?: string | number[]) => {
      if (updating) {
        return
      }
      setUpdating(true)

      const args: any = {
        fields: TorrentRequestFields,
      }
      if (ids && ids.length) {
        args.ids = ids
      }

      return await makeRequest('torrent-get', args)
        .then((response) => set(response.data.arguments as SetPayload))
        .finally(() => setUpdating(false))
    },
    [set, makeRequest, updating]
  )

  const updateLabels = (ids: number[], labels: string[]) => {
    setUpdating(true)
    return makeRequest('torrent-set', {
      ids,
      labels,
    })
      .then(() => setLabels(ids, labels))
      .catch((error) => {
        console.error('could not set labels:', error)
      })
      .finally(() => setUpdating(false))
  }

  const startTorrents = (ids: number[]) => {
    setUpdating(true)
    return makeRequest('torrent-start', { ids })
      .then(() => start(ids))
      .catch((error) => {
        console.error('could not start torrents:', ids, error)
      })
      .finally(() => setUpdating(false))
  }

  const stopTorrents = (ids: number[]) => {
    setUpdating(true)
    return makeRequest('torrent-stop', { ids })
      .then(() => stop(ids))
      .catch((error) => {
        console.error('could not stop torrents:', ids, error)
      })
      .finally(() => setUpdating(false))
  }

  const removeTorrents = (ids: number[], deleteLocal: boolean) => {
    setUpdating(true)
    return makeRequest('torrent-remove', {
      ids,
      'delete-local-data': deleteLocal,
    })
      .then(() => {
        remove(ids)

        return ids
      })
      .catch((error) => {
        console.error('could not remove torrents:', ids, error)

        setUpdating(false)
      })
  }

  // fetch torrent list for the first time
  useEffect(() => {
    if (torrents.ids.length || !connected) return
    ;(async () => {
      await fetchTorrents()
    })()
  }, [torrents.ids.length, fetchTorrents, connected])

  // start fetch torrent interval
  useEffect(() => {
    if (!torrents.ids.length) return
    const inter = setInterval(() => fetchTorrents('recently-active'), fetchTorrentsTimeout)
    return () => clearInterval(inter)
  }, [fetchTorrents, fetchTorrentsTimeout, torrents.ids.length])

  return {
    ...torrents,
    fetchTorrents,
    removeTorrents,
    selected,
    setSelected,
    startTorrents,
    stopTorrents,
    updateLabels,
    updating,
  }
}

export type TorrentsState = ReturnType<typeof useTorrentsProvider>

export const TorrentsContext = createContext<TorrentsState | undefined>(undefined)
TorrentsContext.displayName = 'TorrentsContext'

export const useTorrents = () => {
  const ctxt = useContext(TorrentsContext)

  if (!ctxt) {
    throw new Error(
      'useTorrents returned `undefined`, maybe you forgot to wrap the component within <TorrentsProvider />?'
    )
  }

  return ctxt
}

type TorrentsProviderComponentProps = {
  children?: ReactNode
}

export const TorrentsProvider = (props: TorrentsProviderComponentProps) => {
  const value = useTorrentsProvider()

  return <TorrentsContext.Provider value={value} {...props} />
}
