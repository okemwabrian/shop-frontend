import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { errorMessage } from '../../api/client.js'
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '../../api/admin.js'
import { getCategories } from '../../api/shop.js'
import ErrorBox from '../../components/ErrorBox.jsx'
import Loading from '../../components/Loading.jsx'

const formCard =
  'flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-4'

function CategoryRow({ category, level, parentId, onRename, onDelete }) {
  return (
    <>
      <li
        className="flex items-center justify-between border-t border-gray-100 py-2"
        style={{ paddingLeft: `${level * 24}px` }}
      >
        <span className={level === 0 ? 'font-semibold' : ''}>
          {category.name}
        </span>
        <span className="space-x-3 text-sm">
          <button
            type="button"
            onClick={() => onRename(category, parentId)}
            className="text-orange-600"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="text-red-600"
          >
            Delete
          </button>
        </span>
      </li>
      {(category.children || []).map((child) => (
        <CategoryRow
          key={child.id}
          category={child}
          level={level + 1}
          parentId={category.id}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </>
  )
}

export default function AdminCategories() {
  const queryClient = useQueryClient()
  const tree = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
      queryClient.invalidateQueries({ queryKey: ['products'] }),
      queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
    ])
  }

  const add = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      toast.success('Category added')
      setName('')
      await refresh()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  const rename = useMutation({
    mutationFn: ({ id, ...body }) => updateCategory(id, body),
    onSuccess: async () => {
      toast.success('Category renamed')
      await refresh()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      toast.success('Category deleted')
      await refresh()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  function submit(event) {
    event.preventDefault()
    add.mutate({
      name: name.trim(),
      parentId: parentId ? Number(parentId) : null,
    })
  }

  function onRename(category, parentId) {
    const newName = window.prompt('New name', category.name)
    if (!newName?.trim()) return

    rename.mutate({
      id: category.id,
      name: newName.trim(),
      parentId,
    })
  }

  function onDelete(category) {
    if (window.confirm(`Delete ${category.name}?`)) {
      remove.mutate(category.id)
    }
  }

  if (tree.isError) return <ErrorBox message={errorMessage(tree.error)} />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Categories</h1>
      <form onSubmit={submit} className={formCard}>
        <label className="sr-only" htmlFor="admin-category-name">
          New category name
        </label>
        <input
          id="admin-category-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New category name"
          required
          className="min-w-48 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <label className="sr-only" htmlFor="admin-category-parent">
          Parent category
        </label>
        <select
          id="admin-category-parent"
          value={parentId}
          onChange={(event) => setParentId(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Main category</option>
          {(tree.data || []).map((category) => (
            <option key={category.id} value={category.id}>
              Inside {category.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={add.isPending || tree.isPending}
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {add.isPending ? 'Adding...' : 'Add'}
        </button>
      </form>
      {tree.isPending && <Loading />}
      {tree.data && (
        <ul className="rounded-lg border border-gray-200 bg-white px-4">
          {tree.data.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              level={0}
              parentId={null}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
      {tree.data?.length === 0 && (
        <p className="text-sm text-gray-500">No categories yet.</p>
      )}
    </div>
  )
}
