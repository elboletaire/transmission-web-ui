import { Box, ButtonGroup, Spinner, Stack, Text } from '@chakra-ui/react'
import { useClient } from '../../hooks/use-rpc'
import { useTorrents } from '../../hooks/use-torrents'
import { SettingsLayout } from '../Settings/Layout'
import { BatchActions } from './BatchActions'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { Filters } from './Filters'
import { DownloadSpeed, UploadSpeed } from './Speed'

export const Navbar = () => {
  const { connecting } = useClient()
  const { updating, ids, selected } = useTorrents()

  return (
    <Stack>
      <Stack direction='row' display='flex' justifyContent='space-between'>
        <BatchActions />
        <Stack direction='row' alignItems='center'>
          <Box>{updating && <Spinner size='sm' color='spinner' />}</Box>
          <ButtonGroup isAttached>
            <SettingsLayout />
            {/* <Settings /> */}
            <ColorModeSwitcher />
          </ButtonGroup>
        </Stack>
      </Stack>
      <Stack direction={['column', 'column', 'column', 'row']} justifyContent='space-between'>
        <Stack direction={['column', 'column', 'row']} order={[2, 2, 1]}>
          <Filters />
          <Text display='flex' alignItems='center'>
            {connecting || !ids.length ? 'fetching transfers' : ids.length + ' transfers'}{' '}
            {selected.length > 0 && `(${selected.length} selected)`}
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
