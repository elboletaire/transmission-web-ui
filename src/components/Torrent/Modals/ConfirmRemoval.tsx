import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useTorrent } from '../../../hooks/use-torrent'
import { useTorrents } from '../../../hooks/use-torrents'

type ConfirmRemovalProps = {
  isConfirmOpen: boolean
  onConfirmClose: () => void
}

export const ConfirmRemoval = ({ isConfirmOpen, onConfirmClose }: ConfirmRemovalProps) => {
  const { torrent } = useTorrent()
  const { removeTorrents } = useTorrents()

  return (
    <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
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
          <Button mr={3} onClick={onConfirmClose}>
            Cancel
          </Button>
          <Button variant='ghost' colorScheme='pink' onClick={() => removeTorrents([torrent.id], false)}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
