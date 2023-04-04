import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { LocalSettingsProvider } from './hooks/use-local-settings'
import { ClientProvider } from './hooks/use-rpc'
import { SettingsProvider } from './hooks/use-settings'
import { TorrentsProvider } from './hooks/use-torrents'
import { theme } from './theme'

export const Providers = ({ children }: { children: ReactNode }) => (
  <ChakraProvider theme={theme}>
    <LocalSettingsProvider>
      <ClientProvider rpc={process.env.REACT_APP_RPC || ''}>
        <SettingsProvider>
          <TorrentsProvider>{children}</TorrentsProvider>
        </SettingsProvider>
      </ClientProvider>
    </LocalSettingsProvider>
  </ChakraProvider>
)
