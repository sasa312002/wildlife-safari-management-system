import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { packageApi } from '../services/api';

const TravelPackagesPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Safari', 'Conservation', 'Photography', 'Birding', 'Adventure'];

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const packagesData = await packageApi.getAllPackages();
      setPackages(packagesData);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-300 font-abeze">Loading packages...</div>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-300 font-abeze">No packages found for the selected category.</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative h-64 bg-gradient-to-br from-green-600/20 to-green-400/20">
                    {pkg.image?.url ? (
                      <img 
                        src={pkg.image.url} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
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
                      {pkg.title}
                    </h3>
                    <p className="text-gray-300 font-abeze text-sm mb-4 leading-relaxed">
                      {pkg.description}
                    </p>
                    
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {pkg.highlights.slice(0, 3).map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span className="text-gray-300 font-abeze text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-3xl font-abeze font-bold text-green-400">LKR {pkg.price?.toLocaleString()}</span>
                        <span className="text-gray-400 font-abeze text-sm">/person</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-300 font-abeze text-sm">{pkg.rating || 0}</span>
                        <span className="text-gray-400 font-abeze text-sm">({pkg.reviews || 0})</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-abeze font-bold transition-colors duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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