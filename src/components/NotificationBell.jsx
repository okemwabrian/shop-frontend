import { Link } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext.jsx'

export default function NotificationBell() {
  const { unread, items, markAllRead } = useNotifications()

  return (
    <div className="relative">
      <Link
        to="/notifications"
        className="relative inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-orange-200 hover:text-orange-600"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-orange-600 px-1 text-center text-[10px] font-semibold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </Link>

      {items.length > 0 && unread > 0 && (
        <button
          type="button"
          onClick={() => markAllRead()}
          className="absolute -bottom-3 right-0 text-[10px] uppercase tracking-wide text-orange-600"
        >
          Mark read
        </button>
      )}
    </div>
  )
}
