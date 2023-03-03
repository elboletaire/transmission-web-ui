import { createContext, ReactNode, useContext, useState } from 'react'

type SettingsProviderProps = {}

export const useSettingsProvider = () => {
  const [loading, setLoading] = useState<boolean>(false)
  // const { makeRequest } = useClient()

  return {
    loading,
    setLoading,
  }
}

export type SettingsState = ReturnType<typeof useSettingsProvider>

export const SettingsContext = createContext<SettingsState | undefined>(
  undefined
)
SettingsContext.displayName = 'SettingsContext'

export const useSettings = () => {
  const ctxt = useContext(SettingsContext)

  if (!ctxt) {
    throw new Error(
      'useSettings returned `undefined`, maybe you forgot to wrap the component within <SettingsProvider />?'
    )
  }

  return ctxt
}

type SettingsProviderComponentProps = SettingsProviderProps & {
  children?: ReactNode
}

export const SettingsProvider = (props: SettingsProviderComponentProps) => {
  const value = useSettingsProvider()

  return <SettingsContext.Provider value={value} {...props} />
}
