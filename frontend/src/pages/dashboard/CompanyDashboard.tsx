import { Building2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

export default function CompanyDashboard() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="container-custom py-24">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2597a3]">Company workspace</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Welcome back{user?.email ? `, ${user.email}` : ''}
        </h1>
        <p className="mt-3 text-gray-600">
          Your company dashboard is ready. Manage your initiatives and connect with the right experts from here.
        </p>
        <Link to="/experts" className="btn-primary mt-8 inline-flex items-center gap-2">
          Explore experts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 flex items-center gap-4 border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f5f6] text-[#2597a3]">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">Company profile</h2>
          <p className="mt-1 text-sm text-gray-500">Your company workspace will appear here.</p>
        </div>
      </div>
    </div>
  )
}
