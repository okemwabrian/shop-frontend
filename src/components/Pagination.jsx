const button =
  'rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm disabled:opacity-40'

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className={button}
      >
        Previous
      </button>
      <span className="text-sm">
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page + 1 >= totalPages}
        onClick={() => onChange(page + 1)}
        className={button}
      >
        Next
      </button>
    </div>
  )
}
