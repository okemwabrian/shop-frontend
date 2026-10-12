import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext.jsx'
import { formatDate } from '../utils/format.js'

const targets = { ORDER: '/orders', SUPPORT: '/support' }

export default function NotificationBell() {
  const { items, unread, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const close = () => setOpen(false)

  async function openItem(notification) {
    if (!notification.seen) {
      try {
        await markRead(notification.id)
      } catch {
        toast.error('Could not mark notification as read')
      }
    }

    close()
    const target = Object.hasOwn(targets, notification.type)
      ? targets[notification.type]
      : undefined
    if (target) navigate(target)
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead()
    } catch {
      toast.error('Could not mark notifications as read')
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative text-gray-700 hover:text-orange-600"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-xs text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={close}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 z-20 mt-2 w-80 max-w-[90vw] rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
              <p className="font-semibold">Notifications</p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs text-orange-600"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 && (
                <p className="p-4 text-sm text-gray-500">No notifications yet.</p>
              )}
              {items.slice(0, 8).map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() => openItem(notification)}
                  className={`block w-full border-b border-gray-50 px-4 py-3 text-left text-sm hover:bg-gray-50 ${
                    notification.seen ? '' : 'bg-orange-50'
                  }`}
                >
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-gray-600">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(notification.createdAt)}
                  </p>
                </button>
              ))}
            </div>
            <Link
              to="/notifications"
              onClick={close}
              className="block px-4 py-2 text-center text-sm text-orange-600"
            >
              See all
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
