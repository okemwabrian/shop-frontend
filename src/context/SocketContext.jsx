import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Client } from '@stomp/stompjs'
import { useAuth } from './AuthContext.jsx'

const SocketContext = createContext(null)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const socketUrl = apiUrl.replace(/^http/, 'ws') + '/ws'

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const loggedIn = Boolean(user)
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!loggedIn || !token) return

    const client = new Client({
      brokerURL: socketUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => setConnected(true),
      onWebSocketClose: () => setConnected(false),
      onStompError: (frame) => console.warn('STOMP error:', frame.headers.message),
    })

    clientRef.current = client
    client.activate()

    return () => {
      client.deactivate()
      clientRef.current = null
      setConnected(false)
    }
  }, [loggedIn])

  const subscribe = useCallback(
    (destination, handler) => {
      const client = clientRef.current
      if (!client || !connected) return () => {}
      const sub = client.subscribe(destination, (message) =>
        handler(JSON.parse(message.body)),
      )
      return () => sub.unsubscribe()
    },
    [connected],
  )

  const send = useCallback((destination, body) => {
    clientRef.current?.publish({ destination, body: JSON.stringify(body) })
  }, [])

  return (
    <SocketContext.Provider value={{ connected, subscribe, send }}>
      {children}
    </SocketContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  return useContext(SocketContext)
}
