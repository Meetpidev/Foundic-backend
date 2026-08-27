import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import Journeys from '@/components/home/Journeys'
import SocialProof from '@/components/home/SocialProof'
import CTA from '@/components/home/CTA'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <div className="divider" />
      <HowItWorks />
      <div className="divider" />
      <Journeys />
      <div className="divider" />
      <SocialProof />
      <div className="divider" />
      <CTA />
    </>
  )
}
