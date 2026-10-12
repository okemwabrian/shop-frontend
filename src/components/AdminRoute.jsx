import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminRoute({ roles = ['ADMIN', 'SUPPORT'], children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />
  }

  if (!roles.includes(user.role)) {
    return (
      <p className="py-16 text-center text-red-600">
        You do not have access to this page.
      </p>
    )
  }

  return children
}
