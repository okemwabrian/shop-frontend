import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as shop from '../api/shop.js'
import { useAuth } from './AuthContext.jsx'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!user) {
      setWishlist([])
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      setWishlist(await shop.getWishlist())
    } catch (err) {
      setError(err?.message || 'Could not load wishlist.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) void refresh()
    else setWishlist([])
  }, [refresh, user])

  async function add(productId) {
    await shop.addWish(productId)
    await refresh()
  }

  async function remove(productId) {
    await shop.removeWish(productId)
    await refresh()
  }

  async function moveToCart(productId) {
    await shop.moveWishToCart(productId)
    await refresh()
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, error, refresh, add, remove, moveToCart }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
