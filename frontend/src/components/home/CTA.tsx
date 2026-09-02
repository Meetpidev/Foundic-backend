import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div
          className="relative rounded-2xl overflow-hidden border border-gray-200 p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #f0faf5 0%, #f0f4ff 100%)' }}
        >
          <p className="text-xs font-semibold text-[#2597a3] uppercase tracking-widest mb-4">Get started free</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ready to stop guessing<br />
            <span className="gradient-text">and start executing?</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Take the free 60-second diagnostic and find out exactly where your business is losing momentum — and who can fix it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/diagnostic" className="btn-primary text-base py-3.5 px-8">
              Run free diagnostic
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/signup" className="btn-secondary text-base py-3.5 px-8">
              Create your account
            </Link>
          </div>
          <p className="text-gray-400 text-xs mt-6">No credit card required · Instant results · Free for founders</p>
        </div>
      </div>
    </section>
  )
}
