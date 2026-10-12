import { Route, Routes } from 'react-router-dom'
import AdminRoute from './components/AdminRoute.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Account from './pages/Account.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Help from './pages/Help.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Notifications from './pages/Notifications.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import Orders from './pages/Orders.jsx'
import Privacy from './pages/Privacy.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'
import Terms from './pages/Terms.jsx'
import Tickets from './pages/Tickets.jsx'
import Wishlist from './pages/Wishlist.jsx'
import AdminChat from './pages/admin/AdminChat.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminTickets from './pages/admin/AdminTickets.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'

const secure = (page) => <ProtectedRoute>{page}</ProtectedRoute>
const admin = (page) => <AdminRoute>{page}</AdminRoute>

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/notifications" element={secure(<Notifications />)} />
        <Route path="/cart" element={secure(<Cart />)} />
        <Route path="/checkout" element={secure(<Checkout />)} />
        <Route path="/orders" element={secure(<Orders />)} />
        <Route path="/orders/:id" element={secure(<OrderDetails />)} />
        <Route path="/wishlist" element={secure(<Wishlist />)} />
        <Route path="/account" element={secure(<Account />)} />
        <Route path="/support" element={secure(<Tickets />)} />

        <Route path="/admin" element={admin(<AdminLayout />)}>
          <Route index element={admin(<Dashboard />)} />
          <Route path="products" element={admin(<AdminProducts />)} />
          <Route path="categories" element={admin(<AdminCategories />)} />
          <Route path="orders" element={admin(<AdminOrders />)} />
          <Route path="tickets" element={admin(<AdminTickets />)} />
          <Route path="chat" element={admin(<AdminChat />)} />
        </Route>

        <Route
          path="*"
          element={<p className="py-10 text-center">Page not found</p>}
        />
      </Route>
    </Routes>
  )
}
