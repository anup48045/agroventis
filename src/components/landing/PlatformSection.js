import Link from 'next/link'

export default function PlatformSection() {
  const platforms = [
    {
      title: 'Farmer Platform',
      icon: '👨‍🌾',
      color: 'green',
      description: 'List your products, connect with buyers, and get better prices for your produce',
      features: [
        'Post your products for sale',
        'View buyer requirements',
        'Direct messaging with buyers',
        'Quality certification',
        'Price discovery tools',
        'Market insights'
      ],
      href: '/farmer',
      buttonText: 'Join as Farmer'
    },
    {
      title: 'Buyer Platform',
      icon: '🏢',
      color: 'blue',
      description: 'Find quality farmers, post your requirements, and source agricultural products directly',
      features: [
        'Post buying requirements',
        'Browse farmer listings',
        'Quality verification',
        'Negotiation tools',
        'Order tracking',
        'Secure payments'
      ],
      href: '/buyer',
      buttonText: 'Join as Buyer'
    }
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      green: {
        bg: 'bg-[linear-gradient(135deg,_#FAF3E0,_#F8E1D4)]',
        border: 'border-[#D96C2D]',
        button: 'bg-[#D96C2D] hover:bg-[#333]',
        text: 'text-[#D96C2D]',
        iconBg: 'bg-[#D96C2D]/20'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600',
        iconBg: 'bg-blue-100'
      }
    }
    return colorMap[color] || colorMap.green
  }

  return (
    <section id='platform' className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a farmer looking to sell your produce or a buyer seeking quality agricultural products, we have the right platform for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {platforms.map((platform, index) => {
            const colors = getColorClasses(platform.color)
            return (
              <div
                key={index}
                className={`${colors.bg} rounded-2xl p-8 border-2 ${colors.border} hover:shadow-xl transition-all duration-300`}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.iconBg} rounded-full mb-4`}>
                    <span className="text-3xl">{platform.icon}</span>
                  </div>
                  <h3 className={`text-2xl font-bold ${colors.text} mb-3`}>
                    {platform.title}
                  </h3>
                  <p className="text-gray-600">
                    {platform.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Key Features:</h4>
                  <ul className="space-y-3">
                    {platform.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Link
                    href={platform.href}
                    className={`inline-block ${colors.button} text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200`}
                  >
                    {platform.buttonText}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Platform Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#D96C2D]">Farmer Platform</th>
                  <th className="text-center py-3 px-4 font-semibold text-blue-600">Buyer Platform</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">Product Listings</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">Direct Messaging</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">±2 Negotiation</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">Quality Verification</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">Market Insights</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">Offline Support</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">➖</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div id='about'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6 text-center'>About Us</h1>
          <p className='text-lg'>AgroVentis is a smart digital marketplace that connects farmers, local vendors, and buyers on a single platform. It enables direct trading without middlemen, ensuring fair pricing and better opportunities for farmers. With a simple and user-friendly interface, AgroVentis allows buyers to propose prices while farmers can accept, reject, or make small adjustments, creating a transparent and efficient negotiation system.</p>
        </div>
      </div>
    </section>
  )
}
