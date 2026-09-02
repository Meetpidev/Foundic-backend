import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Briefcase, Star, Clock, ArrowRight, CheckCircle, DollarSign, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'

export default function ExpertDashboard() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['expert-dashboard'],
    queryFn: () => api.get('/expert/dashboard').then(r => r.data.data),
  })

  const profile = data?.profile ?? null
  const matches = data?.matches ?? []
  const projects = data?.projects ?? []

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="text-sm text-slate-500 mb-1">Expert Portal</div>
            <h1 className="text-3xl font-bold text-white">
              Expert <span className="gradient-text">Dashboard</span>
            </h1>
          </div>
          <Link to="/dashboard/expert/profile" className="btn-secondary text-sm py-2">
            Edit profile
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Rating', value: profile?.rating ? `${profile.rating.toFixed(1)}★` : '—', icon: Star, color: 'from-amber-500 to-orange-600' },
                { label: 'Active Projects', value: projects.length, icon: Briefcase, color: 'from-purple-500 to-purple-600' },
                { label: 'Pending Matches', value: matches.length, icon: Clock, color: 'from-indigo-500 to-indigo-600' },
                { label: 'Completed', value: profile?.completedProjects ?? 0, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
              ].map((stat) => (
                <div key={stat.label} className="card">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Pending Matches */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Pending Match Requests</h2>
              {matches.length === 0 ? (
                <div className="card text-center py-10">
                  <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No pending match requests</p>
                  <p className="text-slate-600 text-xs mt-1">We'll notify you when a founder matches your profile</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {matches.map((match: any) => (
                    <div key={match.id} className="card hover:border-purple-500/30 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium text-white mb-1">
                            {match.problem?.title ?? 'Business Problem'}
                          </div>
                          <div className="text-sm text-slate-400 line-clamp-2">
                            {match.problem?.description}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {match.problem?.category && (
                              <span className="badge badge-primary text-xs">{match.problem.category}</span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <span className="badge badge-warning text-xs">Pending</span>
                          <Link
                            to={`/dashboard/expert/matches/${match.id}`}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            Review <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project: any) => (
                    <div key={project.id} className="card hover:border-purple-500/30 transition-all">
                      <div className="flex justify-between mb-3">
                        <span className="font-medium text-white text-sm">Project #{project.id.slice(0, 8)}</span>
                        <span className="badge badge-success text-xs">Active</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-[rgb(22_22_34)] rounded-lg p-2">
                          <div className="text-sm font-bold text-white">{project.tasks?.filter((t: any) => t.status === 'COMPLETED').length ?? 0}</div>
                          <div className="text-xs text-slate-500">Tasks done</div>
                        </div>
                        <div className="bg-[rgb(22_22_34)] rounded-lg p-2">
                          <div className="text-sm font-bold text-emerald-400">${project.totalBudget ?? '—'}</div>
                          <div className="text-xs text-slate-500">Budget</div>
                        </div>
                      </div>
                      <Link to={`/workspace/${project.id}`} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                        Open workspace <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
