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
  const { startTorrents, stopTorrents } = useTorrents()
  const [loading, setLoading] = useState<boolean>(false)

  const stop = () => {
    setLoading(true)
    return stopTorrents([torrent.id]).finally(() => setLoading(false))
  }

  const start = () => {
    setLoading(true)
    return startTorrents([torrent.id]).finally(() => setLoading(false))
  }

  return {
    loading,
    torrent,
    start,
    stop,
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
