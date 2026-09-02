import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import api, { getApiErrorMessage } from '@/lib/api'
import Logo from '@/components/common/Logo'

type Role = 'FOUNDER' | 'EXPERT' | 'COMPANY'

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: 'FOUNDER', label: 'Founder / Entrepreneur', desc: 'Diagnose business bottlenecks and hire operators' },
  { value: 'EXPERT', label: 'Expert Operator', desc: 'Get matched with high-quality founder engagements' },
  { value: 'COMPANY', label: 'Company / Enterprise', desc: 'Deploy sprint squads for critical initiatives' },
]

export default function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<Role>('FOUNDER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })

  const [devOtpCode, setDevOtpCode] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        phone: form.phone.trim() || undefined,
        role,
      }
      const res = await api.post('/auth/signup', payload)
      const data = res.data?.data
     
      setStep('otp')
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Sign up failed. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/verify-otp', { identifier: form.email, otp })
      const { accessToken, refreshToken, user } = res.data.data
      login(user, accessToken, refreshToken)
      navigate(user.role === 'FOUNDER' ? '/dashboard/founder' : user.role === 'EXPERT' ? '/dashboard/expert' : '/dashboard/company')
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Invalid OTP. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,231,235,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(229,231,235,0.6)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-1">
            {step === 'details' ? 'Create your account' : 'Verify your email'}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 'details'
              ? 'Join the premier fractional operator network'
              : `We sent a 6-digit code to ${form.email}`
            }
          </p>
        </div>

        <div className="card shadow-sm border border-gray-200 bg-white p-6">
          {step === 'details' ? (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {/* Role Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase tracking-wide">I am a</label>
                <div className="flex flex-col gap-2">
                  {ROLES.map((r) => (
                    <button
                      type="button"
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={`text-left px-4 py-3 rounded-lg border transition-all ${
                        role === r.value
                          ? 'border-[#2597a3] bg-[#eef8f9] text-gray-900 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold text-sm text-gray-900">{r.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="input pl-10"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    className="input pl-10"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
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
                {isLoading ? 'Creating account...' : 'Create account'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-center text-gray-500 text-xs mt-2">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#2597a3] hover:text-[#1c7a85]">Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Verification Code</label>
                <input
                  type="text"
                  className="input text-center text-xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Check your email inbox for the 6-digit code
                </p>
              
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary justify-center w-full py-3" disabled={isLoading || otp.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-gray-500 text-xs text-center hover:text-gray-700 transition-colors mt-2"
              >
                ← Back to sign up
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-gray-700 font-medium hover:underline">Terms</a> and{' '}
          <a href="/privacy" className="text-gray-700 font-medium hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
