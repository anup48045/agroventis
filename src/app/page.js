'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import PlatformSection from '@/components/landing/PlatformSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import StatsSection from '@/components/landing/StatsSection'
import CTASection from '@/components/landing/CTASection'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Background with crop pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
        
      </div>

      {/* Navbar */}
      <Navbar isScrolled={isScrolled} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        {/* <StatsSection /> */}

        {/* Features Section */}
        {/* <FeaturesSection /> */}

        {/* Platform Section */}
        <PlatformSection />

        {/* Testimonials Section */}
        {/* <TestimonialsSection /> */}

        {/* CTA Section */}
        {/* <CTASection /> */}
      </main>

      {/* Footer */}
      <Footer />

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
