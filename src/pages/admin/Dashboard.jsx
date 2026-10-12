import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getProducts } from '../../api/shop.js'
import { adminOrders, adminTickets, getConversations } from '../../api/admin.js'
import { useAuth } from '../../context/AuthContext.jsx'

function Stat({ label, value, to }) {
  return (
    <Link
      to={to}
      className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-orange-600">{value ?? '-'}</p>
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user.role === 'ADMIN'
  const pending = useQuery({
    queryKey: ['stat', 'orders-pending'],
    queryFn: () => adminOrders({ status: 'PENDING', size: 1 }),
    enabled: isAdmin,
  })
  const products = useQuery({
    queryKey: ['stat', 'products'],
    queryFn: () => getProducts({ size: 1 }),
    enabled: isAdmin,
  })
  const tickets = useQuery({
    queryKey: ['stat', 'tickets-open'],
    queryFn: () => adminTickets({ status: 'OPEN', size: 1 }),
  })
  const chats = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  })
  const hasError =
    pending.isError || products.isError || tickets.isError || chats.isError

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        Hello, {(user.fullName || user.name || 'there').split(' ')[0]}
      </h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isAdmin && (
          <>
            <Stat
              label="Orders waiting"
              value={pending.data?.totalElements}
              to="/admin/orders"
            />
            <Stat
              label="Products"
              value={products.data?.totalElements}
              to="/admin/products"
            />
          </>
        )}
        <Stat
          label="Open tickets"
          value={tickets.data?.totalElements}
          to="/admin/tickets"
        />
        <Stat
          label="Chat conversations"
          value={chats.data?.length}
          to="/admin/chat"
        />
      </div>
      {hasError && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          Some dashboard figures could not be loaded. Refresh to try again.
        </p>
      )}
    </div>
  )
}
