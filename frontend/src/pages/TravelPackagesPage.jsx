import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TravelPackagesPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Safari', 'Conservation', 'Photography', 'Birding', 'Adventure'];

  const packages = [
    {
      name: "Yala National Park Safari",
      category: "Safari",
      duration: "2-3 Days",
      price: "45,000",
      rating: 4.8,
      reviews: 127,
      description: "Experience Sri Lanka's most famous wildlife sanctuary, home to leopards, elephants, and diverse bird species.",
      highlights: ["Leopard sightings", "Elephant herds", "Bird watching"],
      icon: "🐆"
    },
    {
      name: "Minneriya Elephant Gathering",
      category: "Conservation",
      duration: "1 Day",
      price: "25,000",
      rating: 4.9,
      reviews: 89,
      description: "Witness the spectacular gathering of wild elephants at Minneriya National Park during the dry season.",
      highlights: ["Elephant gathering", "Expert guide", "Safari jeep"],
      icon: "🐘"
    },
    {
      name: "Sinharaja Rainforest Trek",
      category: "Adventure",
      duration: "4-7 Days",
      price: "65,000",
      rating: 4.7,
      reviews: 156,
      description: "Explore the UNESCO World Heritage rainforest with endemic birds, butterflies, and rare wildlife.",
      highlights: ["Rainforest trek", "Bird watching", "Eco-lodge"],
      icon: "🌿"
    },
    {
      name: "Wilpattu Leopard Safari",
      category: "Safari",
      duration: "2-3 Days",
      price: "55,000",
      rating: 4.6,
      reviews: 94,
      description: "Track leopards in Sri Lanka's largest national park with pristine wilderness and ancient ruins.",
      highlights: ["Leopard tracking", "Wilderness camping", "Archaeological sites"],
      icon: "🐆"
    },
    {
      name: "Professional Wildlife Photography",
      category: "Photography",
      duration: "4-7 Days",
      price: "85,000",
      rating: 4.9,
      reviews: 67,
      description: "Capture stunning wildlife moments with professional photography guidance and exclusive access.",
      highlights: ["Professional guidance", "Exclusive access", "Equipment provided"],
      icon: "📸"
    },
    {
      name: "Bundala Bird Sanctuary",
      category: "Birding",
      duration: "1-2 Days",
      price: "35,000",
      rating: 4.5,
      reviews: 112,
      description: "Discover over 200 bird species in this coastal wetland sanctuary, a paradise for bird enthusiasts.",
      highlights: ["200+ bird species", "Coastal wetlands", "Expert ornithologist"],
      icon: "🦅"
    },
    {
      name: "Udawalawe Elephant Safari",
      category: "Safari",
      duration: "1 Day",
      price: "30,000",
      rating: 4.7,
      reviews: 203,
      description: "Observe wild elephants in their natural habitat at Udawalawe National Park, known for elephant sightings.",
      highlights: ["Elephant sightings", "Natural habitat", "Conservation focus"],
      icon: "🐘"
    },
    {
      name: "Conservation Volunteer Program",
      category: "Conservation",
      duration: "1-2 Weeks",
      price: "75,000",
      rating: 4.8,
      reviews: 45,
      description: "Join our conservation efforts and contribute to wildlife protection while learning about local ecosystems.",
      highlights: ["Hands-on conservation", "Educational experience", "Community involvement"],
      icon: "🌱"
    },
    {
      name: "Adventure Wildlife Camping",
      category: "Adventure",
      duration: "3-5 Days",
      price: "50,000",
      rating: 4.4,
      reviews: 78,
      description: "Experience wildlife up close with our adventure camping program in remote wilderness areas.",
      highlights: ["Wilderness camping", "Close encounters", "Survival skills"],
      icon: "⛺"
    }
  ];

  const filteredPackages = activeFilter === 'All' 
    ? packages 
    : packages.filter(pkg => pkg.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-abeze font-bold text-white mb-4">
              Safari <span className="text-green-400">Packages</span>
            </h1>
            <p className="text-gray-300 text-lg font-abeze max-w-3xl mx-auto">
              Discover the perfect wildlife adventure with our carefully curated safari packages across Sri Lanka's most pristine national parks.
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-abeze font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPackages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="relative h-64 bg-gradient-to-br from-green-600/20 to-green-400/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl">{pkg.icon}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-abeze font-bold">
                      {pkg.duration}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-abeze">
                      {pkg.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-abeze font-bold text-white mb-3">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-300 font-abeze text-sm mb-4 leading-relaxed">
                    {pkg.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-gray-300 font-abeze text-sm">{pkg.highlights[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-gray-300 font-abeze text-sm">{pkg.highlights[1]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-gray-300 font-abeze text-sm">{pkg.highlights[2]}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-abeze font-bold text-green-400">LKR {pkg.price}</span>
                      <span className="text-gray-400 font-abeze text-sm">/person</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300 font-abeze text-sm">{pkg.rating}</span>
                      <span className="text-gray-400 font-abeze text-sm">({pkg.reviews})</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-abeze font-bold transition-colors duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
              <h3 className="text-2xl font-abeze font-bold text-white mb-4">
                Can't Find the Perfect Package?
              </h3>
              <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
                Let us create a custom safari experience tailored to your preferences. Our expert team will design the perfect wildlife adventure just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300">
                  Custom Safari
                </button>
                <button className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 rounded-full font-abeze font-bold transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TravelPackagesPage; 