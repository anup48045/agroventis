export default function FeaturesSection() {
  const features = [
    {
      icon: '📱',
      title: 'Mobile First Design',
      description: 'Optimized for smartphones and works seamlessly even in low connectivity areas',
      benefits: ['Offline capability', 'Low data usage', 'Simple interface']
    },
    {
      icon: '🗣️',
      title: 'Multi-Language Support',
      description: 'Available in 12+ Indian languages to serve rural communities effectively',
      benefits: ['12+ languages', 'Voice input support', 'Localized content']
    },
    {
      icon: '🤝',
      title: 'Direct Connection',
      description: 'Connect directly with buyers/sellers without any middlemen or commissions',
      benefits: ['No middlemen', 'Better prices', 'Direct communication']
    },
    {
      icon: '💰',
      title: 'Fair Pricing',
      description: 'Transparent pricing mechanism that ensures fair value for both farmers and buyers',
      benefits: ['Market rates', 'Price discovery', 'Quality-based pricing']
    },
    {
      icon: '🔐',
      title: 'Secure Transactions',
      description: 'Safe and secure payment processing with multiple payment options',
      benefits: ['Secure payments', 'Digital receipts', 'Payment tracking']
    },
    {
      icon: '📊',
      title: 'Market Insights',
      description: 'Real-time market data and trends to help make informed decisions',
      benefits: ['Market trends', 'Price alerts', 'Demand forecasting']
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose AgroVentis?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of agricultural trading with our innovative features designed for Indian farmers and buyers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Features Bar */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              More Powerful Features
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="font-medium text-gray-900">Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <div className="font-medium text-gray-900">Weather Data</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚚</div>
              <div className="font-medium text-gray-900">Logistics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-medium text-gray-900">Training</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
