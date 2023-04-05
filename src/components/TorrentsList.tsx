import { Flex, Stack } from '@chakra-ui/react'
import { useLocalSettings } from '../hooks/use-local-settings'
import { useTorrents } from '../hooks/use-torrents'
import { Torrent } from './Torrent'

export const TorrentsList = () => {
  const { list, select, selectSingle } = useTorrents()
  const { layout } = useLocalSettings()

  return (
    <Flex mt={3}>
      <Stack spacing={layout === 'compact' ? 2 : 3} w='full'>
        {Object.values(list).map((torrent) => (
          <Torrent
            key={torrent.id}
            torrent={torrent}
            onClick={(e) => {
              if (!e.ctrlKey) {
                return selectSingle(torrent.id)
              }

              select(torrent.id)
            }}
            onTouchEnd={() => select(torrent.id)}
          />
        ))}
      </Stack>
    </Flex>
  )
}
