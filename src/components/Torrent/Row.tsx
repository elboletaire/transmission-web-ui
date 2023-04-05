import { Card, CardBody, CardHeader, Divider, Stack, Text } from '@chakra-ui/react'
import type { TorrentRowProps } from '.'
import { useTorrent } from '../../hooks/use-torrent'
import { FileSizeInfo, PeersInfo, SpeedInfo } from './Info'
import { Labels } from './Labels'
import { TorrentName } from './Name'
import { Progress } from './Progress'
import { ToggleStatus } from './ToggleStatus'

export const TorrentRow = ({ childRef, ...rest }: TorrentRowProps) => {
  const { torrent, selected } = useTorrent()

  return (
    <Card {...rest} ref={childRef} userSelect='none' variant={selected ? 'selected' : 'elevated'}>
      <CardHeader p={3} pt={2} pb={0} display='flex'>
        <TorrentName fontWeight='bold' />
        <Labels />
      </CardHeader>
      <CardBody p={3} pt={0} pb={2}>
        <Stack direction='row' fontSize='.8em'>
          {torrent.errorString.length > 0 && <Text color='orange'>{torrent.errorString}</Text>}
          <PeersInfo />
          <Divider orientation='vertical' />
          <SpeedInfo />
        </Stack>
        <Stack direction='row' spacing={1}>
          <Progress width='full' my={1} />
          <ToggleStatus />
        </Stack>
        <FileSizeInfo />
      </CardBody>
    </Card>
  )
}
