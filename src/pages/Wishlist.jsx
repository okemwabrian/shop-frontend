import { useState } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import RecentlyViewed from '../components/RecentlyViewed.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { money } from '../utils/format.js'

export default function Wishlist() {
  const {
    items,
    loading,
    error: wishlistError,
    remove,
    moveToCart,
    refresh: refreshWishlist,
  } = useWishlist()
  const { refresh: refreshCart } = useCart()
  const [error, setError] = useState('')
  const [busyProduct, setBusyProduct] = useState(null)

  async function run(productId, action) {
    setError('')
    setBusyProduct(productId)
    try {
      await action()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusyProduct(null)
    }
  }

  async function move(productId) {
    await moveToCart(productId)
    await Promise.all([refreshWishlist(), refreshCart()])
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-4 text-2xl font-bold">
          My wishlist ({items.length})
        </h1>
        {error && <ErrorBox message={error} />}
        {wishlistError ? (
          <div className="space-y-3">
            <ErrorBox message={wishlistError} />
            <button
              type="button"
              onClick={() => refreshWishlist().catch(() => {})}
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <p>Your wishlist is empty. Tap the heart on any product to save it here.</p>
            <Link to="/products" className="mt-2 inline-block text-orange-600">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 rounded-lg border border-gray-200 bg-white p-3"
              >
                <img
                  src={product.imageUrl || 'https://placehold.co/600x400?text=No+image'}
                  alt={product.name}
                  className="h-20 w-20 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${product.id}`}
                    className="font-medium hover:text-orange-600"
                  >
                    {product.name}
                  </Link>
                  <p className="font-bold text-orange-600">
                    {money(product.price)}
                  </p>
                  <div className="mt-2 flex gap-3 text-sm">
                    <button
                      type="button"
                      disabled={product.stock === 0 || busyProduct === product.id}
                      onClick={() =>
                        run(product.id, () => move(product.id))
                      }
                      className="rounded-md bg-orange-600 px-3 py-1 text-white disabled:opacity-50"
                    >
                      {product.stock === 0
                        ? 'Out of stock'
                        : busyProduct === product.id
                          ? 'Moving...'
                          : 'Move to cart'}
                    </button>
                    <button
                      type="button"
                      disabled={busyProduct === product.id}
                      onClick={() =>
                        run(product.id, () => remove(product.id))
                      }
                      className="text-red-600 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <RecentlyViewed />
    </div>
  )
}
