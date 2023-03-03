import { Text, TextProps } from '@chakra-ui/react'
import { useTorrent } from '../../hooks/use-torrent'

export const TorrentName = (props: TextProps) => {
  const { torrent } = useTorrent()

  return (
    <Text isTruncated mr={3} {...props}>
      {torrent.name}
    </Text>
  )
}
