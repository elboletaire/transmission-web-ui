import axios from 'axios'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { ReactNode } from 'react'

type ClientProviderProps = {
  rpc?: string
}

export type RpcActionData = {
  method: string
  arguments?: any
}

export const useClientProvider = ({ rpc: r }: ClientProviderProps) => {
  const [connected, setConnected] = useState<boolean>(false)
  const [connecting, setConnecting] = useState<boolean>(false)
  const [rpc, setRpc] = useState<string>(r as string)
  const [sessid, setSessid] = useState<string>('')
  const [session, setSession] = useState<any>({})

  // helper function to make requests passing our sessid
  const makeRequest = useCallback(
    async (method: string, args?: any) => {
      const data: RpcActionData = {
        method,
      }
      if (args) {
        data.arguments = args
      }

      return await axios
        .post(rpc, data, {
          headers: {
            'x-transmission-session-id': sessid,
          },
        })
        .catch(catchSessionError)
    },
    [rpc, sessid]
  )

  const catchSessionError = (error: any) => {
    if (error.response && error.response.status === 409 && error.response.headers['x-transmission-session-id']) {
      setSessid(error.response.headers['x-transmission-session-id'])
      console.info('set sessionid:', error.response.headers['x-transmission-session-id'])
      return
    }

    return error
  }

  // sets rpc
  useEffect(() => {
    if (!r || rpc) return

    setRpc(r)
  }, [rpc, r])

  // fetch session id
  useEffect(() => {
    if (!rpc || sessid) return

    setConnecting(true)
    ;(async () => {
      await makeRequest('session-get')
    })()
  }, [makeRequest, rpc, sessid])

  // fetch session info
  useEffect(() => {
    if (!sessid.length || !rpc || Object.values(session).length > 0) return
    ;(async () => {
      await makeRequest('session-get')
        .then(({ data }) => {
          setConnected(true)
          setConnecting(false)
          setSession(data.arguments)
        })
        // ignore error (we catch it in makeRequest, but here we silence a possible error)
        .catch(() => null)
    })()
  }, [makeRequest, rpc, sessid.length, session])

  return {
    connected,
    connecting,
    makeRequest,
    fetchSession: () => makeRequest('session-get'),
    rpc,
    sessid,
    setRpc,
  }
}

export type ClientState = ReturnType<typeof useClientProvider>

export const ClientContext = createContext<ClientState | undefined>(undefined)
ClientContext.displayName = 'ClientContext'

export const useClient = () => {
  const ctxt = useContext(ClientContext)

  if (!ctxt) {
    throw new Error(
      'useClientContext returned `undefined`, maybe you forgot to wrap the component within <ClientProvider />?'
    )
  }

  return ctxt
}

type ClientProviderComponentProps = ClientProviderProps & {
  children?: ReactNode
}

export const ClientProvider = ({ rpc, ...rest }: ClientProviderComponentProps) => {
  const value = useClientProvider({ rpc })

  return <ClientContext.Provider value={value} {...rest} />
}
