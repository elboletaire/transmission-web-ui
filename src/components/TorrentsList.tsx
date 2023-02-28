import { Flex, Progress, Stack } from '@chakra-ui/react'
import { useClientContext } from '../hooks/use-rpc-reducer'
import { Torrent } from './Torrent'

export const TorrentsList = () => {
  const { torrents, connected, connecting } = useClientContext()

  if (!connected && connecting) {
    return <Progress mt={3} w='full' size='xs' isIndeterminate />
  }

  return (
    <Flex mt={3}>
      <Stack spacing={3} w='full'>
        {
          torrents.map((torrent) => <Torrent key={torrent.id} torrent={torrent} />)
        }
      </Stack>
    </Flex>
  )
}
