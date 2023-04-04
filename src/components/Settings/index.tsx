import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { ChangeEvent } from 'react'
import { FaCogs } from 'react-icons/fa'
import { useLocalSettings } from '../../hooks/use-local-settings'

export const Settings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { fetchTorrentsTimeout, setFetchTorrentsTimeout } = useLocalSettings()

  return (
    <>
      <IconButton icon={<FaCogs />} size='sm' variant='ghost' onClick={onOpen} aria-label='Settings' />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>RPC calls interval (in ms)</FormLabel>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  console.log('new value:', parseInt(e.target.value, 10))
                  setFetchTorrentsTimeout(parseInt(e.target.value, 10))
                }}
                value={fetchTorrentsTimeout}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={onClose}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
