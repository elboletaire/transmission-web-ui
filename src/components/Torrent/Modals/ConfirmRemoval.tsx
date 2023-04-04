import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTorrent } from '../../../hooks/use-torrent'
import { useTorrents } from '../../../hooks/use-torrents'

type ConfirmRemovalProps = {
  isConfirmOpen: boolean
  onConfirmClose: () => void
}

export const ConfirmRemoval = ({ isConfirmOpen, onConfirmClose }: ConfirmRemovalProps) => {
  const { torrent } = useTorrent()
  const { removeTorrents } = useTorrents()
  const [removeData, setRemoveData] = useState<boolean>(false)

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
          <FormControl display='flex' alignItems='center' mt={2}>
            <Switch id='data-removal' checked={removeData} onChange={(e) => setRemoveData(e.target.checked)} />
            <FormLabel htmlFor='data-removal' mb={1} ml={2}>
              Also remove data (action cannot be undone!)
            </FormLabel>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onConfirmClose}>
            Cancel
          </Button>
          <Button variant='ghost' colorScheme='pink' onClick={() => removeTorrents([torrent.id], removeData)}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
