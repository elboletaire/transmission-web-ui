import { chakra, ChakraComponent, Stack, StackProps, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react'
import { FaTag } from 'react-icons/fa'
import { useTorrentContext } from '.'

const _Labels = (props : ChakraComponent<'div', StackProps>) => {
  const { torrent: { labels }} = useTorrentContext()

  if (!labels.length) return null

  return (
    <Stack direction='row' spacing={2} display='inline-block' {...props}>
      {
        labels.map((label) => (
          <Tag key={label}>
            <TagLeftIcon as={FaTag} boxSize='10px' />
            <TagLabel>{label}</TagLabel>
          </Tag>
        ))
      }
    </Stack>
  )
}

export const Labels = chakra(_Labels)
Labels.displayName = 'Labels'
