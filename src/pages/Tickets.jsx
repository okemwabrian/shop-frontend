import { useEffect, useState } from 'react'
import { errorMessage } from '../api/client.js'
import { createTicket, getTickets } from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { formatDate } from '../utils/format.js'

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none'
const formCard = 'h-fit space-y-3 rounded-lg border border-gray-200 bg-white p-5'

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ subject: '', message: '' })
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    getTickets()
      .then((result) => {
        if (active) setTickets(result)
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
  }, [])

  async function submit(event) {
    event.preventDefault()
    setFormError('')
    setBusy(true)
    try {
      const ticket = await createTicket({
        subject: form.subject.trim(),
        message: form.message.trim(),
      })
      setTickets((current) => [ticket, ...current])
      setForm({ subject: '', message: '' })
    } catch (err) {
      setFormError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submit} className={formCard}>
        <h1 className="text-lg font-bold">New support request</h1>
        <input
          value={form.subject}
          onChange={(event) =>
            setForm((current) => ({ ...current, subject: event.target.value }))
          }
          placeholder="Subject"
          maxLength={200}
          required
          className={inputClass}
        />
        <textarea
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          placeholder="Describe the problem. Include your order number if it is about an order."
          rows={5}
          maxLength={2000}
          required
          className={inputClass}
        />
        <p className="text-right text-xs text-gray-400">
          {form.message.length} / 2000
        </p>
        {formError && <ErrorBox message={formError} />}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-orange-600 py-2 font-semibold text-white disabled:opacity-60"
        >
          {busy ? 'Sending...' : 'Send request'}
        </button>
      </form>

      <div className="space-y-3 lg:col-span-2">
        <h2 className="text-2xl font-bold">My support tickets</h2>
        {loading && <Loading />}
        {!loading && error && <ErrorBox message={error} />}
        {!loading && !error && tickets.length === 0 && (
          <p className="text-gray-500">You have not opened any tickets.</p>
        )}
        {!error &&
          tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{ticket.subject}</h3>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="text-xs text-gray-400">
                {formatDate(ticket.createdAt)}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                {ticket.message}
              </p>
              {ticket.adminResponse && (
                <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-900">
                  <p className="font-semibold">Reply from support</p>
                  <p className="whitespace-pre-line">{ticket.adminResponse}</p>
                </div>
              )}
            </article>
          ))}
      </div>
    </div>
  )
}
