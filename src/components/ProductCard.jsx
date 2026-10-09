import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { money } from '../utils/format.js'

const cardClass =
  'group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md'
const heartClass =
  'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-md'

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { has, toggle } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const wished = has(product.id)

  async function onHeart() {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    setActionError('')
    setBusy(true)
    try {
      await toggle(product)
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cardClass}>
      <Link to={`/products/${product.id}`} className="block">
        <img
          src={product.imageUrl || 'https://placehold.co/600x400?text=No+image'}
          alt={product.name}
          className="h-40 w-full object-cover"
        />
        <div className="p-3">
          <p className="truncate text-sm font-medium group-hover:text-orange-600">
            {product.name}
          </p>
          <p className="text-xs text-gray-500">{product.brand}</p>
          <p className="mt-1 font-bold text-orange-600">
            {money(product.price)}
          </p>
          {product.stock === 0 && (
            <p className="text-xs text-red-600">Out of stock</p>
          )}
        </div>
      </Link>
      <button
        type="button"
        onClick={onHeart}
        disabled={busy}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wished}
        className={`${heartClass} ${wished ? 'text-red-600' : 'text-gray-400'} disabled:opacity-60`}
      >
        {wished ? '\u2665' : '\u2661'}
      </button>
      {actionError && (
        <p role="alert" className="px-3 pb-3 text-xs text-red-600">
          {actionError}
        </p>
      )}
    </div>
  )
}
