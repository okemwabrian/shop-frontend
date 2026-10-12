import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteNotification, getNotifications } from '../api/shop.js'
import { errorMessage } from '../api/client.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import Pagination from '../components/Pagination.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { formatDate } from '../utils/format.js'

export default function Notifications() {
  const { refresh, markRead, markAllRead, unread } = useNotifications()
  const [page, setPage] = useState(0)
  const notifications = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => getNotifications({ page, size: 15 }),
  })
  const data = notifications.data

  async function act(action) {
    try {
      await action()
      await Promise.all([
        notifications.refetch({ throwOnError: true }),
        refresh(),
      ])
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  if (notifications.isError) {
    return <ErrorBox message={errorMessage(notifications.error)} />
  }
  if (notifications.isPending || !data) return <Loading />

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unread > 0 && (
          <button
            type="button"
            onClick={() => act(markAllRead)}
            className="text-sm text-orange-600"
          >
            Mark all as read
          </button>
        )}
      </div>
      {data.content.length === 0 && (
        <p className="text-gray-500">Nothing here yet.</p>
      )}
      <div className="space-y-2">
        {data.content.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg border p-4 ${
              notification.seen
                ? 'border-gray-200 bg-white'
                : 'border-orange-200 bg-orange-50'
            }`}
          >
            <p className="font-semibold">{notification.title}</p>
            <p className="text-sm text-gray-700">{notification.message}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>{formatDate(notification.createdAt)}</span>
              <span className="space-x-3 text-sm">
                {!notification.seen && (
                  <button
                    type="button"
                    onClick={() => act(() => markRead(notification.id))}
                    className="text-orange-600"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => act(() => deleteNotification(notification.id))}
                  className="text-red-600"
                >
                  Delete
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={data.totalPages}
        onChange={setPage}
      />
    </div>
  )
}
