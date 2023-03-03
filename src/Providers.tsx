import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { LocalSettingsProvider } from './hooks/use-local-settings'
import { ModalsProvider } from './hooks/use-modals'
import { ClientProvider } from './hooks/use-rpc'
import { SettingsProvider } from './hooks/use-settings'
import { TorrentsProvider } from './hooks/use-torrents'
import { theme } from './theme'

export const Providers = ({ children }: { children: ReactNode }) => (
  <ChakraProvider theme={theme}>
    <LocalSettingsProvider>
      <ClientProvider rpc={process.env.REACT_APP_RPC || ''}>
        <SettingsProvider>
          <ModalsProvider>
            <TorrentsProvider>{children}</TorrentsProvider>
          </ModalsProvider>
        </SettingsProvider>
      </ClientProvider>
    </LocalSettingsProvider>
  </ChakraProvider>
)
