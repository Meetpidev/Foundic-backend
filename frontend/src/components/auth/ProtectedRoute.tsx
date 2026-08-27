import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard
    const roleRedirects: Record<string, string> = {
      FOUNDER: '/dashboard/founder',
      EXPERT: '/dashboard/expert',
      COMPANY: '/dashboard/company',
    }
    return <Navigate to={roleRedirects[user.role] || '/'} replace />
  }

  return <>{children}</>
}
