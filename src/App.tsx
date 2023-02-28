import { Flex, FormControl, Input, Progress } from '@chakra-ui/react'
import { FilteringNavbar } from './components/FilteringNavbar'
import { TorrentsList } from './components/TorrentsList'
import { useClientContext } from './hooks/use-rpc-reducer'

export const App = () => {
  const { setRpc, connected, connecting } = useClientContext()

  return (
    <Flex m={8} direction='column'>
      {
        connected ? (<>
          <FilteringNavbar />
          <TorrentsList />
        </>) : (
          <FormControl>
            <Input type='text' onChange={(e) => setRpc(e.target.value)} placeholder='rpc url' />
            { connecting && <Progress size='xs' isIndeterminate w='full' mt={2} /> }
          </FormControl>
        )
      }
    </Flex>
  )
}
