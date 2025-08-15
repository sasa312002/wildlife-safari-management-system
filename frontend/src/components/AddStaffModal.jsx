import React, { useState, useRef } from 'react';
import { staffApi } from '../services/api';

const AddStaffModal = ({ onClose, onStaffAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'driver',
    specialization: '',
    experience: '',
    licenseNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const roles = [
    { value: 'driver', label: 'Driver' },
    { value: 'tour_guide', label: 'Tour Guide' },
    { value: 'admin', label: 'Sub Admin' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role) newErrors.role = 'Role is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create staff first
      const newStaff = await staffApi.createStaff(formData);
      
      // Upload image if selected
      if (selectedImage) {
        setIsUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        await staffApi.uploadStaffProfilePicture(newStaff._id, imageFormData);
      }
      
      onStaffAdded();
      onClose();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to create staff member';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-abeze font-bold text-white mb-2">
            Add New Staff Member
          </h2>
          <p className="text-gray-300 font-abeze">
            Create a new staff account
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-abeze font-bold text-white mb-4">Basic Information</h3>
              
              {/* First Name */}
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
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1 font-abeze">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
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
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1 font-abeze">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-abeze font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.email ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                  }`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 font-abeze">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-abeze font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.password ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                  }`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1 font-abeze">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-abeze font-bold text-white mb-4">Additional Details</h3>
              
              {/* Phone */}
              <div>
                <label className="block text-white font-abeze font-medium mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.phone ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                  }`}
                  placeholder="+94 71 123 4567"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1 font-abeze">{errors.phone}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-white font-abeze font-medium mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze focus:outline-none transition-colors ${
                    errors.role ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                  }`}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1 font-abeze">{errors.role}</p>
                )}
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-white font-abeze font-medium mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="e.g., Wildlife Photography, Bird Watching"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-white font-abeze font-medium mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="5"
                />
              </div>

              {/* License Number */}
              <div>
                <label className="block text-white font-abeze font-medium mb-2">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="e.g., DL123456789"
                />
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-white font-abeze font-medium mb-2">
                  Profile Picture
                </label>
                <div
                  onClick={handleImageClick}
                  className="w-full h-32 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-gray-400 font-abeze text-sm">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-abeze font-medium transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-abeze font-medium transition-colors duration-300"
            >
              {isSubmitting ? (isUploadingImage ? 'Uploading Image...' : 'Creating Staff...') : 'Create Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
