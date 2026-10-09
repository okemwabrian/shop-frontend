import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { getProduct } from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { money } from '../utils/format.js'

export default function ProductDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { add } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [message, setMessage] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setProduct(null)
    setQty(1)

    getProduct(id)
      .then((result) => {
        if (active) setProduct(result)
      })
      .catch((err) => {
        if (!active) return
        setError(
          err.response?.status === 404 ? 'Product not found' : errorMessage(err),
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  async function addToCart() {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    setActionError('')
    setMessage('')
    setAdding(true)
    try {
      await add(product.id, qty)
      setMessage('Added to your cart.')
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorBox message={error} />
  if (!product) return <ErrorBox message="Product not found" />

  const stock = Number(product.stock) || 0
  const soldOut = stock === 0

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img
        src={product.imageUrl || 'https://placehold.co/600x400?text=No+image'}
        alt={product.name}
        className="w-full rounded-xl border border-gray-200 bg-white object-cover"
      />
      <div>
        <Link to="/products" className="text-sm text-orange-600">
          Back to shop
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500">
          {[product.brand, product.categoryName].filter(Boolean).join(' - ')}
        </p>
        <p className="mt-4 text-3xl font-bold text-orange-600">
          {money(product.price)}
        </p>
        <p className={`mt-1 text-sm ${soldOut ? 'text-red-600' : 'text-green-700'}`}>
          {soldOut ? 'Out of stock' : `${stock} in stock`}
        </p>
        <p className="mt-4 text-gray-700">
          {product.description || 'No description yet.'}
        </p>

        {!soldOut && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-gray-300 bg-white">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                onClick={() => setQty((current) => Math.max(1, current - 1))}
                className="px-3 py-2 disabled:opacity-40"
              >
                -
              </button>
              <span className="w-10 text-center">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={qty >= stock}
                onClick={() =>
                  setQty((current) => Math.min(stock, current + 1))
                }
                className="px-3 py-2 disabled:opacity-40"
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={adding}
              onClick={addToCart}
              className="rounded-md bg-orange-600 px-6 py-2.5 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {adding ? 'Adding...' : 'Add to cart'}
            </button>
          </div>
        )}

        {actionError && (
          <p className="mt-3 text-sm text-red-600">{actionError}</p>
        )}
        {message && (
          <p className="mt-3 text-sm text-green-700">
            {message}{' '}
            <Link to="/cart" className="font-medium underline">
              View cart
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
