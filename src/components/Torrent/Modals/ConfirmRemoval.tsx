import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTorrent } from '../../../hooks/use-torrent'
import { ModalFooter } from './ModalFooter'

type ConfirmRemovalProps = {
  isOpen: boolean
  close: () => void
}

export const ConfirmRemoval = ({ isOpen, close }: ConfirmRemovalProps) => {
  const { loading, torrent, remove } = useTorrent()
  const [removeData, setRemoveData] = useState<boolean>(false)

  return (
    <Modal isOpen={isOpen} onClose={close}>
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
        <ModalFooter close={close}>
          <Button
            disabled={loading}
            isLoading={loading}
            variant='ghost'
            colorScheme='red'
            onClick={() => remove(removeData)}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
