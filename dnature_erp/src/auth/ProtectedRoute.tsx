import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

/**
 * Protected route wrapper that redirects to login if not authenticated
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
