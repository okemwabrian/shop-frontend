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

const emptyCart = { items: [], totalItems: 0, subtotal: 0, shippingFee: 0, total: 0 }
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(emptyCart)
  const [loading, setLoading] = useState(Boolean(user))
  const [error, setError] = useState('')
  const refreshId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRefreshId = ++refreshId.current
    if (!user) {
      setCart(emptyCart)
      setError('')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await shop.getCart()
      if (currentRefreshId === refreshId.current) setCart(result)
    } catch (err) {
      if (currentRefreshId === refreshId.current) setError(errorMessage(err))
    } finally {
      if (currentRefreshId === refreshId.current) setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function add(productId, quantity = 1) {
    setCart(await shop.addToCart(productId, quantity))
    setError('')
  }

  async function setQuantity(productId, quantity) {
    setCart(await shop.setCartQuantity(productId, quantity))
    setError('')
  }

  async function remove(productId) {
    setCart(await shop.removeCartItem(productId))
    setError('')
  }

  return (
    <CartContext.Provider
      value={{ cart, loading, error, add, setQuantity, remove, refresh }}
    >
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext)
}
