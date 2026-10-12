import { useQuery } from '@tanstack/react-query'
import * as adminApi from '../../api/admin.js'

export default function AdminChat() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-chat'],
    queryFn: adminApi.getAdminChat,
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading chat inbox…</p>
  if (isError || !data) return <p className="text-sm text-red-600">Unable to load chat inbox.</p>

  const chats = data.messages ?? data ?? []

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Live chat inbox</h2>
      <div className="mt-4 space-y-3">
        {chats.length === 0 ? (
          <p className="text-sm text-gray-500">No chats right now.</p>
        ) : (
          chats.map((chat, index) => (
            <div key={`${chat.user ?? 'chat'}-${index}`} className="rounded-lg border border-gray-200 p-4">
              <p className="font-medium text-gray-900">{chat.user ?? 'Customer'}</p>
              <p className="mt-2 text-sm text-gray-600">{chat.message ?? 'No recent message.'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
