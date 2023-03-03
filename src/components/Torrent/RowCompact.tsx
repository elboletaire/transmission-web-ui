import { Box, Icon, Text, useColorModeValue } from '@chakra-ui/react'
import { addSeconds, formatDistance } from 'date-fns'
import prettyBytes from 'pretty-bytes'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { TorrentStatus, useTorrent } from '../../hooks/use-torrent'
import { Labels } from './Labels'
import { TorrentName } from './Name'
import { Progress } from './Progress'
import { ToggleStatus } from './ToggleStatus'

export const CompactRow = ({ childRef }: { childRef: any }) => (
  <Box
    ref={childRef}
    display='flex'
    flexDirection='column'
    pt={1}
    _even={{
      backgroundColor: useColorModeValue('#f2f2f2', '#12161F'),
    }}
  >
    <Box display='flex'>
      <Box
        display='flex'
        flexDir='row'
        overflow='hidden'
        mr={3}
        justifySelf='start'
      >
        <TorrentName fontSize='sm' />
        <Box display='flex'>
          <Labels variant='outline' size='xs' />
        </Box>
      </Box>
      <Box
        display='flex'
        flexDir='row'
        alignItems='center'
        justifyContent='end'
        flexShrink={0}
        ml='auto'
        mr={1}
      >
        <InfoCompact />
      </Box>
      <ToggleStatus minW='auto' />
    </Box>
    <Progress w='full' size='xxs' mt={1} />
  </Box>
)

const InfoCompact = () => {
  const { torrent } = useTorrent()

  return (
    <>
      {torrent.errorString.length > 0 && (
        <Text color='orange' fontSize='xs' mr={2}>
          {torrent.errorString}
        </Text>
      )}
      <Text fontSize='xs' mr={1}>
        {torrent.uploadRatio / torrent.seedRatioLimit >= 1
          ? 'Seeding complete'
          : torrent.status === TorrentStatus.Stopped
          ? 'Paused'
          : torrent.eta > 0
          ? `ETA: ${formatDistance(
              Date.now(),
              addSeconds(new Date(), torrent.eta)
            )}`
          : `Ratio: ${Math.round(torrent.uploadRatio * 100) / 100}`}
      </Text>
      {torrent.rateDownload > 0 && (
        <Text fontSize='xs' mr={1}>
          <Icon as={FaArrowDown} mb='-px' /> {prettyBytes(torrent.rateDownload)}
          /s
        </Text>
      )}
      {torrent.rateUpload > 0 && (
        <Text fontSize='xs'>
          <Icon as={FaArrowUp} mb='-px' /> {prettyBytes(torrent.rateUpload)}
          /s
        </Text>
      )}
    </>
  )
}
