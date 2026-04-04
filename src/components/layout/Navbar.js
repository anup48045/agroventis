'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar({ isScrolled }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '/features' },
    { name: 'Contact', href: '/contact' }
  ]

  const platforms = [
    { name: 'Farmer Platform', href: '/farmer', icon: '👨‍🌾' },
    { name: 'Buyer Platform', href: '/buyer', icon: '🏢' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={`fixed py-3 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-lg'
        : 'bg-white/80 backdrop-blur-sm'
      }`}>
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="AgroVentis logo" className="h-[50px] w-[50px]" />
              <span className="text-2xl font-bold text-[#D96C2D]">AgroVentis</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#D96C2D] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}

            {/* Platform Dropdown */}
            <div className="relative dropdown-container">
              {/* <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-[#D96C2D] transition-colors duration-200 font-medium"
              >
                <span>Platforms</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button> */}

              {/* {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="py-2">
                    
                    {platforms.map((platform) => (
                      <Link
                        key={platform.name}
                        href={platform.href}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="text-xl">{platform.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{platform.name}</div>
                          <div className="text-xs text-gray-500">
                            {platform.name.includes('Farmer') ? 'For farmers' : 'For buyers'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center">
            <Link
              href="#platform"
              className="text-[#444] border bg-[#D96C2D] px-4 py-2 rounded-3xl hover:bg-[#b47957] transition-colors duration-200 font-medium"
            >
              Get Started
            </Link>
          </div>
          {/* <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/farmer"
              className="text-[#D96C2D] border border-[#D96C2D] px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium"
            >
              Farmer Login
            </Link>
            <Link
              href="/buyer"
              className="bg-[#D96C2D] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Buyer Login
            </Link>
          </div> */}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-[#D96C2D] transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#D96C2D] hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Platform Links */}
              <div className="pt-4 pb-2 border-t border-gray-200">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Platforms
                </div>
                {platforms.map((platform) => (
                  <Link
                    key={platform.name}
                    href={platform.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#D96C2D] hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{platform.icon}</span>
                    <span>{platform.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile CTA Buttons */}
              <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
                <Link
                  href="/farmer"
                  className="block w-full text-center text-[#D96C2D] border border-[#D96C2D] px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Farmer Login
                </Link>
                <Link
                  href="/buyer"
                  className="block w-full text-center bg-[#D96C2D] text-white px-4 py-2 rounded-lg hover:bg-[#C75A1B] transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Buyer Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
