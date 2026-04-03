export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ramesh Kumar',
      role: 'Wheat Farmer',
      location: 'Punjab',
      avatar: '👨‍🌾',
      content: 'AgroVentis changed my life completely. I can now directly connect with buyers and get 30% better prices for my wheat. No more middlemen!',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Agri-Business Owner',
      location: 'Maharashtra',
      avatar: '👩‍💼',
      content: 'Finding quality farmers was always a challenge. With AgroVentis, I can source directly from verified farmers and get consistent quality.',
      rating: 5
    },
    {
      name: 'Srinivas Reddy',
      role: 'Rice Farmer',
      location: 'Andhra Pradesh',
      avatar: '👨‍🌾',
      content: 'The mobile app is so easy to use! Even in my village with poor internet, I can manage my listings and communicate with buyers.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Food Processing Manager',
      location: 'Gujarat',
      avatar: '👩‍💼',
      content: 'We source all our raw materials through AgroVentis now. The quality is consistent and the prices are transparent.',
      rating: 5
    },
    {
      name: 'Rajesh Singh',
      role: 'Organic Farmer',
      location: 'Uttarakhand',
      avatar: '👨‍🌾',
      content: 'The platform helped me reach buyers who appreciate organic farming. My income has doubled in the last year!',
      rating: 5
    },
    {
      name: 'Meera Krishnan',
      role: 'Restaurant Owner',
      location: 'Tamil Nadu',
      avatar: '👩‍💼',
      content: 'Fresh produce directly from farmers - that\'s what I always wanted. AgroVentis made it possible for my restaurants.',
      rating: 5
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ))
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from farmers and buyers who are transforming their agricultural business with AgroVentis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="text-3xl mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-500">
                    📍 {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Thousands of Happy Users
            </h3>
            <p className="text-gray-600 mb-6">
              Start your journey with AgroVentis today and experience the difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold">
                Start as Farmer
              </button>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
                Start as Buyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
