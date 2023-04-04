import { MenuItem, MenuList, useDisclosure } from '@chakra-ui/react'
import { ConfirmRemoval } from './Modals/ConfirmRemoval'
import { SetLabels } from './Modals/SetLabels'

export const TorrentContextMenu = () => {
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
  const { isOpen: isLabelsEditorOpen, onOpen: onLabelsOpen, onClose: closeLabelsEditor } = useDisclosure()

  return (
    <>
      <MenuList py={0}>
        <MenuItem color='pink' onClick={onConfirmOpen}>
          Remove torrent
        </MenuItem>
        <MenuItem onClick={onLabelsOpen}>Set labels</MenuItem>
      </MenuList>

      <ConfirmRemoval isConfirmOpen={isConfirmOpen} onConfirmClose={onConfirmClose} />
      <SetLabels isLabelsEditorOpen={isLabelsEditorOpen} closeLabelsEditor={closeLabelsEditor} />
    </>
  )
}
