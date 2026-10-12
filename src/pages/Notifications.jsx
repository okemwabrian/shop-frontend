import { Link } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext.jsx'

export default function Notifications() {
  const { items, unread, markRead, markAllRead } = useNotifications()

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Inbox</p>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={() => markAllRead()}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700"
          >
            Mark all read
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600">
        {unread > 0 ? `${unread} unread` : 'All caught up'}
      </p>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border bg-white p-4 shadow-sm ${notification.seen ? 'border-gray-200' : 'border-orange-200 bg-orange-50/40'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                </div>

                {!notification.seen && (
                  <button
                    type="button"
                    onClick={() => markRead(notification.id)}
                    className="shrink-0 rounded-md bg-orange-600 px-2.5 py-1.5 text-xs font-semibold text-white"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/" className="inline-block text-sm font-medium text-orange-600 underline">
        Back to shop
      </Link>
    </div>
  )
}
