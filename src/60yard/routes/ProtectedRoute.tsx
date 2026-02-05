import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/60yard/store/auth'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

