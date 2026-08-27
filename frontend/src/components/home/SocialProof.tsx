import { Star, BadgeCheck } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Aryan Mehta',
    role: 'CEO, FinTrack',
    initials: 'AM',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    quote: 'Within 36 hours of submitting my sales problem, I was matched with a revenue operator who had done exactly this before. The execution workspace kept us on track every week.',
    score: '74 to 91',
    scoreLabel: 'Health Score',
  },
  {
    name: 'Priya Nair',
    role: 'Fractional CMO',
    initials: 'PN',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    quote: 'I was skeptical. Every platform promises quality clients. Foundic actually delivered. All three of my matches were serious founders with real budgets and clear problems.',
    score: '$24K',
    scoreLabel: 'First 90 days',
  },
  {
    name: 'Rahul Sharma',
    role: 'CTO, BuildSpace',
    initials: 'RS',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    quote: 'The structured workspace is what sets Foundic apart. Daily updates, sprint tracking, invoice milestones — all in one place. No chaos, no spreadsheets.',
    score: '6 weeks',
    scoreLabel: 'To go-to-market',
  },
]

export default function SocialProof() {
  return (
    <section className="section-padding" style={{ background: '#f9fafb' }}>
      <div className="container-custom">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-3">Results that speak</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by founders and <span className="gradient-text">operators worldwide</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card flex flex-col">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full ${t.bg} ${t.text} flex items-center justify-center font-bold text-sm shrink-0`}>
                  {t.initials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                    {t.name}
                    <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">{t.score}</div>
                  <div className="text-xs text-gray-400">{t.scoreLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand logos */}
        <div className="mt-14 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Trusted by startups and scale-ups</p>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {['FinTrack', 'BuildSpace', 'NovaMed', 'ScaleHQ', 'OpsFlow', 'GrowthLab'].map((brand) => (
              <span key={brand} className="text-gray-400 font-semibold text-sm tracking-wide">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
