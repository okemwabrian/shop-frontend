import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function onSubmit(event) {
    event.preventDefault()
    navigate(`/products?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-1">
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Search products..."
        className="w-full rounded-l-md border border-gray-300 px-3 py-1.5 text-sm"
      />
      <button
        type="submit"
        className="rounded-r-md bg-orange-600 px-4 text-sm text-white"
      >
        Search
      </button>
    </form>
  )
}
