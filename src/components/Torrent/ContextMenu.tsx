import {
  Button,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useModals } from '../../hooks/use-modals'
import { useTorrent } from '../../hooks/use-torrent'
import { useTorrents } from '../../hooks/use-torrents'

export const TorrentContextMenu = () => {
  const { torrent } = useTorrent()
  const { editLabels, removeTorrents } = useTorrents()
  const { openConfirmRemove, closeConfirmRemove, confirmRemove } = useModals()

  return (
    <>
      <MenuList py={0}>
        <MenuItem color='pink' onClick={openConfirmRemove}>
          Remove torrent
        </MenuItem>
        <MenuItem onClick={() => editLabels(torrent)}>Set labels</MenuItem>
      </MenuList>

      <Modal isOpen={confirmRemove} onClose={closeConfirmRemove}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm removal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to remove <strong>{torrent.name}</strong>?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={closeConfirmRemove}>
              Cancel
            </Button>
            <Button
              variant='ghost'
              colorScheme='pink'
              onClick={() => removeTorrents([torrent.id], false)}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
