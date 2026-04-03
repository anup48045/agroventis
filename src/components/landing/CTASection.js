import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Agricultural Business?
            </h2>
            <p className="text-xl md:text-2xl text-green-100 mb-8">
              Join thousands of farmers and buyers who are already benefiting from direct connections
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/farmer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200 shadow-lg"
              >
                <span className="mr-2">👨‍🌾</span>
                Join as Farmer
              </Link>
              <Link
                href="/buyer"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors duration-200 border-2 border-white/20"
              >
                <span className="mr-2">🏢</span>
                Join as Buyer
              </Link>
            </div>

            <p className="text-green-100 text-sm">
              No credit card required • Free to join • Cancel anytime
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-white font-semibold">Award Winning</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <div className="text-white font-semibold">100% Secure</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-white font-semibold">Instant Setup</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-white font-semibold">Verified Users</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">
              Need Help Getting Started?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">📞</div>
                <div className="text-white font-semibold">Call Us</div>
                <div className="text-green-100">1800-123-4567</div>
              </div>
              <div>
                <div className="text-3xl mb-2">💬</div>
                <div className="text-white font-semibold">Live Chat</div>
                <div className="text-green-100">Available 24/7</div>
              </div>
              <div>
                <div className="text-3xl mb-2">📧</div>
                <div className="text-white font-semibold">Email</div>
                <div className="text-green-100">support@agroventis.in</div>
              </div>
            </div>
          </div>

          {/* Download App CTA */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get Our Mobile App
                </h3>
                <p className="text-gray-600 mb-6">
                  Take AgroVentis wherever you go. Our mobile app gives you all the features of the web platform, optimized for your smartphone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-200">
                    <span>📱</span>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-200">
                    <span>🤖</span>
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-8xl mb-4">📱</div>
                <div className="flex justify-center gap-2">
                  <span className="text-2xl">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-600 text-sm">4.8 rating from 10K+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
