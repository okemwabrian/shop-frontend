import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SocketProvider>
              <NotificationProvider>
                <CartProvider>
                  <WishlistProvider>
                    <App />
                    <Toaster position="top-right" />
                  </WishlistProvider>
                </CartProvider>
              </NotificationProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
