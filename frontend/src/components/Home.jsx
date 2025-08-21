import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import BackgroundSlideshow from './BackgroundSlideshow';

const Home = () => {
  const { t } = useLanguage();
  
  return (
    <BackgroundSlideshow>
      <section id="home" className="min-h-screen flex items-center pt-20">
        {/* Content */}
        <div className="w-full px-4">
          {/* Main Headline - Centered and Full Width */}
          <div className="text-center mb-12 pt-16 w-full">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-abeze font-black leading-none text-white whitespace-nowrap">
              <span className="text-green-400">{t('home.discover')}</span>{' '}
              <span className="text-white">{t('home.sriLanka')}</span>
            </h1>
            
            {/* Subtext */}
            <div className="mt-8 space-y-4">
              <p className="text-green-400 font-abeze-italic font-semibold text-xl md:text-2xl">
                {t('home.slogan')}
              </p>
              <p className="text-gray-300 text-lg font-abeze font-semibold leading-relaxed max-w-3xl mx-auto">
                {t('home.description')}
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left Side - Text Content */}
            <div className="text-white space-y-6">
              {/* Call to Action Button */}
              <div className="pt-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-abeze font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  {t('home.exploreSafaris')}
                </button>
              </div>
            </div>

            {/* Right Side - Empty space for balance */}
            <div className="hidden md:block">
              {/* Empty space to maintain layout balance */}
            </div>
          </div>
        </div>
      </section>
    </BackgroundSlideshow>
  );
};

export default Home;