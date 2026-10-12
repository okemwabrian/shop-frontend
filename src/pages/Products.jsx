import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { getCategories, getProducts } from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import Pagination from '../components/Pagination.jsx'
import ProductCard from '../components/ProductCard.jsx'

const fieldClass = 'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const categoryId = params.get('categoryId') || ''
  const sort = params.get('sort') || ''
  const parsedPage = Number(params.get('page') || 0)
  const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  const products = useQuery({
    queryKey: ['products', q, categoryId, sort, page],
    queryFn: () =>
      getProducts({
        q: q || undefined,
        categoryId: categoryId || undefined,
        sort: sort || undefined,
        page,
        size: 12,
      }),
    placeholderData: keepPreviousData,
  })
  const data = products.data

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
          {(categories.data || []).map((category) => (
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

      {categories.isError && <ErrorBox message={errorMessage(categories.error)} />}
      {products.isPending && <Loading />}
      {products.isError && <ErrorBox message={errorMessage(products.error)} />}
      {data && !products.isError && (
        data.content.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No products match your search.
          </p>
        ) : (
          <div
            className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ${
              products.isPlaceholderData ? 'opacity-60' : ''
            }`}
          >
            {data.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={(nextPage) => setParam('page', String(nextPage))}
        />
      )}
    </div>
  )
}
