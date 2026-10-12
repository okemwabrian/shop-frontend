import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import * as shop from '../api/shop.js'
import { useAuth } from './AuthContext.jsx'
import { useSocket } from './SocketContext.jsx'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const { connected, subscribe } = useSocket()
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([])
      setUnread(0)
      return
    }

    try {
      const [page, count] = await Promise.all([
        shop.getNotifications({ size: 20 }),
        shop.getUnreadCount(),
      ])

      setItems(page?.content ?? page ?? [])
      setUnread(Number(count?.unread ?? count ?? 0))
    } catch {
      // ignore: the bell simply stays empty
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!connected) return

    return subscribe('/user/queue/notifications', (notification) => {
      setItems((current) => [notification, ...current])
      setUnread((count) => count + 1)
      toast(`${notification.title}: ${notification.message}`)
    })
  }, [connected, subscribe])

  async function markRead(id) {
    const target = items.find((notification) => notification.id === id)
    await shop.markNotificationRead(id)
    setItems((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, seen: true } : notification,
      ),
    )
    if (target && !target.seen) {
      setUnread((count) => Math.max(0, count - 1))
    }
  }

  async function markAllRead() {
    await shop.markAllNotificationsRead()
    setItems((current) => current.map((notification) => ({ ...notification, seen: true })))
    setUnread(0)
  }

  const value = { items, unread, markRead, markAllRead, refresh }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  return useContext(NotificationContext)
}
