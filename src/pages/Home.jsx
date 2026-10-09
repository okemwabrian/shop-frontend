import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { getCategories, getProducts } from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import ProductCard from '../components/ProductCard.jsx'
import RecentlyViewed from '../components/RecentlyViewed.jsx'

const categoryClass =
  'rounded-lg border border-gray-200 bg-white p-4 text-center text-sm font-medium hover:border-orange-500 hover:text-orange-600'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getCategories(), getProducts({ size: 8 })])
      .then(([categoryData, productPage]) => {
        setCategories(categoryData)
        setProducts(productPage.content)
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error) return <ErrorBox message={error} />

  return (
    <div className="space-y-10">
      <section className="rounded-xl bg-orange-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Everything you need, delivered</h1>
        <p className="mt-2 max-w-xl text-orange-50">
          Phones, TVs, appliances, fashion, gaming and more at great prices.
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-md bg-white px-5 py-2 font-semibold text-orange-600"
        >
          Shop now
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">Shop by category</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className={categoryClass}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured products</h2>
          <Link to="/products" className="text-sm text-orange-600">
            View all
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <RecentlyViewed />
    </div>
  )
}
