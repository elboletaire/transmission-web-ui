import { MenuDivider, MenuItem, MenuList, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { TorrentStatus, useTorrent } from '../../hooks/use-torrent'
import { ConfirmRemoval } from './Modals/ConfirmRemoval'
import { Rename } from './Modals/Rename'
import { SetLabels } from './Modals/SetLabels'
import { SetLocation } from './Modals/SetLocation'

export const TorrentContextMenu = () => {
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
  const { isOpen: isLabelsEditorOpen, onOpen: openLabelsEditor, onClose: closeLabelsEditor } = useDisclosure()
  const { isOpen: isLocationEditorOpen, onOpen: openLocationEditor, onClose: closeLocationEditor } = useDisclosure()
  const { isOpen: isNameEditorOpen, onOpen: openNameEditor, onClose: closeNameEditor } = useDisclosure()

  const { reannounce, torrent, start, stop, verify } = useTorrent()

  return (
    <>
      <MenuList py={0}>
        {torrent.status !== TorrentStatus.Stopped && <MenuItem onClick={stop}>Pause</MenuItem>}
        {torrent.status === TorrentStatus.Stopped && <MenuItem onClick={start}>Resume</MenuItem>}
        <MenuDivider />
        <MenuItem
          color={useColorModeValue('red.600', 'red.300')}
          onClick={onConfirmOpen}
          _hover={{ bgColor: useColorModeValue('red.700', 'red.300'), color: useColorModeValue('white', 'black') }}
        >
          Remove torrent
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={verify}>Verify local data</MenuItem>
        <MenuItem onClick={openNameEditor}>Rename</MenuItem>
        <MenuItem onClick={openLocationEditor}>Set location</MenuItem>
        <MenuItem onClick={openLabelsEditor}>Set labels</MenuItem>
        <MenuDivider />
        <MenuItem onClick={reannounce}>Reannounce</MenuItem>
      </MenuList>

      <ConfirmRemoval isOpen={isConfirmOpen} close={onConfirmClose} />
      <Rename isOpen={isNameEditorOpen} close={closeNameEditor} />
      <SetLabels isOpen={isLabelsEditorOpen} close={closeLabelsEditor} />
      <SetLocation isOpen={isLocationEditorOpen} close={closeLocationEditor} />
    </>
  )
}
