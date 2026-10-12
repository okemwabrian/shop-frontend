import { useQuery } from '@tanstack/react-query'
import { adminOrders } from '../../api/admin.js'

export default function AdminOrders() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminOrders({ size: 25 }),
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading orders…</p>
  if (isError || !data) return <p className="text-sm text-red-600">Unable to load orders.</p>

  const orders = data.content ?? data ?? []

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
      <div className="mt-4 space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-gray-900">{order.orderNumber ?? `Order #${order.id}`}</p>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-700">
                {order.status ?? 'NEW'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {order.customerName ?? 'Customer'} • KES {Number(order.total ?? 0).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
