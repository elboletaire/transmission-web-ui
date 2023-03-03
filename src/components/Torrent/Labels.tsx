import { Stack, Tag, TagLabel, TagLeftIcon, TagProps } from '@chakra-ui/react'
import { FaTag } from 'react-icons/fa'
import { useTorrent } from '../../hooks/use-torrent'

export const Labels = (props: TagProps) => {
  const {
    torrent: { labels },
  } = useTorrent()

  if (!labels.length) return null

  return (
    <Stack direction='row' spacing={2}>
      {labels.map((label) => (
        <Tag key={label} {...props}>
          <TagLeftIcon as={FaTag} boxSize='10px' />
          <TagLabel>{label}</TagLabel>
        </Tag>
      ))}
    </Stack>
  )
}
