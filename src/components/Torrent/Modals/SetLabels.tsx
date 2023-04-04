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
import { CreatableSelect } from 'chakra-react-select'
import { useState } from 'react'
import { useTorrent } from '../../../hooks/use-torrent'
import { useTorrents } from '../../../hooks/use-torrents'

type SetLabelsProps = {
  isLabelsEditorOpen: boolean
  closeLabelsEditor: () => void
}

export const SetLabels = ({ closeLabelsEditor, isLabelsEditorOpen }: SetLabelsProps) => {
  const { torrent } = useTorrent()
  const { labels, updateLabels } = useTorrents()
  const [newLabels, setNewLabels] = useState<string[]>([])
  const [saving, setSaving] = useState<boolean>(false)

  return (
    <Modal isOpen={isLabelsEditorOpen} onClose={closeLabelsEditor}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set labels for {torrent.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreatableSelect
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

        <ModalFooter>
          <Button
            disabled={saving}
            isLoading={saving}
            onClick={async () => {
              if (!torrent) {
                return
              }
              setSaving(true)

              try {
                await updateLabels([torrent.id], newLabels)
                closeLabelsEditor()
              } catch (e) {
                console.error(e)
              } finally {
                setSaving(false)
              }
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
