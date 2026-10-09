import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const linkClass = ({ isActive }) =>
  isActive ? 'font-semibold text-orange-600' : 'text-gray-700 hover:text-orange-600'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  function handleSearch(event) {
    event.preventDefault()
    const search = new FormData(event.currentTarget).get('q')?.toString().trim() || ''
    const params = new URLSearchParams(location.pathname === '/products' ? searchParams : '')
    if (search) params.set('q', search)
    else params.delete('q')
    params.delete('page')
    const queryString = params.toString()
    navigate(`/products${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-orange-600">
          MyShop
        </Link>
        <nav className="flex gap-5 text-sm">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Shop
          </NavLink>
        </nav>
        <form onSubmit={handleSearch} className="flex min-w-0 flex-1">
          <input
            key={`${location.pathname}:${query}`}
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search products"
            aria-label="Search products"
            className="min-w-0 flex-1 rounded-l-md border border-gray-300 px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-r-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700"
          >
            Search
          </button>
        </form>
        <Link to="/cart" className="text-sm font-medium">
          Cart ({cart.totalItems ?? 0})
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Hi, {user.name || user.fullName || 'there'}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400"
            >
              Logout
            </button>
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
