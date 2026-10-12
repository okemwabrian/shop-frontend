import { useQuery } from '@tanstack/react-query'
import { adminTickets } from '../../api/admin.js'

export default function AdminTickets() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: () => adminTickets({ size: 25 }),
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading tickets…</p>
  if (isError || !data) return <p className="text-sm text-red-600">Unable to load tickets.</p>

  const tickets = data.content ?? data ?? []

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Support tickets</h2>
      <div className="mt-4 space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-gray-900">{ticket.subject ?? 'Support request'}</p>
              <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium uppercase tracking-wide text-orange-700">
                {ticket.status ?? 'OPEN'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{ticket.message ?? 'No message provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
