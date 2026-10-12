import { useState } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminTickets, updateTicket } from '../../api/admin.js'
import { errorMessage } from '../../api/client.js'
import Loading from '../../components/Loading.jsx'
import Pagination from '../../components/Pagination.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { formatDate } from '../../utils/format.js'

const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

function TicketCard({ ticket, onSave, saving }) {
  const [status, setStatus] = useState(ticket.status)
  const [response, setResponse] = useState(ticket.adminResponse || '')

  function submit(event) {
    event.preventDefault()
    onSave({
      id: ticket.id,
      status,
      response: response.trim() || null,
    })
  }

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">{ticket.subject}</h2>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="text-xs text-gray-400">
        {ticket.customerName}, {formatDate(ticket.createdAt)}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
        {ticket.message}
      </p>
      {ticket.adminResponse && (
        <div className="mt-3 rounded-md bg-green-50 p-3">
          <p className="text-xs font-semibold text-green-800">Reply from support</p>
          <p className="mt-1 whitespace-pre-line text-sm text-green-900">
            {ticket.adminResponse}
          </p>
        </div>
      )}
      <form
        onSubmit={submit}
        className="mt-3 space-y-2 border-t border-gray-100 pt-3"
      >
        <label className="sr-only" htmlFor={`ticket-response-${ticket.id}`}>
          Reply to {ticket.subject}
        </label>
        <textarea
          id={`ticket-response-${ticket.id}`}
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Write a reply to the customer"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <label className="sr-only" htmlFor={`ticket-status-${ticket.id}`}>
            Ticket status
          </label>
          <select
            id={`ticket-status-${ticket.id}`}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          >
            {statuses.map((ticketStatus) => (
              <option key={ticketStatus} value={ticketStatus}>
                {ticketStatus.replace('_', ' ')}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </article>
  )
}

export default function AdminTickets() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const tickets = useQuery({
    queryKey: ['admin-tickets', status, page],
    queryFn: () =>
      adminTickets({ status: status || undefined, page, size: 10 }),
    placeholderData: keepPreviousData,
  })
  const save = useMutation({
    mutationFn: ({ id, ...body }) => updateTicket(id, body),
    onSuccess: async () => {
      toast.success('Ticket updated and the customer was notified')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-tickets'] }),
        queryClient.invalidateQueries({ queryKey: ['stat'] }),
      ])
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  const data = tickets.data

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Support tickets</h1>
        <label className="sr-only" htmlFor="admin-ticket-status-filter">
          Filter tickets by status
        </label>
        <select
          id="admin-ticket-status-filter"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(0)
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {statuses.map((ticketStatus) => (
            <option key={ticketStatus} value={ticketStatus}>
              {ticketStatus.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {tickets.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {errorMessage(tickets.error)}
        </p>
      )}
      {tickets.isPending && <Loading />}
      {data && data.content.length === 0 && (
        <p className="text-gray-500">No tickets here.</p>
      )}
      {data?.content.map((ticket) => (
        <TicketCard
          key={`${ticket.id}-${ticket.status}-${ticket.adminResponse ?? ''}`}
          ticket={ticket}
          saving={save.isPending}
          onSave={(body) => save.mutate(body)}
        />
      ))}
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
