import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  }`

export default function AdminLayout() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <nav className="flex flex-wrap gap-2">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            Orders
          </NavLink>
          <NavLink to="/admin/tickets" className={linkClass}>
            Tickets
          </NavLink>
          <NavLink to="/admin/chat" className={linkClass}>
            Live chat
          </NavLink>
        </nav>
      </div>

      <Outlet />
    </div>
  )
}
