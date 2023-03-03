import {
  Flex,
  FormControl,
  Input,
  /* FormControl, Input, */ Progress,
} from '@chakra-ui/react'
import { Navbar } from './components/Layout/Navbar'
import { TorrentsList } from './components/TorrentsList'
import { useClient } from './hooks/use-rpc'

export const App = () => {
  const { setRpc, connected, connecting } = useClient()

  return (
    <Flex m={2} direction='column'>
      {connected ? (
        <>
          <Navbar />
          <TorrentsList />
        </>
      ) : (
        <FormControl>
          <Input
            type='text'
            onChange={(e) => setRpc(e.target.value)}
            placeholder='rpc url'
          />
          {connecting && <Progress size='xs' isIndeterminate w='full' mt={2} />}
        </FormControl>
      )}
    </Flex>
  )
}
