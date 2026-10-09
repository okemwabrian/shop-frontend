import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { checkout } from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { money } from '../utils/format.js'

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none'
const radioClass =
  'flex items-center gap-2 rounded-md border border-gray-200 p-3 text-sm'
const placeOrderClass =
  'w-full rounded-md bg-orange-600 py-2.5 font-semibold text-white disabled:opacity-60'

export default function Checkout() {
  const { user } = useAuth()
  const { cart, loading, error: cartError, refresh } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    shippingName: user?.fullName || user?.name || '',
    shippingPhone: user?.phone || '',
    shippingAddress: '',
    shippingCity: '',
    paymentMethod: 'CASH_ON_DELIVERY',
    notes: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [placed, setPlaced] = useState(false)

  function update(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      const order = await checkout(form)
      setPlaced(true)
      await refresh()
      navigate(`/orders/${order.id}`, {
        replace: true,
        state: { justPlaced: true },
      })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loading />
  if (cartError) {
    return (
      <div className="space-y-3">
        <ErrorBox message={cartError} />
        <button
          type="button"
          onClick={refresh}
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Try again
        </button>
      </div>
    )
  }
  if (cart.items.length === 0 && !placed) return <Navigate to="/cart" replace />

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <section className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Delivery details</h2>
          <input
            name="shippingName"
            value={form.shippingName}
            onChange={update}
            placeholder="Full name"
            autoComplete="name"
            required
            className={inputClass}
          />
          <input
            name="shippingPhone"
            type="tel"
            value={form.shippingPhone}
            onChange={update}
            placeholder="Phone number, e.g. 0712 345 678"
            autoComplete="tel"
            required
            className={inputClass}
          />
          <input
            name="shippingAddress"
            value={form.shippingAddress}
            onChange={update}
            placeholder="Street, building, house number"
            autoComplete="street-address"
            required
            className={inputClass}
          />
          <input
            name="shippingCity"
            value={form.shippingCity}
            onChange={update}
            placeholder="Town or city"
            autoComplete="address-level2"
            required
            className={inputClass}
          />
          <textarea
            name="notes"
            value={form.notes}
            onChange={update}
            rows={2}
            placeholder="Delivery notes (optional)"
            maxLength={500}
            className={inputClass}
          />
        </section>

        <section className="space-y-2 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Payment</h2>
          <label className={radioClass}>
            <input
              type="radio"
              name="paymentMethod"
              value="CASH_ON_DELIVERY"
              checked={form.paymentMethod === 'CASH_ON_DELIVERY'}
              onChange={update}
            />
            Pay on delivery
          </label>
          <label className={`${radioClass} opacity-50`}>
            <input type="radio" disabled />
            M-Pesa (coming soon)
          </label>
          <label className={`${radioClass} opacity-50`}>
            <input type="radio" disabled />
            Card (coming soon)
          </label>
        </section>
      </div>

      <aside className="h-fit space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-bold">Your order</h2>
        <ul className="space-y-1 text-sm">
          {cart.items.map((item) => (
            <li
              key={item.productId}
              className="flex justify-between gap-2"
            >
              <span className="truncate">
                {item.quantity} x {item.name}
              </span>
              <span>{money(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-gray-200 pt-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{money(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>
              {cart.shippingFee === 0 ? 'Free' : money(cart.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{money(cart.total)}</span>
          </div>
        </div>
        {error && <ErrorBox message={error} />}
        <button type="submit" disabled={busy} className={placeOrderClass}>
          {busy ? 'Placing order...' : 'Place order'}
        </button>
        <Link
          to="/cart"
          className="block text-center text-sm text-orange-600 hover:underline"
        >
          Return to cart
        </Link>
      </aside>
    </form>
  )
}
