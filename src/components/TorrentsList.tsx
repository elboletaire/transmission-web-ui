import { Flex, Stack } from '@chakra-ui/react'
import { useLocalSettings } from '../hooks/use-local-settings'
import { useTorrents } from '../hooks/use-torrents'
import { Torrent } from './Torrent'
import { SetLabels } from './Torrent/SetLabels'

export const TorrentsList = () => {
  const { list, setSelected } = useTorrents()
  const { layout } = useLocalSettings()

  return (
    <Flex mt={3}>
      <Stack spacing={layout === 'compact' ? 1 : 3} w='full'>
        {Object.values(list).map((torrent) => (
          <Torrent
            key={torrent.id}
            torrent={torrent}
            onDoubleClick={() => setSelected(torrent.id)}
          />
        ))}
      </Stack>
      <SetLabels />
    </Flex>
  )
}
