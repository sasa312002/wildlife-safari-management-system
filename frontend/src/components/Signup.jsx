import React, { useState } from 'react';

const Signup = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    agreeToTerms: false,
    newsletter: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions!');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsSubmitting(false);
      // Here you would typically handle the actual signup logic
      console.log('Signup attempt:', formData);
      onClose(); // Close modal after successful signup
    }, 2000);
  };

  const countries = [
    'Sri Lanka', 'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'China', 'Singapore', 'Malaysia', 'Thailand',
    'Vietnam', 'Indonesia', 'Philippines', 'South Africa', 'Kenya', 'Tanzania',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg border border-white/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-abeze font-bold text-white mb-2">
            Join Mufasa Wildlife
          </h2>
          <p className="text-gray-300 font-abeze">
            Create your account to start your wildlife adventure
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-abeze font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-white font-abeze font-medium mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
                placeholder="Your last name"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-abeze font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-white font-abeze font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
                placeholder="+94 77 123 4567"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-white font-abeze font-medium mb-2">
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-800 text-white">Select your country</option>
              {countries.map((country, index) => (
                <option key={index} value={country} className="bg-gray-800 text-white">{country}</option>
              ))}
            </select>
          </div>

          {/* Password Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-abeze font-medium mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-white font-abeze font-medium mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                className="w-4 h-4 text-green-600 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2 mt-1"
              />
              <span className="ml-2 text-gray-300 font-abeze text-sm">
                I agree to the{' '}
                <button type="button" className="text-green-400 hover:text-green-300">
                  Terms and Conditions
                </button>
                {' '}and{' '}
                <button type="button" className="text-green-400 hover:text-green-300">
                  Privacy Policy
                </button>
              </span>
            </label>
            <label className="flex items-start">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2 mt-1"
              />
              <span className="ml-2 text-gray-300 font-abeze text-sm">
                Subscribe to our newsletter for wildlife updates and special offers
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-abeze font-bold transition-colors duration-300"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>



          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-300 font-abeze">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-green-400 hover:text-green-300 font-abeze font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 