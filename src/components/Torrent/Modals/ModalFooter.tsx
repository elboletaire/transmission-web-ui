import { Button, ButtonGroup, ModalFooter as CModalFooter } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type ModalFooterProps = {
  close: () => void
}

export const ModalFooter = ({ close, children }: PropsWithChildren<ModalFooterProps>) => {
  return (
    <CModalFooter>
      <ButtonGroup gap={2}>
        <Button variant='ghost' onClick={close}>
          Cancel
        </Button>
        {children}
      </ButtonGroup>
    </CModalFooter>
  )
}
