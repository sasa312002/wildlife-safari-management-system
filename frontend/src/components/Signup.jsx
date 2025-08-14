import React, { useState } from 'react';
import { authApi, setAuthToken } from '../services/api';

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Country to phone code mapping
  const countryPhoneCodes = {
    'Sri Lanka': '+94',
    'India': '+91',
    'United States': '+1',
    'United Kingdom': '+44',
    'Canada': '+1',
    'Australia': '+61',
    'Germany': '+49',
    'France': '+33',
    'Japan': '+81',
    'China': '+86',
    'Singapore': '+65',
    'Malaysia': '+60',
    'Thailand': '+66',
    'Vietnam': '+84',
    'Indonesia': '+62',
    'Philippines': '+63',
    'South Africa': '+27',
    'Kenya': '+254',
    'Tanzania': '+255',
    'Other': '+'
  };

  const countries = [
    'Sri Lanka', 'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'China', 'Singapore', 'Malaysia', 'Thailand',
    'Vietnam', 'Indonesia', 'Philippines', 'South Africa', 'Kenya', 'Tanzania',
    'Other'
  ];

  // Password strength validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`At least ${minLength} characters`);
    }
    if (!hasUpperCase) {
      errors.push('At least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('At least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('At least one number');
    }
    if (!hasSpecialChar) {
      errors.push('At least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }

    // Phone validation (only if country is selected)
    if (formData.country && formData.country !== 'Other') {
      const phoneCode = countryPhoneCodes[formData.country];
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!formData.phone.startsWith(phoneCode)) {
        newErrors.phone = `Phone number should start with ${phoneCode}`;
      } else if (formData.phone.replace(phoneCode, '').replace(/\s/g, '').length < 7) {
        newErrors.phone = 'Phone number is too short';
      }
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-update phone code when country changes
    if (name === 'country' && value && value !== 'Other') {
      const phoneCode = countryPhoneCodes[value];
      setFormData(prev => ({
        ...prev,
        phone: phoneCode + ' '
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { token, user } = await authApi.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country,
        password: formData.password,
      });
      setAuthToken(token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Signup failed';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (!formData.password) return 'text-gray-400';
    const validation = validatePassword(formData.password);
    if (validation.isValid) return 'text-green-400';
    if (formData.password.length >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

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
                className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                  errors.firstName ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                }`}
                placeholder="Your first name"
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1 font-abeze">{errors.firstName}</p>
              )}
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
                className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                  errors.lastName ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                }`}
                placeholder="Your last name"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1 font-abeze">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-abeze font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                errors.email ? 'border-red-400' : 'border-white/20 focus:border-green-400'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 font-abeze">{errors.email}</p>
            )}
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
              className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze focus:outline-none transition-colors ${
                errors.country ? 'border-red-400' : 'border-white/20 focus:border-green-400'
              }`}
            >
              <option value="" className="bg-gray-800 text-white">Select your country</option>
              {countries.map((country, index) => (
                <option key={index} value={country} className="bg-gray-800 text-white">{country}</option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-400 text-sm mt-1 font-abeze">{errors.country}</p>
            )}
          </div>

          {/* Phone Number - moved after country */}
          {formData.country && (
            <div>
              <label className="block text-white font-abeze font-medium mb-2">
                Phone Number {formData.country !== 'Other' ? '*' : ''}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                  errors.phone ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                }`}
                placeholder={formData.country !== 'Other' ? `${countryPhoneCodes[formData.country]} 77 123 4567` : "Enter your phone number"}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1 font-abeze">{errors.phone}</p>
              )}
            </div>
          )}

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
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors pr-12 ${
                    errors.password ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                  }`}
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
              {errors.password && (
                <div className="mt-1">
                  {Array.isArray(errors.password) ? (
                    <ul className="text-red-400 text-sm font-abeze">
                      {errors.password.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-400 text-sm font-abeze">{errors.password}</p>
                  )}
                </div>
              )}
              {formData.password && !errors.password && (
                <p className={`text-sm mt-1 font-abeze ${getPasswordStrengthColor()}`}>
                  ✓ Strong password
                </p>
              )}
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
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors pr-12 ${
                    errors.confirmPassword ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                  }`}
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
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 font-abeze">{errors.confirmPassword}</p>
              )}
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
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm font-abeze">{errors.agreeToTerms}</p>
            )}
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