import { Box, ButtonGroup, Spinner, Stack, Text } from '@chakra-ui/react'
import { useClient } from '../../hooks/use-rpc'
import { useTorrents } from '../../hooks/use-torrents'
import { SettingsLayout } from '../Settings/Layout'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { Filters } from './Filters'
import { DownloadSpeed, UploadSpeed } from './Speed'

export const Navbar = () => {
  const { connecting } = useClient()
  const { updating, ids } = useTorrents()

  return (
    <Stack>
      <Stack justifyContent='flex-end' direction='row' alignItems='center'>
        <Box>{updating && <Spinner size='sm' color='pgreen' />}</Box>
        <ButtonGroup isAttached>
          <SettingsLayout />
          {/* <Settings /> */}
          <ColorModeSwitcher />
        </ButtonGroup>
      </Stack>
      <Stack direction={['column', 'column', 'column', 'row']} justifyContent='space-between'>
        <Stack direction={['column', 'column', 'row']} order={[2, 2, 1]}>
          <Filters />
          <Text display='flex' alignItems='center'>
            {connecting || !ids.length ? 'fetching transfers' : ids.length + ' transfers'}
          </Text>
        </Stack>
        <Stack direction='row' justifyContent='end' justifySelf='end' order={[1, 1, 1, 2]}>
          <DownloadSpeed />
          <UploadSpeed />
        </Stack>
      </Stack>
    </Stack>
  )
}
