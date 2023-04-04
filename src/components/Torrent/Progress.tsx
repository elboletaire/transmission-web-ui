import { Progress as CProgress, ProgressProps } from '@chakra-ui/react'
import { TorrentStatus, useTorrent } from '../../hooks/use-torrent'

export const Progress = (props: ProgressProps) => {
  const { torrent } = useTorrent()

  const value = () => {
    if (torrent.metadataPercentComplete < 1) {
      return Math.round(torrent.metadataPercentComplete * 100)
    }
    if (torrent.status === TorrentStatus.Check) {
      return Math.round(torrent.recheckProgress * 100)
    }
    if (torrent.leftUntilDone > 0) {
      return Math.round(torrent.percentDone * 100)
    }
    if (torrent.seedRatioLimit > 0) {
      return Math.round((torrent.uploadRatio / torrent.seedRatioLimit) * 100)
    }

    return 100
  }

  const colorScheme = () => {
    if (torrent.isFinished || [TorrentStatus.Seed, TorrentStatus.SeedWait].includes(torrent.status)) {
      return 'green'
    }

    // magnet links
    if (torrent.metadataPercentComplete < 1) {
      return 'orange'
    }

    return 'blue'
  }

  return (
    <CProgress
      value={value()}
      colorScheme={colorScheme()}
      hasStripe={torrent.status === TorrentStatus.Stopped}
      {...props}
    />
  )
}
