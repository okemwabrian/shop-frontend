import { Link } from 'react-router-dom'

const heading = 'mb-2 font-semibold'
const link = 'block text-gray-500 hover:text-orange-600'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-sm">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-orange-600">MyShop</p>
          <p className="mt-1 text-gray-500">Quality products, delivered to your door.</p>
        </div>
        <div>
          <p className={heading}>Shop</p>
          <Link to="/" className={link}>Home</Link>
          <Link to="/products" className={link}>All products</Link>
          <Link to="/orders" className={link}>My orders</Link>
        </div>
        <div>
          <p className={heading}>Help and legal</p>
          <Link to="/help" className={link}>Help centre</Link>
          <Link to="/support" className={link}>Support tickets</Link>
          <Link to="/privacy" className={link}>Privacy policy</Link>
          <Link to="/terms" className={link}>Terms and conditions</Link>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-gray-400">
        MyShop. All rights reserved.
      </p>
    </footer>
  )
}
