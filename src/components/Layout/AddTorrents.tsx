import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import prettyBytes from 'pretty-bytes'
import { ChangeEvent, useEffect, useState } from 'react'
import { FiFilePlus } from 'react-icons/fi'
import { HiLink, HiOutlineFolderOpen, HiUpload } from 'react-icons/hi'
import { useClient } from '../../hooks/use-rpc'
import { AddSettings, useTorrents } from '../../hooks/use-torrents'

const fileToBase64: (file: File) => Promise<string> = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const [, data] = (reader.result as string).split(',')
      resolve(data)
    }
    reader.onerror = reject
  })

export const AddTorrents = () => {
  const toast = useToast()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { session, sessid } = useClient()
  const { add } = useTorrents()
  const [files, setFiles] = useState<FileList | null>(null)
  const [path, setPath] = useState<string | undefined>(undefined)
  const [space, setSpace] = useState<number>(0)
  const [paused, setPaused] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [magnet, setMagnet] = useState<string>('')

  const open = () => {
    setFiles(null)
    onOpen()
  }

  const send = async (settings: AddSettings) => {
    const resp = await add(settings)

    if (resp.result === 'success') {
      onClose()
      toast({
        title: 'Torrent added',
        description: resp.arguments['torrent-added'].name,
        status: 'success',
      })
      return
    }

    throw resp
  }

  const save = async () => {
    if (!files) return

    const settings: AddSettings = {
      'download-dir': path,
      paused,
    }

    setLoading(true)

    if (magnet.length) {
      settings.filename = magnet
      await send(settings)

      return
    }

    Array.from(files).forEach(async (file) => {
      try {
        settings.metainfo = await fileToBase64(file)
        await send(settings)
      } catch (e) {
        console.error('could not add torrent:', e)
      } finally {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (!sessid || path !== undefined) return

    if (session['download-dir']) {
      setPath(session['download-dir'])
    }
    if (session['download-dir-free-space']) {
      setSpace(session['download-dir-free-space'])
    }
  }, [path, sessid, session])

  return (
    <>
      <IconButton aria-label='Add torrent' variant='ghost' icon={<FiFilePlus />} onClick={open} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add torrents</ModalHeader>
          <ModalBody>
            <Tabs onChange={() => setFiles(null)}>
              <TabList>
                <Tab>Upload</Tab>
                <Tab>Magnet/URL</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack gap={1}>
                    <FormControl>
                      <FormLabel htmlFor='files'>Torrent file(s)</FormLabel>
                      <InputGroup>
                        <InputLeftAddon children={<HiUpload />} />
                        <Input
                          type='file'
                          multiple
                          id='files'
                          accept='.torrent,application/x-bittorrent'
                          pt={1}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)}
                        />
                      </InputGroup>
                      <UnorderedList>
                        {files &&
                          files?.length > 0 &&
                          Array.from(files).map((file, i) => <ListItem key={i}>{file.name}</ListItem>)}
                      </UnorderedList>
                    </FormControl>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <FormControl>
                    <FormLabel htmlFor='magnet'>Magnet or URL</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children={<HiLink />} />
                      <Input id='magnet' onChange={(e: ChangeEvent<HTMLInputElement>) => setMagnet(e.target.value)} />
                    </InputGroup>
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Stack gap={1}>
              <FormControl>
                <FormLabel htmlFor='path'>
                  Destination path <i>({prettyBytes(space)} free space)</i>
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon children={<HiOutlineFolderOpen />} />
                  <Input type='text' id='path' name='path' value={path} onChange={(e) => setPath(e.target.value)} />
                </InputGroup>
              </FormControl>
              <FormControl display='flex' alignItems='center'>
                <Switch id='paused' mr={2} size='sm' checked={paused} onChange={(e) => setPaused(e.target.checked)} />
                <FormLabel htmlFor='paused' mb='px'>
                  Add paused
                </FormLabel>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup gap={2}>
              <Button isDisabled={loading} variant='ghost' onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={loading} variant='ghost' colorScheme='green' onClick={save}>
                Add
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
