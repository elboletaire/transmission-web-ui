import { Box, useColorModeValue } from '@chakra-ui/react'
import type { TorrentRowProps } from '.'
import { useTorrent } from '../../hooks/use-torrent'
import { InfoCompact } from './InfoCompact'
import { Labels } from './Labels'
import { TorrentName } from './Name'
import { Progress } from './Progress'
import { ToggleStatus } from './ToggleStatus'

export const RowCompact = ({ childRef, ...rest }: TorrentRowProps) => {
  const { selected } = useTorrent()
  const even = useColorModeValue('gray.200', 'gray.900')
  const evenselected = useColorModeValue('blue.200', 'purple.900')
  const odd = 'transparent'
  const oddselected = useColorModeValue('blue.100', 'purple.800')

  return (
    <Box
      ref={childRef}
      display='flex'
      flexDirection='column'
      bgColor={selected ? oddselected : odd}
      _even={{
        backgroundColor: selected ? evenselected : even,
      }}
      userSelect='none'
      // border={'1px solid'}
      // borderColor={selected ? 'gray' : 'transparent'}
      {...rest}
    >
      <Box display='flex' p={1}>
        <Box display='flex' flexDir='row' overflow='hidden' mr={3} justifySelf='start'>
          <TorrentName fontSize='sm' />
          <Box display='flex'>
            <Labels variant='outline' size='xs' />
          </Box>
        </Box>
        <Box display='flex' flexDir='row' alignItems='center' justifyContent='end' flexShrink={0} ml='auto' mr={1}>
          <InfoCompact />
        </Box>
        <ToggleStatus minW='auto' />
      </Box>
      <Progress w='full' size='xxs' mt={1} />
    </Box>
  )
}
