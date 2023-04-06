import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { TorrentRequestFields } from './interfaces'
import { useLocalSettingsProvider } from './use-local-settings'
import { useClient } from './use-rpc'
import { SetPayload, useTorrentsReducer } from './use-torrents-reducer'

export type AddSettings = {
  cookies?: string
  'download-dir'?: string
  filename?: string
  labels?: string[]
  metainfo?: string
  paused?: boolean
  'peer-limit'?: number
  bandwidthPriority?: number
  'files-wanted'?: number[]
  'files-unwanted'?: number[]
  'priority-high'?: number[]
  'priority-low'?: number[]
  'priority-normal'?: number[]
}

export const useTorrentsProvider = () => {
  const {
    torrents,
    rename: renameAction,
    remove: removeAction,
    set: setAction,
    setLabels: setLabelsAction,
    start: startAction,
    stop: stopAction,
  } = useTorrentsReducer()
  const [selected, setSelected] = useState<number[]>([])
  const [updating, setUpdating] = useState<boolean>(false)
  const { connected, makeRequest } = useClient()
  const { fetchTorrentsTimeout } = useLocalSettingsProvider()

  const add = (args: AddSettings) => {
    if (!args.filename && !args.metainfo) {
      throw new Error('either filename or metainfo must be provided')
    }
    setUpdating(true)
    return makeRequest('torrent-add', args)
      .then((response) => response.data)
      .finally(() => setUpdating(false))
  }

  // fetches torrent updates
  const fetch: (ids?: string | number[]) => Promise<void> | undefined = useCallback(
    (ids?: string | number[]) => {
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

      return makeRequest('torrent-get', args)
        .then((response) => setAction(response.data.arguments as SetPayload))
        .finally(() => setUpdating(false))
    },
    [setAction, makeRequest, updating]
  )

  const reannounce = (ids: number[]) => {
    setUpdating(true)
    return makeRequest('torrent-reannounce', { ids })
      .then(() => ids)
      .catch((error) => {
        console.error('could not reannounce torrents:', ids, error)
      })
      .finally(() => setUpdating(false))
  }

  const rename = (ids: number[], path: string, name: string) => {
    setUpdating(true)
    return makeRequest('torrent-rename-path', { ids, path, name })
      .then(() => renameAction(ids, name))
      .catch((error) => {
        console.error('could not rename torrents:', ids, error)
      })
      .finally(() => setUpdating(false))
  }

  const remove = (ids: number[], deleteLocal: boolean) => {
    setUpdating(true)
    return makeRequest('torrent-remove', {
      ids,
      'delete-local-data': deleteLocal,
    })
      .then(() => {
        removeAction(ids)
        return ids
      })
      .catch((error) => {
        console.error('could not remove torrents:', ids, error)
      })
      .finally(() => setUpdating(false))
  }

  const setLocation = (ids: number[], location: string, move: boolean = false) => {
    setUpdating(true)
    return makeRequest('torrent-set-location', { ids, location, move })
      .catch((error) => {
        console.error('could not change location for torrents:', ids, error)
      })
      .finally(() => setUpdating(false))
  }

  const start = (ids: number[]) => {
    setUpdating(true)
    return makeRequest('torrent-start', { ids })
      .then(() => startAction(ids))
      .catch((error) => {
        console.error('could not start torrents:', ids, error)
      })
      .finally(() => setUpdating(false))
  }

  const stop = (ids: number[]) => {
    setUpdating(true)
    return makeRequest('torrent-stop', { ids })
      .then(() => stopAction(ids))
      .catch((error) => {
        console.error('could not stop torrents:', ids, error)
      })
      .finally(() => setUpdating(false))
  }

  const updateLabels = (ids: number[], labels: string[]) => {
    setUpdating(true)
    return makeRequest('torrent-set', {
      ids,
      labels,
    })
      .then(() => setLabelsAction(ids, labels))
      .catch((error) => {
        console.error('could not set labels:', error)
      })
      .finally(() => setUpdating(false))
  }

  const verify = (ids: number[]) => {
    setUpdating(true)
    return makeRequest('torrent-verify', { ids })
      .then(() => ids)
      .catch((error) => console.error('could not verify torrent:', error))
      .finally(() => setUpdating(false))
  }

  // fetch torrent list for the first time
  useEffect(() => {
    if (torrents.ids.length || !connected) return
    ;(async () => {
      await fetch()
    })()
  }, [torrents.ids.length, fetch, connected])

  // start fetch torrent interval
  useEffect(() => {
    if (!torrents.ids.length) return
    const inter = setInterval(() => fetch('recently-active'), fetchTorrentsTimeout)
    return () => clearInterval(inter)
  }, [fetch, fetchTorrentsTimeout, torrents.ids.length])

  return {
    ...torrents,
    add,
    fetch,
    reannounce,
    rename,
    remove,
    selectSingle: (id: number) => {
      if (selected.length === 1 && selected.includes(id)) {
        return setSelected([])
      }
      setSelected([id])
    },
    select: (id: number) => {
      if (selected.includes(id)) {
        return setSelected([...selected.filter((i) => i !== id)])
      }
      setSelected([...selected, id])
    },
    selected,
    setLocation,
    start,
    stop,
    updateLabels,
    updating,
    verify,
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
