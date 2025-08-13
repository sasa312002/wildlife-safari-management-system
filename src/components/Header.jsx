import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-white">
              <h1 className="text-2xl font-abeze font-bold">Mufasa</h1>
              <p className="text-sm font-abeze font-light tracking-wider">WILDLIFE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-green-400 font-abeze font-medium hover:text-green-300 transition-colors">
              HOME
            </a>
            <a href="#awareness" className="text-white font-abeze font-medium hover:text-green-400 transition-colors">
              AWARENESS
            </a>
            <a href="#safaris" className="text-white font-abeze font-medium hover:text-green-400 transition-colors">
              SAFARIS
            </a>
            
            <a href="#about" className="text-white font-abeze font-medium hover:text-green-400 transition-colors">
              ABOUT US
            </a>
            <a href="#contact" className="text-white font-abeze font-medium hover:text-green-400 transition-colors">
              CONTACT
            </a>
          </nav>

          {/* Login Button */}
          <div className="flex items-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-abeze font-medium transition-colors duration-300">
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 