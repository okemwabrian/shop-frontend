import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { errorMessage } from '../api/client.js'
import * as shop from '../api/shop.js'
import { useAuth } from './AuthContext.jsx'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(Boolean(user))
  const [error, setError] = useState('')
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequestId = ++requestId.current
    if (!user) {
      setItems([])
      setError('')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await shop.getWishlist()
      if (currentRequestId === requestId.current) setItems(result)
    } catch (err) {
      if (currentRequestId === requestId.current) {
        setError(errorMessage(err))
      }
      throw err
    } finally {
      if (currentRequestId === requestId.current) setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh().catch(() => {})
  }, [refresh])

  const has = useCallback(
    (productId) =>
      items.some((product) => String(product.id) === String(productId)),
    [items],
  )

  async function toggle(product) {
    if (has(product.id)) {
      await shop.removeWish(product.id)
      setItems((current) =>
        current.filter((item) => String(item.id) !== String(product.id)),
      )
    } else {
      await shop.addWish(product.id)
      setItems((current) => {
        if (current.some((item) => String(item.id) === String(product.id))) {
          return current
        }
        return [product, ...current]
      })
    }
    setError('')
  }

  async function remove(productId) {
    await shop.removeWish(productId)
    setItems((current) =>
      current.filter((item) => String(item.id) !== String(productId)),
    )
    setError('')
  }

  async function moveToCart(productId) {
    await shop.moveWishToCart(productId)
    setItems((current) =>
      current.filter((item) => String(item.id) !== String(productId)),
    )
    setError('')
  }

  return (
    <WishlistContext.Provider
      value={{ items, loading, error, has, toggle, remove, moveToCart, refresh }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  return useContext(WishlistContext)
}
