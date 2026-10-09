import { Link } from 'react-router-dom'
import { money } from '../utils/format.js'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md"
    >
      <img
        src={product.imageUrl || 'https://placehold.co/600x400?text=No+image'}
        alt={product.name}
        className="h-40 w-full object-cover"
      />
      <div className="p-3">
        <p className="truncate text-sm font-medium group-hover:text-orange-600">
          {product.name}
        </p>
        <p className="text-xs text-gray-500">{product.brand}</p>
        <p className="mt-1 font-bold text-orange-600">{money(product.price)}</p>
        {product.stock === 0 && (
          <p className="text-xs text-red-600">Out of stock</p>
        )}
      </div>
    </Link>
  )
}
