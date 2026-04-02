'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  // const languages = [
  //   { code: 'en', name: 'English', flag: '🇬🇧' },
  //   { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  //   { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  //   { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  //   { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  //   { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  //   { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  //   { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  //   { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  //   { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  //   { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  //   { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' }
  // ]

  // const handleLanguageChange = (languageCode) => {
  //   setSelectedLanguage(languageCode)
  //   localStorage.setItem('preferredLanguage', languageCode)
  //   // In a real app, this would trigger a language change
  // }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Hero Content */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-6">
            <span className="text-3xl">🌾</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            <span className="text-green-600">AgroVentis</span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-gray-700 font-normal">
              Connect Farmers Directly with Buyers
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering rural India through technology. Eliminate middlemen, get better prices, and grow your agricultural business with our platform.
          </p>

          {/* Language Selection
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3">Choose your language / अपनी भाषा चुनें / আপনার ভাষা নির্বাচন করুন</p>
            <div className="flex flex-wrap justify-center gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  <span className="mr-1">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          </div> */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/farmer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">👨‍🌾</span>
              Farmer Platform
            </Link>
            <Link
              href="/buyer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors duration-200"
            >
              <span className="mr-2">🏢</span>
              Buyer Platform
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
            <div className="text-gray-600">Verified Buyers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
            <div className="text-gray-600">Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">12+</div>
            <div className="text-gray-600">Languages</div>
          </div>
        </div>

        {/* Mobile App Download */}
        {/* <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get Our Mobile App
              </h3>
              <p className="text-gray-600 mb-4">
                Download our app for the best experience on the go. Available for both Android and iOS.
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200">
                  <span>📱</span>
                  <span className="text-sm">App Store</span>
                </button>
                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200">
                  <span>🤖</span>
                  <span className="text-sm">Google Play</span>
                </button>
              </div>
            </div>
            <div className="text-6xl">
              📱
            </div>
          </div>
        </div> */}
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
