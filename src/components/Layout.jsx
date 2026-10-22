import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { isDemoMode } from '../api/client.js'
import ChatWidget from './ChatWidget.jsx'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import WhatsAppButton from './WhatsAppButton.jsx'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      {isDemoMode && (
        <p className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
          Demo preview: sample data only. Accounts and orders are local to this
          browser; no real purchases or support requests are made.
        </p>
      )}
      <ScrollToTop />
      <Toaster position="top-right" />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  )
}
