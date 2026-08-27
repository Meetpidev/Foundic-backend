import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Users, Building2, CheckCircle } from 'lucide-react'

const JOURNEYS = [
  {
    id: 'founders',
    icon: TrendingUp,
    label: 'Founders',
    audience: 'For Founders',
    headline: 'Turn your biggest bottleneck into your next breakthrough',
    description: 'You know your business is stuck somewhere. Foundic diagnoses exactly what it is and connects you with the operator who has solved it before.',
    benefits: [
      'AI-powered business health diagnostic',
      'Matched to a verified operator in 48h',
      'Structured execution with weekly milestones',
      'Milestone-escrow payment protection',
    ],
    cta: 'Diagnose your business',
    href: '/diagnostic',
    accentColor: 'text-green-700',
    metrics: [
      { label: 'Health Score', value: '74/100', trend: '+12 pts' },
      { label: 'Time to Match', value: '36h', trend: 'Average' },
      { label: 'Problems Solved', value: '3', trend: 'Active' },
      { label: 'Success Rate', value: '94%', trend: 'Platform' },
    ],
  },
  {
    id: 'experts',
    icon: Users,
    label: 'Experts',
    audience: 'For Experts',
    headline: 'High-ticket work on your terms, without the BD grind',
    description: 'You are great at what you do. Join the top 3% network and get matched to founders who need exactly your expertise.',
    benefits: [
      'Zero cold outreach — inbound matching',
      'Pre-qualified, serious founders only',
      'Guaranteed milestone payouts via escrow',
      'Build your verified operator track record',
    ],
    cta: 'Apply to the network',
    href: '/apply',
    accentColor: 'text-blue-700',
    metrics: [
      { label: 'Avg Project Rate', value: '$4,200', trend: 'Monthly' },
      { label: 'Match Quality', value: '94%', trend: 'Accept rate' },
      { label: 'Active Projects', value: '2', trend: 'Concurrent max' },
      { label: 'Network Status', value: 'Tier 1', trend: 'Approved' },
    ],
  },
  {
    id: 'companies',
    icon: Building2,
    label: 'Companies',
    audience: 'For Companies',
    headline: 'Deploy sprint squads for your most critical initiatives',
    description: 'Assemble vetted fractional operators for high-impact sprints with structured accountability and full execution workspace.',
    benefits: [
      'Assembles tailored sprint squads in days',
      'Faster than consulting, better than freelancers',
      'Full execution workspace and reporting',
      'SOW-based contracts and IP protection',
    ],
    cta: 'Talk to our team',
    href: '/enterprise',
    accentColor: 'text-amber-700',
    metrics: [
      { label: 'Sprint Velocity', value: '89%', trend: 'On-time' },
      { label: 'Ramp Time', value: '3 days', trend: 'Avg onboarding' },
      { label: 'Squad Size', value: '1-8', trend: 'Operators' },
      { label: 'Engagement', value: 'SOW', trend: 'IP protected' },
    ],
  },
]

export default function Journeys() {
  const [active, setActive] = useState(0)
  const journey = JOURNEYS[active]
  const Icon = journey.icon

  return (
    <section id="founders" className="section-padding">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-3">Who it is for</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for every side <span className="gradient-text">of the equation</span>
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="tab-pill">
            {JOURNEYS.map((j, i) => (
              <button
                key={j.id}
                id={`journey-tab-${j.id}`}
                className={`tab-pill-btn ${active === i ? 'active' : ''}`}
                onClick={() => setActive(i)}
              >
                {j.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 badge badge-primary mb-5">
              <Icon className="w-3.5 h-3.5" />
              {journey.audience}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {journey.headline}
            </h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              {journey.description}
            </p>
            <ul className="flex flex-col gap-2.5 mb-8">
              {journey.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
            <Link to={journey.href} className="btn-primary inline-flex">
              {journey.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Metric card */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{journey.audience} Portal</div>
                <div className="text-xs text-gray-400">Foundic Execution OS</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {journey.metrics.map((metric) => (
                <div key={metric.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xl font-bold text-gray-900 mb-0.5">{metric.value}</div>
                  <div className="text-xs text-gray-400">{metric.label}</div>
                  <div className={`text-xs font-medium mt-1 ${journey.accentColor}`}>{metric.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
