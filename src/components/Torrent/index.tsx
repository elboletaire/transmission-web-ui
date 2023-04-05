import { CardProps } from '@chakra-ui/react'
import { Torrent as ITorrent, Tracker } from '../../hooks/interfaces'
import { FilterStatusTypes, useLocalSettings } from '../../hooks/use-local-settings'
import { TorrentProvider, TorrentStatus, useTorrent } from '../../hooks/use-torrent'
import { ContextMenu } from '../Layout/ContextMenu'
import { TorrentContextMenu } from './ContextMenu'
import { TorrentRow } from './Row'
import { RowCompact } from './RowCompact'

const isStatusFiltered = (filter: FilterStatusTypes, torrent: ITorrent) => {
  switch (filter) {
    case 'active':
      return (
        torrent.rateUpload > 0 ||
        torrent.rateDownload > 0 ||
        torrent.peersSendingToUs > 0 ||
        torrent.peersGettingFromUs > 0 ||
        torrent.webseedsSendingToUs > 0 ||
        torrent.status === TorrentStatus.Check
      )
    case 'downloading':
      return [TorrentStatus.DownloadWait, TorrentStatus.Download].includes(torrent.status)
    case 'paused':
      return torrent.status === TorrentStatus.Stopped
    case 'seeding':
      return [TorrentStatus.Seed, TorrentStatus.SeedWait].includes(torrent.status)
    case 'finished':
      return torrent.isFinished
    case 'error':
      return torrent.errorString.length > 0
    default:
      return true
  }
}

const isTrackerFiltered = (trackers: string[], torrent: ITorrent) => {
  if (!trackers.length) return true

  let found = false
  torrent.trackers.forEach((t: Tracker) => {
    if (trackers.includes(t.sitename)) {
      found = true
    }
  })

  return found
}

const isLabelFiltered = (labels: string[], torrent: ITorrent) => {
  if (!labels.length) return true

  if (labels.includes('untagged') && !torrent.labels.length) return true

  let found = false
  torrent.labels.forEach((l: string) => {
    if (labels.includes(l)) {
      found = true
    }
  })

  return found
}

const isNameFiltered = (text: string, torrent: ITorrent) => {
  if (!text.length) return true

  return torrent.name.toLowerCase().match(text.toLowerCase())
}

type TorrentProps = CardProps & {
  torrent: ITorrent
}

export const Torrent = ({ torrent, ...rest }: TorrentProps) => {
  const {
    filters: { status, trackers, labels, name },
  } = useLocalSettings()

  if (
    !isStatusFiltered(status, torrent) ||
    !isTrackerFiltered(trackers, torrent) ||
    !isLabelFiltered(labels, torrent) ||
    !isNameFiltered(name, torrent)
  ) {
    return null
  }

  return (
    <TorrentProvider torrent={torrent}>
      <CMenu {...rest} />
    </TorrentProvider>
  )
}

const CMenu = (rest: any) => {
  const { layout } = useLocalSettings()
  const { select } = useTorrent()
  return (
    <ContextMenu<HTMLDivElement> renderMenu={() => <TorrentContextMenu />} onOpen={select}>
      {(ref) => (layout === 'full' ? <TorrentRow {...rest} childRef={ref} /> : <RowCompact {...rest} childRef={ref} />)}
    </ContextMenu>
  )
}

export type TorrentRowProps = Omit<TorrentProps, 'torrent'> & {
  childRef: any
}
