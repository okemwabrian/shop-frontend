import { useState } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { errorMessage } from '../../api/client.js'
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '../../api/admin.js'
import { getCategories, getProducts } from '../../api/shop.js'
import ErrorBox from '../../components/ErrorBox.jsx'
import Loading from '../../components/Loading.jsx'
import Pagination from '../../components/Pagination.jsx'
import { money } from '../../utils/format.js'

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none'
const blank = {
  name: '',
  description: '',
  price: '',
  stock: '',
  brand: '',
  imageUrl: '',
  categoryId: '',
}

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...blank })

  const products = useQuery({
    queryKey: ['admin-products', q, page],
    queryFn: () => getProducts({ q: q || undefined, page, size: 10 }),
    placeholderData: keepPreviousData,
  })
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  async function refreshProducts() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
      queryClient.invalidateQueries({ queryKey: ['products'] }),
      queryClient.invalidateQueries({ queryKey: ['stat'] }),
    ])
  }

  const save = useMutation({
    mutationFn: ({ id, body }) =>
      id ? updateProduct(id, body) : createProduct(body),
    onSuccess: async () => {
      toast.success('Product saved')
      setEditing(null)
      await refreshProducts()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      toast.success('Product removed from the shop')
      await refreshProducts()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  function openForm(product) {
    setEditing(product || {})
    setForm(
      product
        ? {
            name: product.name,
            description: product.description || '',
            price: String(product.price ?? ''),
            stock: String(product.stock ?? ''),
            brand: product.brand || '',
            imageUrl: product.imageUrl || '',
            categoryId: String(product.categoryId ?? ''),
          }
        : { ...blank },
    )
  }

  function submit(event) {
    event.preventDefault()
    save.mutate({
      id: editing?.id,
      body: {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand.trim(),
        imageUrl: form.imageUrl.trim(),
        categoryId: Number(form.categoryId),
      },
    })
  }

  function setField(key) {
    return (event) =>
      setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const data = products.data

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(event) => {
              setQ(event.target.value)
              setPage(0)
            }}
            placeholder="Search products..."
            aria-label="Search products"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => openForm(null)}
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
          >
            New product
          </button>
        </div>
      </div>

      {editing !== null && (
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-lg border border-orange-200 bg-white p-4 sm:grid-cols-2"
        >
          <h2 className="font-semibold sm:col-span-2">
            {editing.id ? `Edit: ${editing.name}` : 'New product'}
          </h2>
          <label className="sr-only" htmlFor="admin-product-name">Name</label>
          <input
            id="admin-product-name"
            value={form.name}
            onChange={setField('name')}
            placeholder="Name"
            required
            className={inputClass}
          />
          <label className="sr-only" htmlFor="admin-product-brand">Brand</label>
          <input
            id="admin-product-brand"
            value={form.brand}
            onChange={setField('brand')}
            placeholder="Brand"
            className={inputClass}
          />
          <label className="sr-only" htmlFor="admin-product-price">Price (KES)</label>
          <input
            id="admin-product-price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={setField('price')}
            placeholder="Price (KES)"
            required
            className={inputClass}
          />
          <label className="sr-only" htmlFor="admin-product-stock">Stock</label>
          <input
            id="admin-product-stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={setField('stock')}
            placeholder="Stock"
            required
            className={inputClass}
          />
          <label className="sr-only" htmlFor="admin-product-category">Category</label>
          <select
            id="admin-product-category"
            value={form.categoryId}
            onChange={setField('categoryId')}
            required
            className={inputClass}
          >
            <option value="">Choose a category</option>
            {(categories.data || []).map((category) => (
              <optgroup key={category.id} label={category.name}>
                <option value={category.id}>{category.name} (main)</option>
                {(category.children || []).map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <label className="sr-only" htmlFor="admin-product-image">Image URL</label>
          <input
            id="admin-product-image"
            type="url"
            value={form.imageUrl}
            onChange={setField('imageUrl')}
            placeholder="Image address (URL)"
            className={inputClass}
          />
          <label className="sr-only" htmlFor="admin-product-description">Description</label>
          <textarea
            id="admin-product-description"
            value={form.description}
            onChange={setField('description')}
            rows={3}
            placeholder="Description"
            maxLength={2000}
            className={`${inputClass} sm:col-span-2`}
          />
          {categories.isError && (
            <div className="sm:col-span-2">
              <ErrorBox message={errorMessage(categories.error)} />
            </div>
          )}
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-md bg-orange-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {save.isPending ? 'Saving...' : 'Save product'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm text-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {products.isError && <ErrorBox message={errorMessage(products.error)} />}
      {products.isPending && <Loading />}
      {data && (
        <div
          className={`overflow-x-auto rounded-lg border border-gray-200 bg-white ${
            products.isPlaceholderData ? 'opacity-60' : ''
          }`}
        >
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((product) => (
                <tr key={product.id} className="border-t border-gray-100">
                  <td className="p-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </td>
                  <td className="p-3">{product.categoryName}</td>
                  <td className="p-3">{money(product.price)}</td>
                  <td
                    className={`p-3 ${
                      product.stock === 0 ? 'font-semibold text-red-600' : ''
                    }`}
                  >
                    {product.stock}
                  </td>
                  <td className="space-x-3 p-3 text-right">
                    <button
                      type="button"
                      onClick={() => openForm(product)}
                      className="text-orange-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove ${product.name}?`)) {
                          remove.mutate(product.id)
                        }
                      }}
                      disabled={remove.isPending}
                      className="text-red-600 disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.content.length === 0 && (
            <p className="p-6 text-center text-gray-500">No products found.</p>
          )}
        </div>
      )}
      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={setPage}
        />
      )}
    </div>
  )
}
