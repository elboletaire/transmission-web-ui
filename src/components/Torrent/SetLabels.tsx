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
import { useTorrents } from '../../hooks/use-torrents'

export const SetLabels = () => {
  const {
    list,
    labels,
    selected,
    updateLabels,
    isLabelsEditorOpen,
    closeLabelsEditor,
  } = useTorrents()
  const [newLabels, setNewLabels] = useState<string[]>([])
  const [saving, setSaving] = useState<boolean>(false)

  const found = Object.values(list).find(({ id }) => id === selected)

  return (
    <Modal isOpen={isLabelsEditorOpen} onClose={closeLabelsEditor}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set labels for {found?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreatableSelect
            isMulti
            options={labels.map((l) => ({
              label: l,
              value: l,
            }))}
            defaultValue={found?.labels.map((l) => ({
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
              if (!found) {
                return
              }
              setSaving(true)

              try {
                await updateLabels([found.id], newLabels)
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
