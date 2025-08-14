import React from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';

const Home = () => {
  return (
    <BackgroundSlideshow>
      <section id="home" className="min-h-screen flex items-center">
        {/* Content */}
        <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-white space-y-8">
            {/* Slogan */}
            <div className="space-y-2">
              <p className="text-green-400 font-abeze-italic font-semibold text-xl md:text-2xl">
                Sri Lankan wildlife diversity
              </p>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-abeze font-extrabold leading-tight">
                DISCOVER<br />
                <span className="text-green-400">SRI LANKA</span>
              </h1>
            </div>

            {/* Body Text */}
            <div className="max-w-lg">
              <p className="text-gray-300 text-lg font-abeze font-semibold leading-relaxed">
                Experience the magic of Sri Lanka's wildlife sanctuaries, from majestic elephants in national parks to exotic birds in pristine forests. Your adventure awaits in the Pearl of the Indian Ocean.
              </p>
            </div>

            {/* Call to Action Button */}
            <div className="pt-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-abeze font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                EXPLORE SAFARIS
              </button>
            </div>
          </div>

          {/* Right Side - Empty space for balance */}
          <div className="hidden md:block">
            {/* Empty space to maintain layout balance */}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
    </BackgroundSlideshow>
  );
};

export default Home; 