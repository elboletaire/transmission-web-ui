import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { CreatableSelect } from 'chakra-react-select'
import { useState } from 'react'
import { useTorrent } from '../../../hooks/use-torrent'
import { useTorrents } from '../../../hooks/use-torrents'
import { ModalFooter } from './ModalFooter'

type SetLabelsProps = {
  isOpen: boolean
  close: () => void
}

export const SetLabels = ({ isOpen, close }: SetLabelsProps) => {
  const { labels } = useTorrents()
  const { torrent, updateLabels, loading } = useTorrent()
  const [newLabels, setNewLabels] = useState<string[]>([])

  return (
    <Modal isOpen={isOpen} onClose={close} size={['xs', 'md', 'xl']}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set labels for {torrent.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreatableSelect
            autoFocus
            isMulti
            options={labels.map((l) => ({
              label: l,
              value: l,
            }))}
            defaultValue={torrent.labels.map((l) => ({
              label: l,
              value: l,
            }))}
            onChange={(values) => {
              setNewLabels(values.map(({ value }) => value))
            }}
          />
        </ModalBody>
        <ModalFooter close={close}>
          <Button
            disabled={loading}
            isLoading={loading}
            variant='ghost'
            colorScheme='green'
            onClick={() => updateLabels(newLabels).then(close)}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
