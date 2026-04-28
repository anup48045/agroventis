'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  return (
    <section className="relative bg-[linear-gradient(135deg,_#FAF3E0,_#F8E1D4)] min-h-screen flex items-center justify-center overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="mb-12">
          <div className='flex flex-row gap-20 justify-between mt-20 '>
            <div className='mt-12'>
            <h1 className='leading-tight text-[48px] text-[#333] font-bold max-w-[75%]'>Connecting Farmers & Marketeers</h1>
            <p className="text-[18px]  md:text-3xl text-gray-600 max-w-[70%] ">
            Empowering agriculture with smart, seamless, and digital solutions.
          </p>
            </div>
              <img width={400} height={400} src="/logo.png" alt="AgroVentis Logo" />
          </div>
        </div>
      </div>

      {/* Custom styles for blob animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
