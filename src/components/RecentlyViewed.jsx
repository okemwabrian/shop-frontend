import { useEffect, useState } from 'react'
import { errorMessage } from '../api/client.js'
import { clearRecentlyViewed, getRecentlyViewed } from '../api/shop.js'
import { useAuth } from '../context/AuthContext.jsx'
import ErrorBox from './ErrorBox.jsx'
import ProductCard from './ProductCard.jsx'

export default function RecentlyViewed() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    setItems([])
    setError('')
    if (!user) return () => {
      active = false
    }

    getRecentlyViewed()
      .then((result) => {
        if (active) setItems(result)
      })
      .catch((err) => {
        if (active) setError(errorMessage(err))
      })

    return () => {
      active = false
    }
  }, [user])

  async function clear() {
    setBusy(true)
    setError('')
    try {
      await clearRecentlyViewed()
      setItems([])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (!user) return null

  return (
    <section>
      {error && <ErrorBox message={error} />}
      {items.length > 0 && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recently viewed</h2>
            <button
              type="button"
              disabled={busy}
              onClick={clear}
              className="text-sm text-gray-500 hover:text-red-600 disabled:opacity-50"
            >
              {busy ? 'Clearing...' : 'Clear history'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
