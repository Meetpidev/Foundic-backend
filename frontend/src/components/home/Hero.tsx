import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, BadgeCheck, MapPin } from 'lucide-react'

const TABS = ['For Founders', 'For Experts']

const EXPERTS = [
  { initials: 'AR', name: 'Aarav Rathi', role: 'Fractional CRO', bg: 'bg-emerald-100', text: 'text-emerald-700', prevAt: 'Freshworks' },
  { initials: 'PM', name: 'Priya Menon', role: 'Growth Operator', bg: 'bg-blue-100', text: 'text-blue-700', prevAt: 'Razorpay' },
  { initials: 'SK', name: 'Siddharth Kapoor', role: 'Product Lead', bg: 'bg-purple-100', text: 'text-purple-700', prevAt: 'Swiggy' },
  { initials: 'NS', name: 'Neha Sharma', role: 'Ops Strategist', bg: 'bg-amber-100', text: 'text-amber-700', prevAt: 'Zepto' },
  { initials: 'VK', name: 'Vikram Kumar', role: 'Sales Operator', bg: 'bg-rose-100', text: 'text-rose-700', prevAt: 'Zoho' },
]

export default function Hero() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="pt-16 overflow-hidden" style={{ background: '#f0f2f7' }}>
      <div className="container-custom py-16 pb-0">
        {/* Tab Toggle */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-sm text-gray-500 font-medium">I am looking for</span>
          <div className="tab-pill">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                id={`hero-tab-${i}`}
                className={`tab-pill-btn ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pb-12">
          {/* Left: Headline + CTA */}
          <div className="max-w-xl">
            {activeTab === 0 ? (
              <>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-gray-900">
                  Fix your biggest{' '}
                  <span className="gradient-text">bottleneck</span>{' '}
                  with the top 3%
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Foundic connects founders with elite fractional operators who have solved exactly your problem before,
                  inside a structured execution system with milestone-based results.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link to="/diagnostic" id="hero-cta-founder" className="btn-primary text-base py-3.5 px-7">
                    Run free diagnostic
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/experts" className="btn-secondary text-base py-3.5 px-7">
                    Browse experts
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-gray-900">
                  High-ticket work on{' '}
                  <span className="gradient-text">your terms</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Join the top 3% network and get matched to founders who need exactly your expertise.
                  No cold outreach, guaranteed milestone payouts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link to="/apply" id="hero-cta-expert" className="btn-primary text-base py-3.5 px-7">
                    Apply to the network
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/experts" className="btn-secondary text-base py-3.5 px-7">
                    View expert profiles
                  </Link>
                </div>
              </>
            )}

            {/* Trust points */}
            <div className="flex flex-col gap-2">
              {[
                'AI-powered business health diagnostic',
                'Matched to a verified operator in 48h',
                'Milestone-based escrow payment',
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Featured Expert Card */}
          <div className="hidden lg:flex justify-center items-start pt-4">
            <div className="expert-card w-64 animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base">
                  AR
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Aarav Rathi</div>
                  <div className="verified-badge mt-0.5">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified Expert in Revenue
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                <MapPin className="w-3 h-3" />
                Fractional CRO · B2B SaaS
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-1.5">Previously at</div>
              <div className="font-bold text-gray-700 text-sm">Freshworks</div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Match Rate</span>
                  <span className="font-semibold text-green-700">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Cards Strip */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container-custom py-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
            Top operators available now
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {EXPERTS.map((expert, i) => (
              <div
                key={expert.name}
                id={`expert-card-${i}`}
                className="expert-card flex-shrink-0 w-48 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-9 h-9 rounded-full ${expert.bg} ${expert.text} flex items-center justify-center font-bold text-xs shrink-0`}>
                    {expert.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs leading-tight">{expert.name}</div>
                    <div className="text-gray-500 text-xs">{expert.role}</div>
                  </div>
                </div>
                <div className="verified-badge text-xs mb-1">
                  <BadgeCheck className="w-3 h-3" />
                  Verified Expert
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Previously at <span className="font-medium text-gray-600">{expert.prevAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
