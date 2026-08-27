import { Link } from 'react-router-dom'
import { Zap, Globe, Share2, Send } from 'lucide-react'

const FOOTER_LINKS = {
  Platform: [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Expert Network', href: '/experts' },
    { label: 'For Founders', href: '/#founders' },
    { label: 'For Companies', href: '/#companies' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">
                Foundic<span className="text-emerald-700">OS</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The Execution Operating System connecting founders with elite fractional operators for measurable business growth.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:border-emerald-600 transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:border-emerald-600 transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:border-emerald-600 transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">{category}</h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Foundic Execution OS. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built for the world's ambitious founders.
          </p>
        </div>
      </div>
    </footer>
  )
}
