import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

type ConfirmModalProps = {
  onConfirm: () => void
  title?: string
  contents: () => ReactNode
}

export const ConfirmModal = ({
  contents,
  onConfirm,
  title,
}: ConfirmModalProps) => {
  const voidfunc = () => {}
  return (
    <Modal isOpen={false} onClose={voidfunc}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title ?? 'Confirm'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{contents()}</ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={voidfunc}>
            Cancel
          </Button>
          <Button variant='ghost' colorScheme='pink' onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
