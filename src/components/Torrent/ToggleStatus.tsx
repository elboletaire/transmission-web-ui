import { chakra, ComponentWithAs, IconButton, IconButtonProps } from '@chakra-ui/react'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import { TorrentStatus, useTorrentContext } from '.'

const _ToggleStatus = (props: ComponentWithAs<'button', IconButtonProps>) => {
  const { start, stop, torrent, loading } = useTorrentContext()

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

export const ToggleStatus = chakra(_ToggleStatus)
ToggleStatus.displayName = 'ToggleStatus'
