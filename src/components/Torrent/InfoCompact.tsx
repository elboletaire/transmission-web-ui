import { Icon, Text } from '@chakra-ui/react'
import { addSeconds, formatDistance } from 'date-fns'
import prettyBytes from 'pretty-bytes'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { TorrentStatus, useTorrent } from '../../hooks/use-torrent'

export const InfoCompact = () => {
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
          ? `ETA: ${formatDistance(Date.now(), addSeconds(new Date(), torrent.eta))}`
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
