import { Flex, Progress } from '@chakra-ui/react'
import { Navbar } from './components/Layout/Navbar'
import { TorrentsList } from './components/TorrentsList'
import { useClient } from './hooks/use-rpc'
import { useTorrents } from './hooks/use-torrents'

export const App = () => {
  const { connecting } = useClient()
  const { ids } = useTorrents()

  return (
    <Flex m={2} direction='column'>
      <Navbar />
      <TorrentsList />
      {(connecting || !ids.length) && (
        <Progress size='xs' isIndeterminate w='full' mt={2} />
      )}
    </Flex>
  )
}
