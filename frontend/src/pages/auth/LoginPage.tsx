import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [showPassword, setShowPassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [userId, setUserId] = useState('')
  const [token2FA, setToken2FA] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'FOUNDER': return '/dashboard/founder'
      case 'EXPERT': return '/dashboard/expert'
      case 'COMPANY': return '/dashboard/company'
      default: return '/dashboard'
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      const data = res.data.data
      if (data.requiresTwoFactor) {
        setUserId(data.userId)
        setShow2FA(true)
      } else {
        login(data.user, data.accessToken, data.refreshToken)
        navigate(getRedirectPath(data.user.role))
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/2fa/verify', { userId, token: token2FA })
      const { user, accessToken, refreshToken } = res.data.data
      login(user, accessToken, refreshToken)
      navigate(getRedirectPath(user.role))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid 2FA code.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,231,235,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(229,231,235,0.6)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Foundic<span className="text-emerald-700">OS</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">
            {show2FA ? 'Two-factor authentication' : 'Sign in to your account'}
          </h1>
          <p className="text-gray-500 text-sm">
            {show2FA ? 'Enter the code from your authenticator app' : 'Welcome back to Foundic Execution OS'}
          </p>
        </div>

        <div className="card shadow-sm border border-gray-200 bg-white p-6">
          {!show2FA ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    className="input pl-10"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs font-medium text-emerald-700 hover:text-emerald-800">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary justify-center mt-2 w-full py-3" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-center text-gray-500 text-xs mt-2">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-emerald-700 hover:text-emerald-800">Sign up free</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handle2FA} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Authentication Code</label>
                <input
                  type="text"
                  className="input text-center text-xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={6}
                  value={token2FA}
                  onChange={(e) => setToken2FA(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary justify-center w-full py-3" disabled={isLoading || token2FA.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify & Sign in'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setShow2FA(false)}
                className="text-gray-500 text-xs text-center hover:text-gray-700 transition-colors mt-2"
              >
                ← Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
