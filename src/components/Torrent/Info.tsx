import { Icon, Stack, Text } from '@chakra-ui/react'
import { addSeconds, formatDistance } from 'date-fns'
import prettyBytes from 'pretty-bytes'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { useTorrent } from '../../hooks/use-torrent'

export const FileSizeInfo = () => {
  const { torrent } = useTorrent()

  if (!torrent.sizeWhenDone) {
    return null
  }

  return (
    <Stack direction='row'>
      {torrent.percentDone === 1 ? (
        <Text fontSize='xs'>
          {prettyBytes(torrent.sizeWhenDone)}&nbsp; uploaded {prettyBytes(torrent.uploadedEver)} (ratio{' '}
          {torrent.uploadRatio}
          )&nbsp; - <TimeLeft />
        </Text>
      ) : (
        <Text fontSize='xs'>
          {prettyBytes(torrent.downloadedEver)} of {prettyBytes(torrent.sizeWhenDone)}
          &nbsp;({Math.round(torrent.percentDone * 10000) / 100}%) - <TimeLeft />
        </Text>
      )}
    </Stack>
  )
}

export const TimeLeft = () => {
  const { torrent } = useTorrent()

  return (
    <>{torrent.eta > 0 ? formatDistance(Date.now(), addSeconds(new Date(), torrent.eta)) : 'remaining time unknown'}</>
  )
}

export const Downloading = () => {
  const { torrent } = useTorrent()
  if (!torrent.peersSendingToUs) {
    return null
  }

  return (
    <Text>
      Downloading from {torrent.peersSendingToUs} of {torrent.peersConnected} peers
    </Text>
  )
}

export const Uploading = () => {
  const { torrent } = useTorrent()

  return (
    <Text>
      Seeding to {torrent.peersGettingFromUs} of {torrent.peersConnected} peers
    </Text>
  )
}

export const PeersInfo = () => {
  return (
    <Stack direction='row'>
      <Downloading />
      <Uploading />
    </Stack>
  )
}

export const SpeedInfo = () => {
  const { torrent } = useTorrent()

  return (
    <Stack direction='row'>
      <Text>
        <Icon as={AiFillCaretDown} /> {prettyBytes(torrent.rateDownload)}/s
      </Text>
      <Text>
        <Icon as={AiFillCaretUp} /> {prettyBytes(torrent.rateUpload)}/s
      </Text>
    </Stack>
  )
}
