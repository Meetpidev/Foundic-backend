import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import Logo from '@/components/common/Logo'

const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'For Founders', href: '/#founders' },
  { label: 'For Experts', href: '/#experts' },
  { label: 'Expert Network', href: '/experts' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getDashboardPath = () => {
    if (!user) return '/dashboard'
    switch (user.role) {
      case 'FOUNDER': return '/dashboard/founder'
      case 'EXPERT': return '/dashboard/expert'
      case 'COMPANY': return '/dashboard/company'
      default: return '/dashboard'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md',
      scrolled ? 'shadow-sm border-b border-gray-200' : 'border-b border-gray-100'
    )}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors px-1 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardPath()} className="btn-secondary text-sm justify-center">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-sm justify-center">
                      Sign in
                    </Link>
                    <Link to="/signup" className="btn-primary text-sm justify-center">
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
