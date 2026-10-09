import { useState } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import { useCart } from '../context/CartContext.jsx'
import { money } from '../utils/format.js'

const qtyButton = 'h-8 w-8 rounded-md border border-gray-300 bg-white'

export default function Cart() {
  const { cart, loading, error: loadError, refresh, setQuantity, remove } = useCart()
  const [error, setError] = useState('')

  async function run(action) {
    setError('')
    try {
      await action()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  if (loading) return <Loading />

  if (loadError && cart.items.length === 0) {
    return (
      <div className="space-y-3">
        <ErrorBox message={loadError} />
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

  if (cart.items.length === 0) {
    return (
      <div className="py-16 text-center">
        {loadError && <ErrorBox message={loadError} />}
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">
          Find something you like and add it here.
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-md bg-orange-600 px-5 py-2 font-semibold text-white"
        >
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <h1 className="text-2xl font-bold">
          Your cart ({cart.totalItems} items)
        </h1>
        {error && <ErrorBox message={error} />}
        {loadError && <ErrorBox message={loadError} />}
        {cart.items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 rounded-lg border border-gray-200 bg-white p-3"
          >
            <img
              src={item.imageUrl || 'https://placehold.co/600x400?text=No+image'}
              alt={item.name}
              className="h-24 w-24 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link
                to={`/products/${item.productId}`}
                className="font-medium hover:text-orange-600"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-500">
                {money(item.unitPrice)} each
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Decrease ${item.name} quantity`}
                  className={qtyButton}
                  onClick={() =>
                    run(() => setQuantity(item.productId, item.quantity - 1))
                  }
                >
                  -
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${item.name} quantity`}
                  className={qtyButton}
                  onClick={() =>
                    run(() => setQuantity(item.productId, item.quantity + 1))
                  }
                >
                  +
                </button>
                <button
                  type="button"
                  className="ml-3 text-sm text-red-600 hover:text-red-700"
                  onClick={() => run(() => remove(item.productId))}
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="shrink-0 font-semibold">{money(item.lineTotal)}</p>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-bold">Order summary</h2>
        <div className="space-y-2 text-sm">
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
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
            <span>Total</span>
            <span>{money(cart.total)}</span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="mt-4 block rounded-md bg-orange-600 py-2.5 text-center font-semibold text-white hover:bg-orange-700"
        >
          Proceed to checkout
        </Link>
        <p className="mt-2 text-xs text-gray-500">
          Free delivery on orders from KES 5,000.
        </p>
      </aside>
    </div>
  )
}
