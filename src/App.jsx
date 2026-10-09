import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Help from './pages/Help.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import Orders from './pages/Orders.jsx'
import Privacy from './pages/Privacy.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'
import Terms from './pages/Terms.jsx'
import Tickets from './pages/Tickets.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Account from './pages/Account.jsx'

const secure = (page) => <ProtectedRoute>{page}</ProtectedRoute>

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
        <Route path="/cart" element={secure(<Cart />)} />
        <Route path="/checkout" element={secure(<Checkout />)} />
        <Route path="/orders" element={secure(<Orders />)} />
        <Route path="/orders/:id" element={secure(<OrderDetails />)} />
        <Route path="/wishlist" element={secure(<Wishlist />)} />
        <Route path="/account" element={secure(<Account />)} />
        <Route path="/support" element={secure(<Tickets />)} />
        <Route
          path="*"
          element={<p className="py-10 text-center">Page not found</p>}
        />
      </Route>
    </Routes>
  )
}
