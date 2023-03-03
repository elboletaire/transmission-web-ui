import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import { TorrentStatus, useTorrent } from '../../hooks/use-torrent'

export const ToggleStatus = (props: Omit<IconButtonProps, 'aria-label'>) => {
  const { start, stop, torrent, loading } = useTorrent()

  if (torrent.status === TorrentStatus.Stopped) {
    return (
      <IconButton
        aria-label='start'
        isLoading={loading}
        title='Start'
        icon={<FaPlayCircle />}
        variant='link'
        onClick={start}
        {...props}
      />
    )
  }

  return (
    <IconButton
      aria-label='pause'
      isLoading={loading}
      title='Pause'
      icon={<FaPauseCircle />}
      variant='link'
      onClick={stop}
      {...props}
    />
  )
}
