import React, { useState, useRef } from 'react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditProfileModal = ({ onClose, user }) => {
  const { login } = useAuth();
  
  // Country to phone code mapping with max digits
  const countryPhoneCodes = {
    'Sri Lanka': { code: '+94', maxDigits: 9 },
    'India': { code: '+91', maxDigits: 10 },
    'United States': { code: '+1', maxDigits: 10 },
    'United Kingdom': { code: '+44', maxDigits: 10 },
    'Canada': { code: '+1', maxDigits: 10 },
    'Australia': { code: '+61', maxDigits: 9 },
    'Germany': { code: '+49', maxDigits: 11 },
    'France': { code: '+33', maxDigits: 9 },
    'Japan': { code: '+81', maxDigits: 10 },
    'China': { code: '+86', maxDigits: 11 },
    'Singapore': { code: '+65', maxDigits: 8 },
    'Malaysia': { code: '+60', maxDigits: 9 },
    'Thailand': { code: '+66', maxDigits: 9 },
    'Vietnam': { code: '+84', maxDigits: 9 },
    'Indonesia': { code: '+62', maxDigits: 9 },
    'Philippines': { code: '+63', maxDigits: 9 },
    'South Africa': { code: '+27', maxDigits: 9 },
    'Kenya': { code: '+254', maxDigits: 9 },
    'Tanzania': { code: '+255', maxDigits: 9 },
    'Other': { code: '+', maxDigits: 15 }
  };
  
  // Extract phone number without country code for display
  const extractPhoneNumber = (fullPhone, country) => {
    if (!fullPhone || !country || country === 'Other') return fullPhone || '';
    
    const phoneData = countryPhoneCodes[country];
    if (!phoneData) return fullPhone || '';
    
    const countryCode = phoneData.code;
    if (fullPhone.startsWith(countryCode)) {
      return fullPhone.substring(countryCode.length);
    }
    return fullPhone;
  };

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: extractPhoneNumber(user?.phone, user?.country),
    country: user?.country || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);

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

  const getPasswordStrengthColor = () => {
    if (!formData.newPassword) return 'text-gray-400';
    const validation = validatePassword(formData.newPassword);
    if (validation.isValid) return 'text-green-400';
    if (formData.newPassword.length >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploadingPicture(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      console.log('FormData created, uploading...');
      console.log('Auth token:', localStorage.getItem('auth_token'));

      const { user: updatedUser } = await authApi.uploadProfilePicture(formData);
      
      console.log('Upload successful:', updatedUser);
      
      // Update the auth context with new user data
      login(updatedUser, localStorage.getItem('auth_token'));
      
      // Clear the file input
      e.target.value = '';
    } catch (err) {
      console.error('Upload error:', err);
      console.error('Error response:', err.response);
      const msg = err?.response?.data?.message || 'Upload failed';
      alert(msg);
    } finally {
      setIsUploadingPicture(false);
    }
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
      const phoneData = countryPhoneCodes[formData.country];
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d+$/.test(formData.phone.trim())) {
        newErrors.phone = 'Phone number should contain only numbers';
      } else if (formData.phone.trim().length !== phoneData.maxDigits) {
        newErrors.phone = `Phone number should be ${phoneData.maxDigits} digits`;
      }
    }

    // Password validation (only if new password is provided)
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.errors;
      }
      
      if (!formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Please confirm your new password';
      } else if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle phone number input - only allow numbers
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-digits
      const phoneData = formData.country && countryPhoneCodes[formData.country];
      
      // Limit to max digits for the selected country
      if (phoneData && numericValue.length > phoneData.maxDigits) {
        return; // Don't update if exceeding max digits
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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
      // Combine country code with phone number
      const fullPhoneNumber = formData.country && formData.country !== 'Other' 
        ? countryPhoneCodes[formData.country].code + formData.phone.trim()
        : formData.phone.trim();
        
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: fullPhoneNumber,
        country: formData.country,
      };

      // Add password fields if new password is provided
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
        
      const { user: updatedUser } = await authApi.updateProfile(payload);
      
      // Update the auth context with new user data
      login(updatedUser, localStorage.getItem('auth_token'));
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Update failed';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg border border-white/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-abeze font-bold text-white mb-2">
            Edit Profile
          </h2>
          <p className="text-gray-300 font-abeze">
            Update your account information
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

                 {/* Edit Profile Form */}
         <form onSubmit={handleSubmit} className="space-y-6">
           {/* Profile Picture Section */}
           <div className="text-center mb-6">
             <div 
               className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer relative overflow-hidden border-2 border-white/20 hover:border-green-400 transition-colors"
               onClick={handleProfilePictureClick}
             >
               {user?.profilePicture?.url ? (
                 <img 
                   src={user.profilePicture.url} 
                   alt="Profile" 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="w-full h-full bg-green-500 flex items-center justify-center">
                   <span className="text-xl font-abeze font-bold text-white">
                     {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                   </span>
                 </div>
               )}
               
               {/* Upload overlay */}
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <div className="text-center">
                   {isUploadingPicture ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                   ) : (
                     <svg className="w-5 h-5 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                   )}
                   <p className="text-xs text-white mt-1 font-abeze">Change Photo</p>
                 </div>
               </div>
             </div>
             
             {/* Hidden file input */}
             <input
               ref={fileInputRef}
               type="file"
               accept="image/*"
               onChange={handleFileChange}
               className="hidden"
             />
             
             <p className="text-sm text-gray-300 font-abeze">
               Click to upload profile picture
             </p>
           </div>

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

          {/* Phone Number */}
          {formData.country && (
            <div>
              <label className="block text-white font-abeze font-medium mb-2">
                Phone Number {formData.country !== 'Other' ? '*' : ''}
              </label>
              <div className="flex">
                {/* Country Code Display */}
                {formData.country !== 'Other' && (
                  <div className="bg-white/20 border border-white/20 rounded-l-lg px-4 py-3 text-white font-abeze font-medium min-w-[80px] flex items-center justify-center">
                    {countryPhoneCodes[formData.country].code}
                  </div>
                )}
                {/* Phone Number Input */}
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={formData.country !== 'Other' ? countryPhoneCodes[formData.country].maxDigits : 15}
                  className={`flex-1 bg-white/10 border border-white/20 rounded-r-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                    formData.country === 'Other' ? 'rounded-lg' : ''
                  } ${
                    errors.phone ? 'border-red-400' : 'focus:border-green-400'
                  }`}
                  placeholder={formData.country !== 'Other' 
                    ? `e.g., 77 123 456 (${countryPhoneCodes[formData.country].maxDigits} digits)` 
                    : "Enter your phone number"
                  }
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1 font-abeze">{errors.phone}</p>
              )}
              {formData.country !== 'Other' && formData.phone && (
                <p className="text-gray-400 text-sm mt-1 font-abeze">
                  {formData.phone.length}/{countryPhoneCodes[formData.country].maxDigits} digits
                </p>
              )}
            </div>
                     )}

           {/* Password Change Section */}
           <div className="border-t border-white/20 pt-6">
             <h3 className="text-xl font-abeze font-bold text-white mb-4">
               Change Password (Optional)
             </h3>
             
             {/* Current Password */}
             <div className="mb-4">
               <label className="block text-white font-abeze font-medium mb-2">
                 Current Password
               </label>
               <div className="relative">
                 <input
                   type={showCurrentPassword ? 'text' : 'password'}
                   name="currentPassword"
                   value={formData.currentPassword}
                   onChange={handleInputChange}
                   className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors pr-12 ${
                     errors.currentPassword ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                   }`}
                   placeholder="Enter current password"
                 />
                 <button
                   type="button"
                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                 >
                   {showCurrentPassword ? (
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
               {errors.currentPassword && (
                 <p className="text-red-400 text-sm mt-1 font-abeze">{errors.currentPassword}</p>
               )}
             </div>

             {/* New Password */}
             <div className="mb-4">
               <label className="block text-white font-abeze font-medium mb-2">
                 New Password
               </label>
               <div className="relative">
                 <input
                   type={showNewPassword ? 'text' : 'password'}
                   name="newPassword"
                   value={formData.newPassword}
                   onChange={handleInputChange}
                   className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors pr-12 ${
                     errors.newPassword ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                   }`}
                   placeholder="Enter new password"
                 />
                 <button
                   type="button"
                   onClick={() => setShowNewPassword(!showNewPassword)}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                 >
                   {showNewPassword ? (
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
               {errors.newPassword && (
                 <div className="mt-1">
                   {Array.isArray(errors.newPassword) ? (
                     <ul className="text-red-400 text-sm font-abeze">
                       {errors.newPassword.map((error, index) => (
                         <li key={index}>• {error}</li>
                       ))}
                     </ul>
                   ) : (
                     <p className="text-red-400 text-sm font-abeze">{errors.newPassword}</p>
                   )}
                 </div>
               )}
               {formData.newPassword && !errors.newPassword && (
                 <p className={`text-sm mt-1 font-abeze ${getPasswordStrengthColor()}`}>
                   ✓ Strong password
                 </p>
               )}
             </div>

             {/* Confirm New Password */}
             <div className="mb-4">
               <label className="block text-white font-abeze font-medium mb-2">
                 Confirm New Password
               </label>
               <div className="relative">
                 <input
                   type={showConfirmPassword ? 'text' : 'password'}
                   name="confirmNewPassword"
                   value={formData.confirmNewPassword}
                   onChange={handleInputChange}
                   className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors pr-12 ${
                     errors.confirmNewPassword ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                   }`}
                   placeholder="Confirm new password"
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
               {errors.confirmNewPassword && (
                 <p className="text-red-400 text-sm mt-1 font-abeze">{errors.confirmNewPassword}</p>
               )}
             </div>
           </div>

           {/* Submit Button */}
           <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-abeze font-bold transition-colors duration-300"
          >
            {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
