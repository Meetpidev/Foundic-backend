import { useState } from 'react'
import { Search, Star, CheckCircle, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const SKILL_OPTIONS = ['Sales', 'Revenue Ops', 'Marketing', 'Hiring', 'Operations', 'Finance', 'Product', 'Engineering']

const MOCK_EXPERTS = [
  { id: '1', fullName: 'Marcus Chen', title: 'Revenue Operations Expert', skills: ['Revenue Ops', 'Sales', 'CRM'], rating: 4.9, completedProjects: 47, hourlyRate: 180, bio: 'Former Salesforce revenue architect. Built $0–$50M pipelines for 3 SaaS companies. Specializes in founder-led sales systems.', tier: 'TIER_1', available: true, initials: 'MC', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { id: '2', fullName: 'Priya Nair', title: 'Fractional CMO', skills: ['Marketing', 'Product', 'Growth'], rating: 4.8, completedProjects: 32, hourlyRate: 160, bio: '10 years of B2B marketing leadership. Scaled 2 brands from seed to Series B through content and demand generation.', tier: 'TIER_1', available: true, initials: 'PN', bg: 'bg-blue-100', text: 'text-blue-700' },
  { id: '3', fullName: 'James Okafor', title: 'GTM & Sales Strategist', skills: ['Sales', 'Hiring', 'Operations'], rating: 4.7, completedProjects: 28, hourlyRate: 150, bio: 'Ex-McKinsey consultant turned startup operator. Helps founders build repeatable go-to-market systems in 90 days.', tier: 'TIER_2', available: false, initials: 'JO', bg: 'bg-purple-100', text: 'text-purple-700' },
  { id: '4', fullName: 'Ananya Kapoor', title: 'People & Talent Leader', skills: ['Hiring', 'Operations', 'Finance'], rating: 4.9, completedProjects: 51, hourlyRate: 140, bio: 'Built hiring infrastructure for 6 high-growth startups. Expert in recruiting systems, culture design, and performance management.', tier: 'TIER_1', available: true, initials: 'AK', bg: 'bg-amber-100', text: 'text-amber-700' },
  { id: '5', fullName: 'Liam Torres', title: 'Operational Excellence Lead', skills: ['Operations', 'Revenue Ops', 'Finance'], rating: 4.6, completedProjects: 19, hourlyRate: 130, bio: 'Lean Six Sigma expert. Reduced operational overhead by 40% for manufacturing and logistics companies in 3 countries.', tier: 'TIER_2', available: true, initials: 'LT', bg: 'bg-rose-100', text: 'text-rose-700' },
  { id: '6', fullName: 'Seo-Yeon Park', title: 'B2B Marketing Architect', skills: ['Marketing', 'Sales', 'Product'], rating: 4.8, completedProjects: 38, hourlyRate: 170, bio: 'Demand gen specialist who built $2M ARR pipelines through ABM and outbound programs for SaaS companies.', tier: 'TIER_1', available: true, initials: 'SP', bg: 'bg-teal-100', text: 'text-teal-700' },
]

export default function ExpertsPage() {
  const [search, setSearch] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)

  const experts = MOCK_EXPERTS.filter((e) => {
    const matchesSearch = !search || e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.bio.toLowerCase().includes(search.toLowerCase())
    const matchesSkill = !selectedSkill || e.skills.includes(selectedSkill)
    const matchesAvail = !availableOnly || e.available
    return matchesSearch && matchesSkill && matchesAvail
  })

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50/50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-3">Expert Network</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Elite fractional <span className="gradient-text">operators</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every expert on Foundic has been vetted through our 3-stage screening process. Only the top 3% make it in.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by name, skill, or expertise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input md:w-48"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">All Skills</option>
            {SKILL_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm">
            <input
              type="checkbox"
              className="w-4 h-4 accent-emerald-700"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Available now</span>
          </label>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6 font-medium">{experts.length} experts found</p>

        {/* Expert Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experts.map((expert) => (
            <div key={expert.id} className="expert-card flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${expert.bg} ${expert.text} flex items-center justify-center font-bold text-sm shrink-0`}>
                      {expert.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{expert.fullName}</div>
                      <div className="text-xs text-gray-500">{expert.title}</div>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 ${expert.available ? 'bg-emerald-500' : 'bg-gray-300'}`} title={expert.available ? 'Available' : 'Busy'} />
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{expert.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {expert.skills.map((skill) => (
                    <span key={skill} className="badge badge-info text-xs">{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                {/* Metrics */}
                <div className="flex items-center gap-4 mb-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-gray-900 font-bold">{expert.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{expert.completedProjects} projects</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-auto">
                    <span className="text-gray-900 font-bold">${expert.hourlyRate}</span>/hr
                  </div>
                </div>

                {/* Tier */}
                <div className="flex items-center justify-between">
                  <span className={`badge text-xs ${expert.tier === 'TIER_1' ? 'badge-primary' : 'badge-info'}`}>
                    {expert.tier === 'TIER_1' ? '⭐ Tier 1' : 'Tier 2'}
                  </span>
                  <Link
                    to={`/experts/${expert.id}`}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-all"
                  >
                    View profile <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {experts.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No experts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
