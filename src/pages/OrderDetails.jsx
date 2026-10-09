import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import {
  cancelOrder,
  getOrder,
  getOrderWhatsapp,
} from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { formatDate, money } from '../utils/format.js'
import { openInNewTab } from '../utils/links.js'

const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
const buttonClass =
  'rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50'

export default function OrderDetails() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const [whatsappBusy, setWhatsappBusy] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setOrder(null)

    getOrder(id)
      .then((result) => {
        if (active) setOrder(result)
      })
      .catch((err) => {
        if (!active) return
        setError(
          err.response?.status === 404
            ? 'Order not found'
            : errorMessage(err),
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  async function cancel() {
    if (!window.confirm('Cancel this order?')) return

    setActionError('')
    setBusy(true)
    try {
      setOrder(await cancelOrder(order.id))
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function whatsapp() {
    setActionError('')
    setWhatsappBusy(true)
    try {
      await openInNewTab(() => getOrderWhatsapp(order.id))
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setWhatsappBusy(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorBox message={error} />
  if (!order) return <ErrorBox message="Order not found" />

  const current = steps.indexOf(order.status)
  const cancellable =
    order.status === 'PENDING' || order.status === 'CONFIRMED'

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {location.state?.justPlaced && (
        <p className="rounded-md bg-green-50 p-4 text-green-800">
          Thank you! Your order has been placed. We will contact you about
          delivery.
        </p>
      )}
      <Link to="/orders" className="text-sm text-orange-600">
        Back to my orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.status === 'CANCELLED' ? (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          This order was cancelled.
        </p>
      ) : (
        <ol aria-label="Order progress" className="flex gap-2">
          {steps.map((step, index) => {
            const done = index <= current
            const textClass = done
              ? 'font-semibold text-orange-600'
              : 'text-gray-400'
            const barClass = done ? 'bg-orange-600' : 'bg-gray-200'
            return (
              <li
                key={step}
                className={`flex-1 text-center text-xs ${textClass}`}
              >
                <div className={`mb-1 h-2 rounded-full ${barClass}`} />
                {step}
              </li>
            )
          })}
        </ol>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-2 font-semibold">Items</h2>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center gap-3 py-2"
            >
              <img
                src={item.imageUrl || 'https://placehold.co/600x400?text=No+image'}
                alt={item.productName}
                className="h-14 w-14 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/products/${item.productId}`}
                  className="text-sm font-medium hover:text-orange-600"
                >
                  {item.productName}
                </Link>
                <p className="text-xs text-gray-500">
                  {item.quantity} x {money(item.unitPrice)}
                </p>
              </div>
              <p className="text-sm font-semibold">{money(item.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-gray-200 pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{money(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>
              {order.shippingFee === 0 ? 'Free' : money(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{money(order.total)}</span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <h2 className="mb-2 font-semibold">Delivery</h2>
        <p>
          {order.shippingName}, {order.shippingPhone}
        </p>
        <p>
          {order.shippingAddress}, {order.shippingCity}
        </p>
        <p className="mt-1 text-gray-500">
          Payment: {order.paymentMethod.replaceAll('_', ' ').toLowerCase()}
        </p>
      </section>

      {actionError && <ErrorBox message={actionError} />}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={whatsapp}
          disabled={whatsappBusy}
          className={`${buttonClass} border-green-600 text-green-700`}
        >
          {whatsappBusy ? 'Opening WhatsApp...' : 'Ask about this order on WhatsApp'}
        </button>
        {cancellable && (
          <button
            type="button"
            onClick={cancel}
            disabled={busy}
            className={`${buttonClass} border-red-300 text-red-600`}
          >
            {busy ? 'Cancelling...' : 'Cancel order'}
          </button>
        )}
      </div>
    </div>
  )
}
