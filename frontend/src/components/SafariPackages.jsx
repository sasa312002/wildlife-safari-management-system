import React from 'react';
import { useNavigate } from 'react-router-dom';

const SafariPackages = () => {
  const navigate = useNavigate();

  const navigateToTravelPackages = () => {
    navigate('/travel-packages');
  };

  return (
    <section id="safaris" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">

        {/* See More Packages Link */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
            <h3 className="text-2xl font-abeze font-bold text-white mb-4">
              Explore Our Complete Collection
            </h3>
            <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
              Discover more wildlife experiences including photography tours, bird watching, hiking adventures, and custom adventure packages.
            </p>
            <button 
              onClick={navigateToTravelPackages}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300"
            >
              See All Packages
            </button>
          </div>
        </div>


      </div>
    </section>
  );
};

export default SafariPackages; 