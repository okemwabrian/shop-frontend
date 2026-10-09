import { useState } from 'react'
import { getSupportLink } from '../api/shop.js'
import { openInNewTab } from '../utils/links.js'

export default function WhatsAppButton() {
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)

  async function open() {
    setFailed(false)
    setBusy(true)
    try {
      await openInNewTab(() => getSupportLink('Hello, I need help'))
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-30 text-right">
      {failed && (
        <p
          role="alert"
          className="mb-1 rounded-md bg-white px-2 py-1 text-xs text-red-600 shadow-md"
        >
          Could not open WhatsApp
        </p>
      )}
      <button
        type="button"
        onClick={open}
        disabled={busy}
        className="rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-600 disabled:opacity-60"
      >
        {busy ? 'Opening WhatsApp...' : 'Chat on WhatsApp'}
      </button>
    </div>
  )
}
