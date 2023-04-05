import { createContext, ReactNode, useContext, useState } from 'react'
import { Torrent } from './interfaces'
import { useTorrents } from './use-torrents'

type TorrentProviderProps = {
  torrent: Torrent
}

export enum TorrentStatus {
  Stopped = 0,
  CheckWait,
  Check,
  DownloadWait,
  Download,
  SeedWait,
  Seed,
}

export const useTorrentProvider = ({ torrent }: TorrentProviderProps) => {
  const {
    reannounce: reannounceAll,
    remove: removeAll,
    rename: renameAll,
    selectSingle,
    selected,
    setLocation: setAllLocation,
    start: startAll,
    stop: stopAll,
    updateLabels: updateAllLabels,
    verify: verifyAll,
  } = useTorrents()
  const [loading, setLoading] = useState<boolean>(false)

  const reannounce = () => {
    setLoading(true)
    return reannounceAll([torrent.id]).finally(() => setLoading(false))
  }

  const rename = (path: string, name: string) => {
    setLoading(true)
    return renameAll([torrent.id], path, name).finally(() => setLoading(false))
  }

  const remove = (deleteLocal: boolean = false) => {
    setLoading(true)
    return removeAll([torrent.id], deleteLocal).finally(() => setLoading(false))
  }

  const setLocation = (location: string, move: boolean = false) => {
    setLoading(true)
    return setAllLocation([torrent.id], location, move).finally(() => setLoading(false))
  }

  const stop = () => {
    setLoading(true)
    return stopAll([torrent.id]).finally(() => setLoading(false))
  }

  const start = () => {
    setLoading(true)
    return startAll([torrent.id]).finally(() => setLoading(false))
  }

  const updateLabels = (labels: string[]) => {
    setLoading(true)
    return updateAllLabels([torrent.id], labels).finally(() => setLoading(false))
  }

  const verify = () => {
    setLoading(true)
    return verifyAll([torrent.id]).finally(() => setLoading(false))
  }

  return {
    loading,
    reannounce,
    rename,
    remove,
    select: () => (selected.length === 1 && selected.includes(torrent.id) ? null : selectSingle(torrent.id)),
    get selected() {
      return selected.find((id) => id === torrent.id)
    },
    setLocation,
    start,
    stop,
    torrent,
    updateLabels,
    verify,
  }
}

export type TorrentState = ReturnType<typeof useTorrentProvider>

export const TorrentContext = createContext<TorrentState | undefined>(undefined)
TorrentContext.displayName = 'TorrentContext'

export const useTorrent = () => {
  const ctxt = useContext(TorrentContext)

  if (!ctxt) {
    throw new Error(
      'useTorrentContext returned `undefined`, maybe you forgot to wrap the component within <TorrentProvider />?'
    )
  }

  return ctxt
}

type TorrentProviderComponentsProps = TorrentProviderProps & {
  children?: ReactNode
}

export const TorrentProvider = ({ torrent, ...rest }: TorrentProviderComponentsProps) => {
  const value = useTorrentProvider({ torrent })

  return <TorrentContext.Provider value={value} {...rest} />
}
