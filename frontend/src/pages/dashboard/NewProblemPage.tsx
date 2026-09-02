import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, TrendingUp, BarChart2, Activity, Users, Briefcase, Settings } from 'lucide-react'
import api, { getApiErrorMessage } from '@/lib/api'

const CATEGORIES = [
  { value: 'SALES', label: 'Sales', icon: TrendingUp, accent: 'bg-[#eef8f9] text-[#2597a3] border-[#d3f0f3]' },
  { value: 'REVENUE', label: 'Revenue', icon: BarChart2, accent: 'bg-purple-50 text-purple-700 border-purple-100' },
  { value: 'MARKETING', label: 'Marketing', icon: Activity, accent: 'bg-blue-50 text-blue-700 border-blue-100' },
  { value: 'HIRING', label: 'Hiring', icon: Users, accent: 'bg-amber-50 text-amber-700 border-amber-100' },
  { value: 'TEAM', label: 'Team', icon: Briefcase, accent: 'bg-teal-50 text-teal-700 border-teal-100' },
  { value: 'OPERATIONS', label: 'Operations', icon: Settings, accent: 'bg-rose-50 text-rose-700 border-rose-100' },
]

const URGENCY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const

export default function NewProblemPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    currentState: '',
    desiredOutcome: '',
    category: '',
    urgency: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    budget: '',
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        budget: form.budget ? parseFloat(form.budget) : undefined,
      }
      await api.post('/founder/problems', payload)
      navigate('/dashboard/founder', { state: { success: 'Problem submitted for AI diagnosis' } })
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Failed to submit problem. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50/50">
      <div className="container-custom max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard/founder" className="text-gray-500 text-sm font-semibold hover:text-gray-900 flex items-center gap-1.5 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Submit a Problem</h1>
          <p className="text-gray-500 mt-1 text-sm">Describe your business bottleneck clearly to get the best operator match.</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all ${
                s <= step ? 'bg-[#2597a3]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Category & Title */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                What area is your problem in?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.value })}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      form.category === cat.value
                        ? 'border-[#2597a3] bg-[#eef8f9]/80 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${cat.accent} border flex items-center justify-center mb-2`}>
                      <cat.icon className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Problem Title</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Sales pipeline lacks consistent lead qualification"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={100}
              />
              <p className="text-xs text-gray-400 mt-1">{form.title.length}/100</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Urgency Level</label>
              <div className="flex gap-2 flex-wrap">
                {URGENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm({ ...form, urgency: opt })}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all font-semibold ${
                      form.urgency === opt
                        ? 'border-[#2597a3] bg-[#2597a3] text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary justify-center mt-2 py-3"
              disabled={!form.category || !form.title}
              onClick={() => setStep(2)}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Describe the problem</label>
              <textarea
                className="input min-h-32 resize-none"
                placeholder="Explain the problem in detail. What's happening? When did it start? What have you tried?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Current State</label>
              <textarea
                className="input min-h-24 resize-none"
                placeholder="Where are you right now? Numbers, metrics, specific examples..."
                value={form.currentState}
                onChange={(e) => setForm({ ...form, currentState: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Desired Outcome</label>
              <textarea
                className="input min-h-24 resize-none"
                placeholder="Where do you want to be? What does success look like in 90 days?"
                value={form.desiredOutcome}
                onChange={(e) => setForm({ ...form, desiredOutcome: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                className="btn-primary flex-1 justify-center py-3"
                disabled={!form.description}
                onClick={() => setStep(3)}
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Submit */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Budget (optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                <input
                  type="number"
                  className="input pl-7"
                  placeholder="e.g. 5000"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  min={0}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">This helps us match you with operators within your range</p>
            </div>

            {/* Summary */}
            <div className="card border border-gray-200 bg-white">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Submission Summary</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="text-gray-900 font-semibold">{form.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Urgency</span>
                  <span className="text-gray-900 font-semibold">{form.urgency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Title</span>
                  <span className="text-gray-900 font-semibold text-right max-w-xs truncate">{form.title}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center py-3">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                className="btn-primary flex-1 justify-center py-3"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? 'Submitting...' : 'Submit for diagnosis'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-gray-400 text-xs text-center">
              Your problem will be reviewed by AI and the Foundic team before matching begins
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
