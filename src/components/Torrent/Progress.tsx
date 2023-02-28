import { chakra, ComponentWithAs, Progress as CProgress, ProgressProps } from '@chakra-ui/react'
import { TorrentStatus, useTorrentContext } from '.'

const _Progress = (props: ComponentWithAs<'div', ProgressProps>) => {
  const { torrent } = useTorrentContext()

  const value = () => {
    if (torrent.isFinished) return 100
    if ([TorrentStatus.Seed, TorrentStatus.SeedWait].includes(torrent.status)) {
      return (torrent.uploadRatio / torrent.seedRatioLimit) * 100
    }
    return torrent.percentDone * 100
  }

  const colorScheme = () => {
    if (torrent.isFinished || [TorrentStatus.Seed, TorrentStatus.SeedWait].includes(torrent.status)) return 'green'
    return 'blue'
  }

  return <CProgress
    value={value()}
    colorScheme={colorScheme()}
    hasStripe={torrent.status === TorrentStatus.Stopped}
    {...props}
  />
}

export const Progress = chakra(_Progress)
Progress.displayName = 'Progress'
