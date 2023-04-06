import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
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
import { HiOutlineFolderOpen } from 'react-icons/hi'
import { useTorrent } from '../../../hooks/use-torrent'
import { ModalFooter } from './ModalFooter'

type SetLocationProps = {
  isOpen: boolean
  close: () => void
}

export const SetLocation = ({ isOpen, close }: SetLocationProps) => {
  const { torrent, loading, setLocation } = useTorrent()
  const [loc, setLoc] = useState<string>(torrent.downloadDir)
  const [move, setMove] = useState<boolean>(false)

  return (
    <Modal isOpen={isOpen} onClose={close} size={['xs', 'md', 'xl']}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>
            Set a new location for <strong>{torrent.name}</strong>
          </Text>
          <InputGroup>
            <InputLeftAddon children={<HiOutlineFolderOpen />} />
            <Input autoFocus placeholder='path location' value={loc} onChange={(e) => setLoc(e.target.value)} />
          </InputGroup>
          <FormControl display='flex' alignItems='center' mt={2}>
            <Switch id='data-removal' checked={move} onChange={(e) => setMove(e.target.checked)} />
            <FormLabel htmlFor='data-removal' mb={1} ml={2}>
              Move data to new location
            </FormLabel>
          </FormControl>
        </ModalBody>
        <ModalFooter close={close}>
          <Button
            variant='ghost'
            colorScheme='green'
            disabled={loading}
            isLoading={loading}
            onClick={() => setLocation(loc, move).finally(close)}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
