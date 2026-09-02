import { ClipboardList, Cpu, Users, Rocket } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Run your Business Diagnostic',
    description: 'Complete a 60-second health assessment across 6 critical pillars: Sales, Revenue, Marketing, Hiring, Team, and Operations. Get an instant score with a breakdown of bottlenecks.',
    accent: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-100',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Diagnosis & Problem Analysis',
    description: 'Our system analyzes your bottleneck, identifies root causes, estimates complexity, and prepares a structured problem brief for expert matching.',
    accent: 'bg-blue-50 text-blue-700',
    border: 'border-blue-100',
  },
  {
    number: '03',
    icon: Users,
    title: 'Match with an Elite Operator',
    description: 'We identify your top 3-5 experts from our vetted network based on industry match, skills, availability, and track record. Only the top 3% are accepted.',
    accent: 'bg-purple-50 text-purple-700',
    border: 'border-purple-100',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Execute inside the OS',
    description: 'Your project launches inside a structured execution workspace with weekly sprints, daily standups, and milestone tracking with escrow protection.',
    accent: 'bg-amber-50 text-amber-700',
    border: 'border-amber-100',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding" style={{ background: '#f9fafb' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-3">The Process</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            From bottleneck to <span className="gradient-text">measurable results</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            A structured process replacing the chaos of freelancing with execution certainty.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div key={step.number} className="card h-full group">
              {/* Step icon */}
              <div className={`w-12 h-12 rounded-xl ${step.accent} flex items-center justify-center mb-5 ${step.border} border`}>
                <step.icon className="w-5 h-5" />
              </div>
              {/* Step number */}
              <div className="text-xs font-mono font-bold text-gray-300 mb-2 tracking-widest">
                STEP {step.number}
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-base leading-snug">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-gray-200">
          {[
            { value: '3%', label: 'Expert acceptance rate' },
            { value: '48h', label: 'Average match time' },
            { value: '92%', label: 'Project success rate' },
            { value: '200+', label: 'Active operators' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
