import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'

// Auth guard
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import DiagnosticPage from '@/pages/DiagnosticPage'
import ExpertsPage from '@/pages/ExpertsPage'
import FounderDashboard from '@/pages/dashboard/FounderDashboard'
import ExpertDashboard from '@/pages/dashboard/ExpertDashboard'
import NewProblemPage from '@/pages/dashboard/NewProblemPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/experts" element={<ExpertsPage />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
          </Route>

          {/* Auth pages (no navbar/footer) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Founder dashboard */}
          <Route
            path="/dashboard/founder"
            element={
              <ProtectedRoute allowedRoles={['FOUNDER']}>
                <PublicLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<FounderDashboard />} />
            <Route path="new-problem" element={<NewProblemPage />} />
          </Route>

          {/* Expert dashboard */}
          <Route
            path="/dashboard/expert"
            element={
              <ProtectedRoute allowedRoles={['EXPERT']}>
                <PublicLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ExpertDashboard />} />
          </Route>

          {/* Redirects */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
