import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../api/shop.js'

export default function AdminProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts({ size: 20 }),
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading products…</p>
  if (isError || !data) return <p className="text-sm text-red-600">Unable to load products.</p>

  const products = data.content ?? data ?? []

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Products</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-200">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">KES {Number(product.price ?? 0).toLocaleString()}</td>
                <td className="px-4 py-3">{product.stock ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
