import { useQuery } from '@tanstack/react-query'
import * as adminApi from '../../api/admin.js'

export default function AdminCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminApi.getAdminCategories,
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading categories…</p>
  if (isError || !data) return <p className="text-sm text-red-600">Unable to load categories.</p>

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {(data ?? []).map((category) => (
          <span key={category.id} className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
            {category.name}
          </span>
        ))}
      </div>
    </div>
  )
}
