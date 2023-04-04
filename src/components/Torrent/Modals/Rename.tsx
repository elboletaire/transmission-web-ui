import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useState } from 'react'
import { HiOutlinePencilAlt } from 'react-icons/hi'
import { useTorrent } from '../../../hooks/use-torrent'
import { ModalFooter } from './ModalFooter'

type RenameProps = {
  isOpen: boolean
  close: () => void
}

export const Rename = ({ close, isOpen }: RenameProps) => {
  const { torrent, loading, rename } = useTorrent()
  const [name, setName] = useState<string>(torrent.name)

  return (
    <Modal isOpen={isOpen} onClose={close} size={['xs', 'md', 'xl']}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rename torrent</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup>
            <InputLeftAddon children={<HiOutlinePencilAlt />} />
            <Input autoFocus placeholder='torrent name' value={name} onChange={(e) => setName(e.target.value)} />
          </InputGroup>
        </ModalBody>
        <ModalFooter close={close}>
          <Button
            variant='ghost'
            colorScheme='green'
            disabled={loading}
            isLoading={loading}
            onClick={() => rename(torrent.name, name).finally(close)}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
