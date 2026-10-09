import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import SearchBox from './SearchBox.jsx'

const linkClass = ({ isActive }) =>
  isActive ? 'font-semibold text-orange-600' : 'text-gray-700 hover:text-orange-600'

const badgeClass =
  'absolute -top-2 right-0 rounded-full bg-orange-600 px-1.5 text-xs text-white'
const menuItem = 'block w-full px-4 py-2 text-left text-sm hover:bg-gray-50'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-orange-600">
          MyShop
        </Link>
        <nav className="hidden gap-4 text-sm sm:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/help" className={linkClass}>
            Help
          </NavLink>
        </nav>
        <SearchBox />
        <Link to="/cart" className="relative pr-4 text-sm font-medium">
          Cart
          {cart.totalItems > 0 && <span className={badgeClass}>{cart.totalItems}</span>}
        </Link>

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="text-sm font-medium"
            >
              Hi, {(user.fullName || user.name || 'there').split(' ')[0]} &#9662;
            </button>
            {open && (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <Link to="/orders" onClick={close} className={menuItem}>
                    My orders
                  </Link>
                  <Link to="/wishlist" onClick={close} className={menuItem}>
                    Wishlist
                  </Link>
                  <Link to="/account" onClick={close} className={menuItem}>
                    My account
                  </Link>
                  <Link to="/support" onClick={close} className={menuItem}>
                    Support tickets
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      close()
                      logout()
                    }}
                    className={`${menuItem} text-red-600`}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
