import { ButtonGroup, Divider, IconButton, Stack } from '@chakra-ui/react'
import { FaInfoCircle, FaPause, FaPlay, FaTrash } from 'react-icons/fa'
import { FiFilePlus } from 'react-icons/fi'
import { useTorrents } from '../../hooks/use-torrents'

export const BatchActions = () => {
  const { selected, start, stop } = useTorrents()
  const resume = `Resume ${selected.length} torrents`
  const pause = `Pause ${selected.length} torrents`
  const remove = `Remove ${selected.length} torrents`

  return (
    <Stack direction='row' gap={1}>
      <IconButton aria-label='Add torrent' variant='ghost' icon={<FiFilePlus />} onClick={() => {}} />
      <Divider orientation='vertical' />
      <ButtonGroup isAttached>
        <IconButton
          aria-label={resume}
          title={resume}
          variant='ghost'
          isDisabled={!selected.length}
          icon={<FaPlay />}
          onClick={() => start(selected)}
        />
        <IconButton
          aria-label={pause}
          title={pause}
          variant='ghost'
          isDisabled={!selected.length}
          icon={<FaPause />}
          onClick={() => stop(selected)}
        />
      </ButtonGroup>
      <Divider orientation='vertical' />
      <IconButton
        aria-label={remove}
        title={remove}
        variant='ghost'
        colorScheme='red'
        isDisabled={!selected.length}
        icon={<FaTrash />}
        onClick={() => {}}
      />
      <Divider orientation='vertical' />
      <IconButton
        aria-label='Get info from selected torrent'
        title={`Get info`}
        variant='ghost'
        colorScheme='blue'
        isDisabled={selected.length !== 1}
        icon={<FaInfoCircle />}
        onClick={() => {}}
      />
    </Stack>
  )
}
