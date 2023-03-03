import { useDisclosure } from '@chakra-ui/react'
import { createContext, ReactNode, useContext } from 'react'

export const useModalsProvider = () => {
  const {
    isOpen: confirmRemove,
    onClose: closeConfirmRemove,
    onOpen: openConfirmRemove,
  } = useDisclosure()

  return {
    confirmRemove,
    closeConfirmRemove,
    openConfirmRemove,
  }
}

export type ModalsState = ReturnType<typeof useModalsProvider>

export const ModalsContext = createContext<ModalsState | undefined>(undefined)
ModalsContext.displayName = 'ModalsContext'

export const useModals = () => {
  const ctxt = useContext(ModalsContext)

  if (!ctxt) {
    throw new Error(
      'useModals returned `undefined`, maybe you forgot to wrap the component within <ModalsProvider />?'
    )
  }

  return ctxt
}

type ModalsProviderComponentProps = {
  children?: ReactNode
}

export const ModalsProvider = (props: ModalsProviderComponentProps) => {
  const value = useModalsProvider()

  return <ModalsContext.Provider value={value} {...props} />
}
