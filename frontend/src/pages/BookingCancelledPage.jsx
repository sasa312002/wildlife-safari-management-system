import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BookingCancelledPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Cancelled Icon */}
            <div className="bg-yellow-600/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Cancelled Message */}
            <h1 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-6">
              Payment <span className="text-yellow-400">Cancelled</span>
            </h1>
            
            <p className="text-gray-300 font-abeze text-lg mb-8">
              Your payment was cancelled. Don't worry, your booking details are safe and you can complete the payment anytime.
            </p>

            {/* What Happened */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <h2 className="text-2xl font-abeze font-bold text-white mb-4">What Happened?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-white font-abeze font-medium">Payment Cancelled</h3>
                    <p className="text-gray-300 font-abeze text-sm">You cancelled the payment process or it was interrupted</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-white font-abeze font-medium">Booking Saved</h3>
                    <p className="text-gray-300 font-abeze text-sm">Your booking details are safely stored in your account</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-white font-abeze font-medium">Complete Later</h3>
                    <p className="text-gray-300 font-abeze text-sm">You can complete the payment anytime from your account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/account')}
                className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-lg font-abeze font-bold transition-colors duration-300"
              >
                Go to My Account
              </button>
              
              <button
                onClick={() => navigate('/travel-packages')}
                className="bg-transparent hover:bg-white/10 text-white py-4 px-8 rounded-lg font-abeze font-bold border border-white/20 transition-colors duration-300"
              >
                Browse Packages
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 font-abeze text-sm mb-2">Need help with your booking?</p>
              <p className="text-green-400 font-abeze font-medium">+94 71 123 4567 | support@safari.com</p>
              <p className="text-gray-400 font-abeze text-xs mt-2">Our team is here to help you complete your safari adventure</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingCancelledPage;


