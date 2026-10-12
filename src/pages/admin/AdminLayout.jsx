import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const base = 'block rounded-md px-3 py-2 text-sm '
const linkClass = ({ isActive }) =>
  base +
  (isActive
    ? 'bg-orange-50 font-semibold text-orange-600'
    : 'text-gray-700 hover:bg-gray-100')

export default function AdminLayout() {
  const { user } = useAuth()
  const isAdmin = user.role === 'ADMIN'

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <aside className="md:col-span-1">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
          {isAdmin ? 'Admin' : 'Support'}
        </p>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          {isAdmin && (
            <>
              <NavLink to="/admin/products" className={linkClass}>
                Products
              </NavLink>
              <NavLink to="/admin/categories" className={linkClass}>
                Categories
              </NavLink>
              <NavLink to="/admin/orders" className={linkClass}>
                Orders
              </NavLink>
            </>
          )}
          <NavLink to="/admin/tickets" className={linkClass}>
            Support tickets
          </NavLink>
          <NavLink to="/admin/chat" className={linkClass}>
            Live chat
          </NavLink>
        </nav>
      </aside>
      <section className="md:col-span-4">
        <Outlet />
      </section>
    </div>
  )
}
