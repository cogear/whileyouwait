import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import WhatYouGet from "@/components/landing/WhatYouGet"
import Examples from "@/components/landing/Examples"
import Pricing from "@/components/landing/Pricing"
import FAQ from "@/components/landing/FAQ"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <WhatYouGet />
      <Examples />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  )
}
