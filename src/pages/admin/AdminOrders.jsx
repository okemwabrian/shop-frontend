import { useState } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  adminOrders,
  customerWhatsapp,
  updateOrderStatus,
} from '../../api/admin.js'
import { errorMessage } from '../../api/client.js'
import Loading from '../../components/Loading.jsx'
import Pagination from '../../components/Pagination.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { formatDate, money } from '../../utils/format.js'
import { openInNewTab } from '../../utils/links.js'

const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

function nextStatuses(current) {
  if (current === 'DELIVERED' || current === 'CANCELLED') return []
  const currentIndex = statuses.indexOf(current)
  return statuses.filter(
    (status) =>
      status === 'CANCELLED' ||
      (currentIndex >= 0 && statuses.indexOf(status) > currentIndex),
  )
}

export default function AdminOrders() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const orders = useQuery({
    queryKey: ['admin-orders', status, page],
    queryFn: () =>
      adminOrders({ status: status || undefined, page, size: 10 }),
    placeholderData: keepPreviousData,
  })
  const change = useMutation({
    mutationFn: ({ id, next }) => updateOrderStatus(id, next),
    onSuccess: async () => {
      toast.success('Order updated')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['stat'] }),
      ])
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  async function whatsapp(id) {
    try {
      await openInNewTab(() => customerWhatsapp(id))
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  function pick(nextStatus) {
    setStatus(nextStatus)
    setPage(0)
  }

  const chip = (active) =>
    `rounded-full border px-3 py-1 text-sm ${
      active
        ? 'border-orange-600 bg-orange-600 text-white'
        : 'border-gray-300 bg-white'
    }`
  const data = orders.data

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => pick('')} className={chip(status === '')}>
          All
        </button>
        {statuses.map((orderStatus) => (
          <button
            type="button"
            key={orderStatus}
            onClick={() => pick(orderStatus)}
            className={chip(status === orderStatus)}
          >
            {orderStatus}
          </button>
        ))}
      </div>

      {orders.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {errorMessage(orders.error)}
        </p>
      )}
      {orders.isPending && <Loading />}
      {data && data.content.length === 0 && (
        <p className="text-gray-500">No orders here.</p>
      )}
      {data?.content.map((order) => (
        <article
          key={order.id}
          className={`rounded-lg border border-gray-200 bg-white p-4 ${
            orders.isPlaceholderData ? 'opacity-60' : ''
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-xs text-gray-500">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <p className="mt-2 text-sm">
            {[order.shippingName, order.shippingPhone, order.shippingAddress, order.shippingCity]
              .filter(Boolean)
              .join(', ')}
          </p>
          <p className="font-bold text-orange-600">{money(order.total)}</p>

          <details className="mt-2 text-sm">
            <summary className="cursor-pointer text-gray-600">
              {order.items?.length ?? 0} item(s)
            </summary>
            <ul className="mt-1 list-disc pl-5 text-gray-700">
              {(order.items || []).map((item) => (
                <li key={`${order.id}-${item.productId}`}>
                  {item.quantity} x {item.productName ?? item.name} (
                  {money(item.lineTotal ?? item.unitPrice * item.quantity)})
                </li>
              ))}
            </ul>
          </details>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {nextStatuses(order.status).length > 0 && (
              <select
                value=""
                aria-label={`Update status for ${order.orderNumber}`}
                onChange={(event) => {
                  if (event.target.value) {
                    change.mutate({ id: order.id, next: event.target.value })
                  }
                }}
                disabled={change.isPending}
                className="rounded-md border border-gray-300 px-2 py-1.5 text-sm disabled:opacity-60"
              >
                <option value="">Move to...</option>
                {nextStatuses(order.status).map((nextStatus) => (
                  <option key={nextStatus} value={nextStatus}>
                    {nextStatus}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => whatsapp(order.id)}
              className="text-sm text-green-700"
            >
              WhatsApp customer
            </button>
          </div>
        </article>
      ))}
      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={setPage}
        />
      )}
    </div>
  )
}
