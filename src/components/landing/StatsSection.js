export default function StatsSection() {
  const stats = [
    { number: '50K+', label: 'Active Farmers', description: 'Across 28 states' },
    { number: '10K+', label: 'Verified Buyers', description: 'From various industries' },
    { number: '1M+', label: 'Transactions', description: 'Worth ₹500+ crores' },
    { number: '12+', label: 'Languages', description: 'Local language support' },
    { number: '500+', label: 'Crop Categories', description: 'All major crops' },
    { number: '95%', label: 'Satisfaction', description: 'User satisfaction rate' }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands Across India
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the growing community of farmers and buyers who are transforming agriculture in India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {stat.label}
              </div>
              <div className="text-gray-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Award Winning Platform
              </h3>
              <p className="text-gray-600">
                Recognized by Government of India for innovation in agriculture
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Bank-level security and 99.9% uptime guarantee
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sustainable Agriculture
              </h3>
              <p className="text-gray-600">
                Promoting organic and sustainable farming practices
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
