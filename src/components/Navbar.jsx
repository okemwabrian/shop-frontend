import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import NotificationBell from './NotificationBell.jsx'
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const close = () => setOpen(false)
  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4">
        <Link to="/" aria-label="SokoChap home" className="shrink-0">
          <img src="/sokochap-logo.svg" alt="SokoChap" className="h-11 w-auto" />
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
        <div className="hidden min-w-0 flex-1 sm:block">
          <SearchBox />
        </div>
        <Link to="/cart" className="relative ml-auto pr-4 text-sm font-medium sm:ml-0">
          Cart
          {cart.totalItems > 0 && <span className={badgeClass}>{cart.totalItems}</span>}
        </Link>

        {user ? (
          <>
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
            <div className="relative hidden sm:block">
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
                    {['ADMIN', 'SUPPORT'].includes(String(user.role || '').toUpperCase()) && (
                      <Link to="/admin" onClick={close} className={menuItem}>
                        Admin area
                      </Link>
                    )}
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
          </>
        ) : (
          <Link
            to="/login"
            className="hidden rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white sm:inline-flex"
          >
            Login
          </Link>
        )}

        <button
          type="button"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-md border border-gray-300 p-2 text-gray-700 sm:hidden"
        >
          {mobileOpen ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div className="order-last min-w-0 basis-full sm:hidden">
          <SearchBox />
        </div>

        {mobileOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="order-last basis-full space-y-1 border-t border-gray-100 pt-2 sm:hidden"
          >
            <NavLink to="/" end onClick={closeMobile} className={({ isActive }) => `${menuItem} ${linkClass({ isActive })}`}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={closeMobile} className={({ isActive }) => `${menuItem} ${linkClass({ isActive })}`}>
              Shop
            </NavLink>
            <NavLink to="/help" onClick={closeMobile} className={({ isActive }) => `${menuItem} ${linkClass({ isActive })}`}>
              Help
            </NavLink>
            {user ? (
              <>
                <div className="px-4 py-2">
                  <NotificationBell />
                </div>
                <Link to="/orders" onClick={closeMobile} className={menuItem}>My orders</Link>
                <Link to="/wishlist" onClick={closeMobile} className={menuItem}>Wishlist</Link>
                <Link to="/account" onClick={closeMobile} className={menuItem}>My account</Link>
                <Link to="/support" onClick={closeMobile} className={menuItem}>Support tickets</Link>
                {['ADMIN', 'SUPPORT'].includes(String(user.role || '').toUpperCase()) && (
                  <Link to="/admin" onClick={closeMobile} className={menuItem}>Admin area</Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    closeMobile()
                    logout()
                  }}
                  className={`${menuItem} text-left text-red-600`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMobile} className={menuItem}>
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
