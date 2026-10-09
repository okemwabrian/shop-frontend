import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { getCategories, getProducts } from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import ProductCard from '../components/ProductCard.jsx'

const fieldClass = 'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
const pageButton =
  'rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm disabled:opacity-40'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const categoryId = params.get('categoryId') || ''
  const sort = params.get('sort') || ''
  const parsedPage = Number(params.get('page') || 0)
  const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0
  const [categories, setCategories] = useState([])
  const [categoryError, setCategoryError] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getCategories()
      .then((result) => {
        if (active) setCategories(result)
      })
      .catch((err) => {
        if (active) setCategoryError(errorMessage(err))
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getProducts({
      q: q || undefined,
      categoryId: categoryId || undefined,
      sort: sort || undefined,
      page,
      size: 12,
    })
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err) => {
        if (active) setError(errorMessage(err))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [q, categoryId, sort, page])

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  const hasFilters = q || categoryId || sort

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <h1 className="text-2xl font-bold">
            {q ? `Results for "${q}"` : 'All products'}
          </h1>
          {data && (
            <p className="text-sm text-gray-500">
              {data.totalElements} products found
            </p>
          )}
        </div>
        <select
          aria-label="Filter by category"
          value={categoryId}
          onChange={(event) => setParam('categoryId', event.target.value)}
          className={fieldClass}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <optgroup key={category.id} label={category.name}>
              <option value={category.id}>All {category.name}</option>
              {(category.children || []).map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(event) => setParam('sort', event.target.value)}
          className={fieldClass}
        >
          <option value="">Newest first</option>
          <option value="price,asc">Price: low to high</option>
          <option value="price,desc">Price: high to low</option>
          <option value="name,asc">Name: A to Z</option>
        </select>
        {hasFilters && (
          <button
            type="button"
            onClick={() => setParams({})}
            className="text-sm text-orange-600"
          >
            Clear filters
          </button>
        )}
      </div>

      {categoryError && <ErrorBox message={categoryError} />}
      {loading && <Loading />}
      {!loading && error && <ErrorBox message={error} />}
      {!loading && !error && data && (
        data.content.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No products match your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {data.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setParam('page', String(page - 1))}
            className={pageButton}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page + 1} of {data.totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= data.totalPages}
            onClick={() => setParam('page', String(page + 1))}
            className={pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
