import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Activity, TrendingUp, BarChart2, Users, Briefcase, Settings, Zap } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth'

const PILLARS = [
  { key: 'sales', label: 'Sales', icon: TrendingUp, description: 'Lead generation, conversion, and pipeline management' },
  { key: 'revenue', label: 'Revenue', icon: BarChart2, description: 'Revenue growth, retention, and monetization' },
  { key: 'marketing', label: 'Marketing', icon: Activity, description: 'Brand, demand generation, and positioning' },
  { key: 'hiring', label: 'Hiring', icon: Users, description: 'Talent acquisition, retention, and team building' },
  { key: 'team', label: 'Team', icon: Briefcase, description: 'Culture, performance, and organizational health' },
  { key: 'operations', label: 'Operations', icon: Settings, description: 'Processes, efficiency, and systems' },
]

const HEALTH_LABELS = [
  { min: 0, max: 40, label: 'Critical', color: 'text-red-600' },
  { min: 40, max: 60, label: 'At Risk', color: 'text-amber-600' },
  { min: 60, max: 80, label: 'Developing', color: 'text-blue-600' },
  { min: 80, max: 100, label: 'Healthy', color: 'text-emerald-700' },
]

const getHealthLabel = (score: number) =>
  HEALTH_LABELS.find(h => score >= h.min && score <= h.max) || HEALTH_LABELS[0]

// Pure SVG Radar chart — light mode compatible
function RadarChartSVG({ data }: { data: { pillar: string; score: number }[] }) {
  const size = 240
  const cx = size / 2
  const cy = size / 2
  const r = 80
  const n = data.length

  const angleOf = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2

  const pointOnAxis = (i: number, radius: number) => ({
    x: cx + radius * Math.cos(angleOf(i)),
    y: cy + radius * Math.sin(angleOf(i)),
  })

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1]

  // Data polygon points
  const dataPoints = data.map((d, i) => pointOnAxis(i, (d.score / 100) * r))
  const polygonStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {rings.map((ring) => {
        const pts = Array.from({ length: n }, (_, i) => pointOnAxis(i, ring * r))
        return (
          <polygon
            key={ring}
            points={pts.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgb(229 231 235)"
            strokeWidth={1.5}
          />
        )
      })}

      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => {
        const outer = pointOnAxis(i, r)
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={outer.x} y2={outer.y}
            stroke="rgb(229 231 235)"
            strokeWidth={1.5}
          />
        )
      })}

      {/* Data polygon */}
      <polygon
        points={polygonStr}
        fill="rgba(37, 151, 163, 0.15)"
        stroke="rgb(37 151 163)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="rgb(37 151 163)" />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const pt = pointOnAxis(i, r + 22)
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgb(75 85 99)"
            fontSize={11}
            fontWeight={600}
          >
            {d.pillar}
          </text>
        )
      })}
    </svg>
  )
}

export default function DiagnosticPage() {
  const { user } = useAuthStore()
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [currentPillar, setCurrentPillar] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [overallScore, setOverallScore] = useState(0)

  const handleScore = (value: number) => {
    const newScores = { ...scores, [PILLARS[currentPillar].key]: value }
    setScores(newScores)
    if (currentPillar < PILLARS.length - 1) {
      setTimeout(() => setCurrentPillar(currentPillar + 1), 200)
    } else {
      handleSubmit(newScores)
    }
  }

  const handleSubmit = async (finalScores: Record<string, number>) => {
    const weights: Record<string, number> = { sales: 0.25, revenue: 0.25, marketing: 0.15, hiring: 0.1, team: 0.15, operations: 0.1 }
    let score = 0
    for (const [key, weight] of Object.entries(weights)) {
      score += (finalScores[key] ?? 50) * weight
    }
    setOverallScore(Math.round(score))

    if (user) {
      try { await api.post('/founder/health-check', finalScores) } catch {}
    }
    setStep('result')
  }

  const radarData = PILLARS.map(p => ({ pillar: p.label, score: scores[p.key] ?? 0 }))
  const healthLabel = getHealthLabel(overallScore)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50/50">
      <div className="container-custom max-w-3xl">

        {/* INTRO */}
        {step === 'intro' && (
          <div className="text-center animate-fade-in-up">
            <p className="text-xs font-semibold text-[#2597a3] uppercase tracking-widest mb-3">Free Diagnostic</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How healthy is your<br />
              <span className="gradient-text">business right now?</span>
            </h1>
            <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
              Answer 6 questions across the critical pillars of your business. Takes 60 seconds. Get an instant health score and bottleneck analysis.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10 max-w-lg mx-auto">
              {PILLARS.map(p => (
                <div key={p.key} className="card text-center py-4 px-3 border border-gray-200">
                  <p.icon className="w-5 h-5 text-[#2597a3] mx-auto mb-2" />
                  <div className="text-xs text-gray-900 font-semibold">{p.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('quiz')} className="btn-primary text-base py-3.5 px-8">
              Start diagnostic <ArrowRight className="w-5 h-5" />
            </button>
            {!user && (
              <p className="text-gray-500 text-xs mt-4">
                No account required · <Link to="/signup" className="font-semibold text-[#2597a3] hover:text-[#1c7a85]">Sign up</Link> to save results
              </p>
            )}
          </div>
        )}

        {/* QUIZ */}
        {step === 'quiz' && (
          <div className="animate-fade-in-up">
            <div className="mb-8">
              <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                <span>{PILLARS[currentPillar].label}</span>
                <span>{currentPillar + 1} / {PILLARS.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#2597a3] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentPillar / PILLARS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="card mb-6 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-[#eef8f9] text-[#2597a3] border border-[#d3f0f3] flex items-center justify-center mb-4">
                {(() => { const Icon = PILLARS[currentPillar].icon; return <Icon className="w-5 h-5" /> })()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Rate your <span className="gradient-text">{PILLARS[currentPillar].label}</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">{PILLARS[currentPillar].description}</p>
            </div>

            <div className="card border border-gray-200">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-4">
                <span>0 — Critical</span>
                <span>50 — Developing</span>
                <span>100 — Excellent</span>
              </div>
              <div className="grid grid-cols-5 gap-2.5 mb-6">
                {([10, 30, 50, 70, 90] as const).map((val, i) => {
                  const labels = ['Critical', 'At Risk', 'Developing', 'Good', 'Excellent']
                  const colors = [
                    'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
                    'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
                    'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                    'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
                    'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800',
                  ]
                  return (
                    <button
                      key={val}
                      onClick={() => handleScore(val)}
                      className={`py-3 px-1 rounded-xl border font-semibold text-xs transition-all ${colors[i]}`}
                    >
                      {labels[i]}
                    </button>
                  )
                })}
              </div>
              <p className="text-gray-400 text-xs text-center">Select how you rate your current state</p>
            </div>

            {currentPillar > 0 && (
              <button
                onClick={() => setCurrentPillar(currentPillar - 1)}
                className="mt-4 text-gray-500 text-sm font-medium hover:text-gray-900 transition-colors"
              >
                ← Previous
              </button>
            )}
          </div>
        )}

        {/* RESULT */}
        {step === 'result' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <div className={`text-6xl font-extrabold mb-2 ${healthLabel.color}`}>{overallScore}</div>
              <div className="text-xl text-gray-900 font-bold mb-1">Business Health Score</div>
              <span className={`badge ${healthLabel.color} font-semibold`} style={{ border: '1px solid currentColor', background: 'rgba(0,0,0,0.03)' }}>
                {healthLabel.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* SVG Radar Chart */}
              <div className="card flex flex-col items-center border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm self-start">Pillar Breakdown</h3>
                <RadarChartSVG data={radarData} />
              </div>

              {/* Score bars */}
              <div className="card border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Score by Pillar</h3>
                <div className="flex flex-col gap-3">
                  {PILLARS.map(p => (
                    <div key={p.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 font-medium">{p.label}</span>
                        <span className="text-gray-900 font-bold">{scores[p.key] ?? 0}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#2597a3] h-2 rounded-full transition-all duration-700"
                          style={{ width: `${scores[p.key] ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="card text-center border border-gray-200 bg-white p-8">
              <div className="w-12 h-12 rounded-xl bg-[#eef8f9] text-[#2597a3] mx-auto flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Find your operator</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                Submit your specific bottleneck and we will match you with a verified expert who has solved exactly this before.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {user ? (
                  <Link to="/dashboard/founder" className="btn-primary">
                    Go to my Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="btn-primary">
                      Create account & submit problem <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => { setStep('intro'); setCurrentPillar(0); setScores({}) }}
                      className="btn-secondary"
                    >
                      Retake diagnostic
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
