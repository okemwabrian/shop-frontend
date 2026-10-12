import { useEffect, useRef, useState } from 'react'
import { errorMessage } from '../api/client.js'
import { getChatHistory } from '../api/shop.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'

function CustomerChat({ user }) {
  const { connected, subscribe, send } = useSocket()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [historyError, setHistoryError] = useState('')
  const end = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    let active = true
    getChatHistory()
      .then((history) => {
        if (active) {
          setMessages((current) => {
            const knownIds = new Set(history.map((message) => message.id))
            return [
              ...history,
              ...current.filter((message) => !knownIds.has(message.id)),
            ]
          })
        }
      })
      .catch((error) => {
        if (active) setHistoryError(errorMessage(error))
      })

    return () => {
      active = false
    }
  }, [user, open])

  useEffect(() => {
    if (!user || !connected) return undefined

    return subscribe('/user/queue/chat', (message) => {
      setMessages((current) =>
        current.some((existing) => existing.id === message.id)
          ? current
          : [...current, message],
      )
    })
  }, [connected, subscribe, user])

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function submit(event) {
    event.preventDefault()
    const content = text.trim()
    if (!content || !connected) return

    send('/app/chat.send', { customerId: null, content })
    setText('')
  }

  function toggleOpen() {
    if (!open) setHistoryError('')
    setOpen((current) => !current)
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-36 right-5 z-30 flex h-96 w-80 max-w-[90vw] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between bg-orange-600 px-4 py-3 text-white">
            <div>
              <p className="font-semibold">Chat with support</p>
              <p className="text-xs">{connected ? 'Online' : 'Connecting...'}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3 text-sm">
            {historyError && (
              <p role="alert" className="text-center text-xs text-red-600">
                {historyError}
              </p>
            )}
            {messages.length === 0 && (
              <p className="text-center text-gray-400">
                Say hello. We usually reply soon.
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.fromSupport ? 'text-left' : 'text-right'}
              >
                <p
                  className={`inline-block max-w-[85%] whitespace-pre-line rounded-lg px-3 py-2 ${
                    message.fromSupport
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-orange-600 text-white'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            <div ref={end} />
          </div>

          <form onSubmit={submit} className="flex border-t border-gray-200">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type a message..."
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
        </div>
      )}
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className="fixed bottom-20 right-5 z-30 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-gray-700"
      >
        {open ? 'Close chat' : 'Chat with support'}
      </button>
    </>
  )
}

export default function ChatWidget() {
  const { user } = useAuth()
  if (!user || user.role !== 'CUSTOMER') return null
  return <CustomerChat key={user.id ?? user.email} user={user} />
}
