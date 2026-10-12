import { useQuery } from '@tanstack/react-query'
import * as adminApi from '../../api/admin.js'

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-summary'],
    queryFn: adminApi.getAdminSummary,
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading summary…</p>
  if (isError || !data) return <p className="text-sm text-red-600">Unable to load dashboard.</p>

  const cards = [
    { label: 'Orders', value: data.orders ?? 0 },
    { label: 'Revenue', value: `KES ${Number(data.revenue ?? 0).toLocaleString()}` },
    { label: 'Open tickets', value: data.openTickets ?? 0 },
    { label: 'Customers', value: data.customers ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Operations</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>• Review recent customer orders and shipping status.</li>
          <li>• Access support tickets and respond to customer requests.</li>
          <li>• Manage products, prices, and categories from the admin tools.</li>
        </ul>
      </div>
    </div>
  )
}
