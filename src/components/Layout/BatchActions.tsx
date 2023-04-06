import { ButtonGroup, Divider, IconButton, Stack } from '@chakra-ui/react'
import { HiPause, HiPlay, HiTrash } from 'react-icons/hi2'
import { useTorrents } from '../../hooks/use-torrents'
import { AddTorrents } from './AddTorrents'

export const BatchActions = () => {
  const { selected, start, stop } = useTorrents()
  const resume = `Resume ${selected.length} torrents`
  const pause = `Pause ${selected.length} torrents`
  const remove = `Remove ${selected.length} torrents`

  return (
    <Stack direction='row' gap={1}>
      <AddTorrents />
      <Divider orientation='vertical' />
      <ButtonGroup isAttached>
        <IconButton
          aria-label={resume}
          title={resume}
          variant='ghost'
          isDisabled={!selected.length}
          icon={<HiPlay />}
          onClick={() => start(selected)}
        />
        <IconButton
          aria-label={pause}
          title={pause}
          variant='ghost'
          isDisabled={!selected.length}
          icon={<HiPause />}
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
        icon={<HiTrash />}
        onClick={() => {}}
      />
    </Stack>
  )
}
