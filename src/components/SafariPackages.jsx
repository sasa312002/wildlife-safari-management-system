import React from 'react';
import { useNavigate } from 'react-router-dom';

const SafariPackages = () => {
  const navigate = useNavigate();

  const packages = [
    {
      id: 1,
      title: "Yala National Park Safari",
      duration: "2 Days / 1 Night",
      price: "LKR 45,000",
      description: "Experience Sri Lanka's most famous wildlife sanctuary, home to leopards, elephants, and diverse bird species.",
      features: ["Professional guide", "Luxury tented camp", "Game drives", "Traditional meals"],
      image: "🦁",
      popular: true
    },
    {
      id: 2,
      title: "Minneriya Elephant Gathering",
      duration: "1 Day Tour",
      price: "LKR 25,000",
      description: "Witness the spectacular gathering of wild elephants at Minneriya National Park during the dry season.",
      features: ["Elephant expert guide", "Safari jeep", "Refreshments", "Photography tips"],
      image: "🐘"
    },
    {
      id: 3,
      title: "Sinharaja Rainforest Trek",
      duration: "3 Days / 2 Nights",
      price: "LKR 65,000",
      description: "Explore the UNESCO World Heritage rainforest with endemic birds, butterflies, and rare wildlife.",
      features: ["Rainforest expert", "Bird watching", "Eco-lodge stay", "Local cuisine"],
      image: "🦜"
    },
    {
      id: 4,
      title: "Wilpattu Leopard Safari",
      duration: "2 Days / 1 Night",
      price: "LKR 55,000",
      description: "Track leopards in Sri Lanka's largest national park with pristine wilderness and ancient ruins.",
      features: ["Leopard specialist", "Wilderness camping", "Archaeological sites", "Sunset safari"],
      image: "🐆"
    }
  ];

  const navigateToTravelPackages = () => {
    navigate('/travel-packages');
  };

  return (
    <section id="safaris" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-4">
            Sri Lankan <span className="text-green-400">Wildlife Tours</span>
          </h2>
          <p className="text-gray-300 text-lg font-abeze max-w-2xl mx-auto">
            Discover the incredible biodiversity of Sri Lanka through our carefully curated wildlife experiences in the island's most pristine national parks
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 ${
                pkg.popular ? 'ring-2 ring-green-400' : ''
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-abeze font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Icon */}
              <div className="text-6xl mb-4 text-center">
                {pkg.image}
              </div>

              {/* Package Title */}
              <h3 className="text-xl font-abeze font-bold text-white mb-2 text-center">
                {pkg.title}
              </h3>

              {/* Duration */}
              <p className="text-green-400 font-abeze text-sm text-center mb-3">
                {pkg.duration}
              </p>

              {/* Price */}
              <div className="text-center mb-4">
                <span className="text-3xl font-abeze font-bold text-white">
                  {pkg.price}
                </span>
                <span className="text-gray-400 font-abeze text-sm"> per person</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 font-abeze text-sm mb-6 text-center leading-relaxed">
                {pkg.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300 font-abeze text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Book Button */}
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-abeze font-medium transition-colors duration-300">
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* See More Packages Link */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
            <h3 className="text-2xl font-abeze font-bold text-white mb-4">
              Explore Our Complete Collection
            </h3>
            <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
              Discover more wildlife experiences including photography tours, bird watching, conservation volunteering, and custom adventure packages.
            </p>
            <button 
              onClick={navigateToTravelPackages}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300"
            >
              See All Packages
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-300 font-abeze mb-6">
            Looking for a unique experience? We can create a custom wildlife tour tailored to your interests.
          </p>
          <button className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 rounded-full font-abeze font-medium transition-all duration-300">
            Custom Tour Request
          </button>
        </div>
      </div>
    </section>
  );
};

export default SafariPackages; 