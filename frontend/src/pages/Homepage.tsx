import { Suspense } from "react"
import HeroSection from "@/components/sections/hero-section"
import FeaturesSection from "@/components/sections/features-section"
import StatsSection from "@/components/sections/stats-section"
import TestimonialsSection from "@/components/sections/testimonials-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Suspense fallback={<div>Loading features...</div>}>
        <FeaturesSection />
      </Suspense>
      <StatsSection />
      <TestimonialsSection />
    </main>
  )
}
