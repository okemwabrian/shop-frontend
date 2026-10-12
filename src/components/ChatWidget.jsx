import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'

const messageClasses = {
  mine: 'ml-auto bg-orange-600 text-white',
  theirs: 'mr-auto bg-gray-100 text-gray-800',
}

export default function ChatWidget() {
  const { user } = useAuth()
  const { connected, subscribe, send } = useSocket()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!user || !connected) return

    const unsubscribe = subscribe('/user/queue/chat', (message) => {
      setMessages((current) => [...current, { ...message, mine: false }])
    })

    return unsubscribe
  }, [connected, subscribe, user])

  if (!user) return null

  async function sendMessage(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    const chatMessage = {
      text,
      sentAt: new Date().toISOString(),
      mine: true,
    }

    send('/app/chat.send', { text })
    setMessages((current) => [...current, chatMessage])
    setDraft('')
  }

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {open ? (
        <div className="w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between bg-gray-900 px-4 py-3 text-sm text-white">
            <span>Live chat</span>
            <button type="button" onClick={() => setOpen(false)} className="text-lg leading-none">
              ×
            </button>
          </div>

          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto bg-gray-50 p-3">
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500">Send a message to support.</p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.sentAt || index}-${index}`}
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${messageClasses[message.mine ? 'mine' : 'theirs']}`}
                >
                  {message.text}
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-200 p-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
            <button type="submit" className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white">
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          Chat with us
        </button>
      )}
    </div>
  )
}
