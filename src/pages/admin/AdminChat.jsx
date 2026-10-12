import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getConversation, getConversations } from '../../api/admin.js'
import { errorMessage } from '../../api/client.js'
import Loading from '../../components/Loading.jsx'
import { useSocket } from '../../context/SocketContext.jsx'
import { formatDate } from '../../utils/format.js'

const emptyMessages = []

export default function AdminChat() {
  const queryClient = useQueryClient()
  const { connected, subscribe, send } = useSocket()
  const [selected, setSelected] = useState(null)
  const [text, setText] = useState('')
  const selectedRef = useRef(selected)
  const end = useRef(null)

  const conversations = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  })
  const list = conversations.data || []
  const current = list.find(
    (conversation) => conversation.customerId === selected,
  )
  const thread = useQuery({
    queryKey: ['conversation', selected],
    queryFn: () => getConversation(selected),
    enabled: selected !== null,
  })
  const messages = thread.data ?? emptyMessages

  useEffect(() => {
    if (!connected) return undefined

    return subscribe('/topic/support', (message) => {
      void queryClient.invalidateQueries({ queryKey: ['conversations'] })

      if (message.customerId !== selectedRef.current) return

      const queryKey = ['conversation', message.customerId]
      const cached = queryClient.getQueryData(queryKey)
      if (cached) {
        queryClient.setQueryData(queryKey, (existing) =>
          existing.some((item) => item.id === message.id)
            ? existing
            : [...existing, message],
        )
      } else {
        void queryClient.invalidateQueries({ queryKey })
      }
    })
  }, [connected, queryClient, subscribe])

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function submit(event) {
    event.preventDefault()
    const content = text.trim()
    if (!content || selected === null || !connected) return

    send('/app/chat.send', { customerId: selected, content })
    setText('')
  }

  function selectConversation(customerId) {
    selectedRef.current = customerId
    setSelected(customerId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live chat</h1>
        <span className={`text-sm ${connected ? 'text-green-700' : 'text-gray-400'}`}>
          {connected ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <aside className="max-h-[28rem] overflow-y-auto rounded-lg border border-gray-200 bg-white">
          <p className="border-b border-gray-100 px-4 py-3 font-semibold">
            Conversations
          </p>
          {conversations.isPending && <Loading />}
          {conversations.isError && (
            <p role="alert" className="p-4 text-sm text-red-700">
              {errorMessage(conversations.error)}
            </p>
          )}
          {!conversations.isPending && !conversations.isError && list.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No conversations yet.</p>
          )}
          {list.map((conversation) => (
            <button
              type="button"
              key={conversation.customerId}
              onClick={() => selectConversation(conversation.customerId)}
              className={`block w-full border-b border-gray-50 px-4 py-3 text-left ${
                selected === conversation.customerId
                  ? 'bg-orange-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <p className="font-medium">
                {conversation.customerName || `Customer ${conversation.customerId}`}
              </p>
              <p className="truncate text-sm text-gray-500">
                {conversation.lastMessage}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(conversation.lastAt)}
              </p>
            </button>
          ))}
        </aside>

        <section className="flex h-[28rem] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white md:col-span-2">
          {selected === null ? (
            <p className="m-auto text-gray-400">
              Choose a conversation on the left.
            </p>
          ) : (
            <>
              <p className="border-b border-gray-100 px-4 py-3 font-semibold">
                {current
                  ? current.customerName
                  : `Customer ${selected}`}
              </p>
              <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3 text-sm">
                {thread.isPending && <Loading />}
                {thread.isError && (
                  <p role="alert" className="text-red-700">
                    {errorMessage(thread.error)}
                  </p>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={message.fromSupport ? 'text-right' : 'text-left'}
                  >
                    <p
                      className={`inline-block max-w-[85%] whitespace-pre-line rounded-lg px-3 py-2 ${
                        message.fromSupport
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      {message.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {message.senderName}
                    </p>
                  </div>
                ))}
                <div ref={end} />
              </div>
              <form onSubmit={submit} className="flex border-t border-gray-200">
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Write a reply..."
                  maxLength={2000}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!connected || !text.trim()}
                  className="bg-orange-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
