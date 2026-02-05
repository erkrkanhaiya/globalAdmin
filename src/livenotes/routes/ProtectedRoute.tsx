import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/livenotes/store/auth'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const location = useLocation()
  const selectedProduct = localStorage.getItem('selected_product')

  // Check if user is authenticated and product matches
  if (!isAuthenticated || selectedProduct !== 'livenotes') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
