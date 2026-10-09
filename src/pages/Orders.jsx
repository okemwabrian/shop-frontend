import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { getOrders } from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import Pagination from '../components/Pagination.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { formatDate, money } from '../utils/format.js'

export default function Orders() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const parsedPage = Number(params.get('page') || 0)
  const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0
  const [text, setText] = useState(q)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setText(q)
  }, [q])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getOrders({ q: q || undefined, page, size: 10 })
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err) => {
        if (active) setError(errorMessage(err))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [q, page])

  function search(event) {
    event.preventDefault()
    const next = new URLSearchParams()
    if (text.trim()) next.set('q', text.trim())
    setParams(next)
  }

  function goToPage(nextPage) {
    const next = new URLSearchParams(params)
    next.set('page', String(nextPage))
    setParams(next)
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My orders</h1>
      <form onSubmit={search} className="mb-4 flex max-w-md">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Search by order number or product"
          aria-label="Search orders"
          className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-r-md bg-orange-600 px-4 text-sm text-white hover:bg-orange-700"
        >
          Search
        </button>
      </form>

      {loading && <Loading />}
      {!loading && error && <ErrorBox message={error} />}
      {!loading && !error && data && (
        data.content.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>
              {q
                ? 'No orders match your search.'
                : 'You have not placed any orders yet.'}
            </p>
            <Link to="/products" className="mt-2 inline-block text-orange-600">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.content.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-2 truncate text-sm text-gray-600">
                  {order.items
                    .map((item) => `${item.quantity} x ${item.productName}`)
                    .join(', ')}
                </p>
                <p className="mt-1 font-bold text-orange-600">
                  {money(order.total)}
                </p>
              </Link>
            ))}
          </div>
        )
      )}

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={goToPage}
        />
      )}
    </div>
  )
}
