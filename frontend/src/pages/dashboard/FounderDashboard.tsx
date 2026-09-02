import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { TrendingUp, Target, Users, ArrowRight, Plus, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  DRAFT: { label: 'Draft', className: 'badge-info', icon: Clock },
  AI_REVIEW: { label: 'AI Review', className: 'badge-warning', icon: Loader },
  FOUNDIC_REVIEW: { label: 'Under Review', className: 'badge-warning', icon: Clock },
  APPROVED: { label: 'Approved', className: 'badge-success', icon: CheckCircle },
  REJECTED: { label: 'Rejected', className: 'bg-red-50 text-red-700 border border-red-200', icon: AlertCircle },
}

export default function FounderDashboard() {
  const { user } = useAuthStore()

  const { data: dashData, isLoading } = useQuery({
    queryKey: ['founder-dashboard'],
    queryFn: () => api.get('/founder/dashboard').then(r => r.data.data),
  })

  const healthScore = dashData?.businessHealthScore ?? null
  const problems = dashData?.activeProblems ?? []
  const projects = dashData?.activeProjects ?? []

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700'
    if (score >= 60) return 'text-blue-700'
    if (score >= 40) return 'text-amber-700'
    return 'text-red-700'
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50/50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-1">Founder Portal</p>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back<span className="gradient-text">{user?.email ? `, ${user.email.split('@')[0]}` : ''}</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <Link to="/diagnostic" className="btn-secondary text-sm py-2">
              Run diagnostic
            </Link>
            <Link to="/dashboard/founder/new-problem" className="btn-primary text-sm py-2">
              <Plus className="w-4 h-4" /> Submit problem
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Health Score */}
              <div className="card border border-gray-200 relative overflow-hidden">
                <div className="relative flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  {healthScore !== null && (
                    <span className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                      {healthScore}
                    </span>
                  )}
                </div>
                <div className="font-semibold text-gray-900">Business Health Score</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {healthScore === null ? 'Take the diagnostic to see your score' : 'Out of 100 across all pillars'}
                </div>
                {healthScore === null && (
                  <Link to="/diagnostic" className="text-emerald-700 text-xs mt-2 inline-flex items-center gap-1 font-semibold hover:text-emerald-800">
                    Run diagnostic <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
                {healthScore !== null && (
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-700 h-1.5 rounded-full"
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Active Problems */}
              <div className="card border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                    <Target className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{problems.length}</span>
                </div>
                <div className="font-semibold text-gray-900">Active Problems</div>
                <div className="text-xs text-gray-500 mt-0.5">Under diagnosis or matching</div>
              </div>

              {/* Active Projects */}
              <div className="card border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{projects.length}</span>
                </div>
                <div className="font-semibold text-gray-900">Active Projects</div>
                <div className="text-xs text-gray-500 mt-0.5">In execution workspace</div>
              </div>
            </div>

            {/* Problems Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Your Problems</h2>
                <Link to="/dashboard/founder/new-problem" className="text-emerald-700 text-sm font-semibold hover:text-emerald-800 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add new
                </Link>
              </div>

              {problems.length === 0 ? (
                <div className="card border border-gray-200 text-center py-10">
                  <Target className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-4">No active problems submitted yet</p>
                  <Link to="/dashboard/founder/new-problem" className="btn-primary text-sm py-2">
                    Submit your first problem
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {problems.map((problem: any) => {
                    const status = STATUS_CONFIG[problem.status] || STATUS_CONFIG.DRAFT
                    const StatusIcon = status.icon
                    return (
                      <div key={problem.id} className="card border border-gray-200 hover:border-emerald-200 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 mb-1 truncate">{problem.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">{problem.description}</div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <span className={`badge ${status.className} text-xs flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                            {problem.category && (
                              <span className="badge badge-primary text-xs">{problem.category}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-400">
                            Submitted {new Date(problem.createdAt).toLocaleDateString()}
                          </span>
                          <Link to={`/dashboard/founder/problems/${problem.id}`} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 ml-auto">
                            View details <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Active Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Active Executions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project: any) => (
                    <div key={project.id} className="card border border-gray-200 hover:border-emerald-200 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-gray-900 text-sm">Project #{project.id.slice(0, 8)}</div>
                        <span className="badge badge-success text-xs">Active</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                          <div className="text-sm font-bold text-gray-900">{project.tasks?.length ?? 0}</div>
                          <div className="text-xs text-gray-500">Tasks</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                          <div className="text-sm font-bold text-gray-900">{project.milestones?.length ?? 0}</div>
                          <div className="text-xs text-gray-500">Milestones</div>
                        </div>
                      </div>
                      <Link to={`/workspace/${project.id}`} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
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
