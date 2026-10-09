import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { getCategories, getSuggestions } from '../api/shop.js'
import { useDebounce } from '../hooks/useDebounce.js'

const empty = { products: [], categories: [] }
const item = 'block w-full px-3 py-2 text-left hover:bg-gray-50'

export default function SearchBox() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState(empty)
  const [suggestionError, setSuggestionError] = useState('')
  const [categoryIds, setCategoryIds] = useState({})
  const [categoryError, setCategoryError] = useState('')
  const debounced = useDebounce(q.trim())
  const navigate = useNavigate()
  const box = useRef(null)

  useEffect(() => {
    let active = true
    getCategories()
      .then((tree) => {
        const map = {}
        tree.forEach((category) => {
          map[category.name] = category.id
          for (const child of category.children || []) {
            map[child.name] = child.id
          }
        })
        if (active) {
          setCategoryIds(map)
          setCategoryError('')
        }
      })
      .catch((err) => {
        if (active) setCategoryError(errorMessage(err))
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (debounced.length < 2) {
      setSuggestions(empty)
      setSuggestionError('')
      return
    }

    let stale = false
    setSuggestionError('')
    getSuggestions(debounced)
      .then((result) => {
        if (!stale) {
          setSuggestions({
            products: result.products || [],
            categories: result.categories || [],
          })
        }
      })
      .catch((err) => {
        if (!stale) {
          setSuggestions(empty)
          setSuggestionError(errorMessage(err))
        }
      })

    return () => {
      stale = true
    }
  }, [debounced])

  useEffect(() => {
    function onClickOutside(event) {
      if (box.current && !box.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function go(path) {
    setOpen(false)
    navigate(path)
  }

  function onSubmit(event) {
    event.preventDefault()
    go(`/products?q=${encodeURIComponent(q.trim())}`)
  }

  function pickCategory(name) {
    const id = categoryIds[name]
    go(
      id
        ? `/products?categoryId=${id}`
        : `/products?q=${encodeURIComponent(name)}`,
    )
  }

  const hasResults =
    suggestions.products.length > 0 || suggestions.categories.length > 0
  const showList = open && q.trim().length >= 2

  return (
    <div ref={box} className="relative min-w-0 flex-1">
      <form onSubmit={onSubmit} className="flex">
        <input
          value={q}
          onChange={(event) => {
            setQ(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products..."
          aria-label="Search products"
          aria-expanded={showList}
          aria-controls="search-suggestions"
          className="w-full rounded-l-md border border-gray-300 px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="rounded-r-md bg-orange-600 px-4 text-sm text-white"
        >
          Search
        </button>
      </form>
      {showList && (hasResults || suggestionError || categoryError) && (
        <div
          id="search-suggestions"
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white text-sm shadow-lg"
        >
          {suggestionError && (
            <p role="alert" className="px-3 py-2 text-red-700">
              Suggestions unavailable: {suggestionError}
            </p>
          )}
          {categoryError && (
            <p role="alert" className="px-3 py-2 text-red-700">
              Category filters unavailable: {categoryError}
            </p>
          )}
          {suggestions.categories.length > 0 && (
            <>
              <p className="bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
                Categories
              </p>
              {suggestions.categories.map((name) => (
                <button
                  key={`c-${name}`}
                  type="button"
                  onClick={() => pickCategory(name)}
                  className={item}
                >
                  {name}
                </button>
              ))}
            </>
          )}
          {suggestions.products.length > 0 && (
            <>
              <p className="bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
                Products
              </p>
              {suggestions.products.map((name) => (
                <button
                  key={`p-${name}`}
                  type="button"
                  onClick={() =>
                    go(`/products?q=${encodeURIComponent(name)}`)
                  }
                  className={item}
                >
                  {name}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
