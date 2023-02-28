import { Card, CardBody, CardHeader, Divider, Stack, Text } from '@chakra-ui/react'
import { createContext, ReactNode, useContext, useState } from 'react'
import { Torrent as ITorrent, Tracker } from '../../hooks/interfaces'
import { FilterTypes, useClientContext } from '../../hooks/use-rpc-reducer'
import { FileSizeInfo, PeersInfo, SpeedInfo } from './Info'
import { Labels } from './Labels'
import { Progress } from './Progress'
import { ToggleStatus } from './ToggleStatus'

type TorrentProviderProps = {
  torrent: ITorrent
}

export enum TorrentStatus {
  Stopped = 0,
  CheckWait,
  Check,
  DownloadWait,
  Download,
  SeedWait,
  Seed,
}

export const useTorrentProvider = ({torrent}: TorrentProviderProps) => {
  const { makeRequest } = useClientContext()
  const [ loading, setLoading ] = useState<boolean>(false)

  const stop = () => {
    setLoading(true)
    return makeRequest({
      method: 'torrent-stop',
      arguments: {
        ids: [torrent.id],
      },
    }).then((response) => {
      setLoading(false)
      return response
    })
  }

  const start = () => {
    setLoading(true)
    return makeRequest({
      method: 'torrent-start',
      arguments: {
        ids: [torrent.id],
      },
    }).then((response) => {
      setLoading(false)
      return response
    })
  }

  return {
    loading,
    torrent,
    start,
    stop,
  }
}


export type TorrentState = ReturnType<typeof useTorrentProvider>

export const TorrentContext = createContext<TorrentState | undefined>(undefined)

export const useTorrentContext = () => {
  const ctxt = useContext(TorrentContext)

  if (!ctxt) {
    throw new Error('useTorrentContext returned `undefined`, maybe you forgot to wrap the component within <TorrentProvider />?')
  }

  return ctxt
}

type TorrentProviderComponentsProps = TorrentProviderProps & {
  children?: ReactNode
}

export const TorrentProvider = ({torrent,...rest} : TorrentProviderComponentsProps) => {
  const value = useTorrentProvider({torrent})

  return (
    <TorrentContext.Provider value={value} {...rest} />
  )
}

const isStatusFiltered = (filter: FilterTypes, torrent: ITorrent) => {
  switch (filter) {
    case 'active':
      return (
        torrent.rateUpload > 0 ||
        torrent.rateDownload > 0 ||
        torrent.webseedsSendingToUs ||
        torrent.status === TorrentStatus.Check
      )
    case 'downloading':
      return [TorrentStatus.DownloadWait, TorrentStatus.Download].includes(torrent.status)
    case 'paused':
      return torrent.status === TorrentStatus.Stopped
    case 'seeding':
      return [TorrentStatus.Seed, TorrentStatus.SeedWait].includes(torrent.status)
    case 'finished':
      return torrent.isFinished
    default:
      return true
  }
}

const isTrackerFiltered = (trackers: string[], torrent: ITorrent) => {
  if (!trackers.length) return true

  let found = false
  torrent.trackers.forEach((t: Tracker) => {
    if (trackers.includes(t.sitename)) {
      found = true
    }
  })

  return found
}

const isLabelFiltered = (labels: string[], torrent: ITorrent) => {
  if (!labels.length) return true

  let found = false
  torrent.labels.forEach((l: string) => {
    if (labels.includes(l)) {
      found = true
    }
  })

  return found
}

const isTextFiltered = (text: string, torrent: ITorrent) => {
  if (!text.length) return true

  return torrent.name.toLowerCase().match(text.toLowerCase())
}

export const Torrent = ({torrent} : {torrent: ITorrent}) => {
  const { filterStatus, filterTrackers, filterLabels, filterText } = useClientContext()
  if (
    !isStatusFiltered(filterStatus, torrent) ||
    !isTrackerFiltered(filterTrackers, torrent) ||
    !isLabelFiltered(filterLabels, torrent) ||
    !isTextFiltered(filterText, torrent)
  ) {
    return null
  }

  return (
    <TorrentProvider torrent={torrent}>
      <Card>
        <CardHeader p={3} pt={2} pb={0} display='flex'>
          <Text
            isTruncated
            fontWeight='bold'
            display='block'
          >
            {torrent.name}
          </Text>
          <Labels
            ml={3}
          />
        </CardHeader>
        <CardBody p={3} pt={0} pb={2}>
          <Stack direction='row' fontSize='.8em'>
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
    </TorrentProvider>
  )
}
