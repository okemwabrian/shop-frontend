import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const role = String(user.role || '').toUpperCase()
  if (role !== 'ADMIN' && role !== 'SUPPORT') {
    return <Navigate to="/" replace />
  }

  return children
}
