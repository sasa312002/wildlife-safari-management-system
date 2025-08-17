import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { packageApi, bookingApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BookingPage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginTriggerRef = useRef(null);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    specialRequests: '',
    emergencyContact: '',
    dietaryRestrictions: '',
    accommodationPreference: 'Standard',
    transportationPreference: 'Included'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPackageData();
  }, [packageId]);

  const loadPackageData = async () => {
    try {
      const data = await packageApi.getPackageById(packageId);
      setPackageData(data);
    } catch (error) {
      console.error('Error loading package:', error);
      alert('Failed to load package details');
      navigate('/travel-packages');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
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

    // Auto-calculate end date when start date is selected
    if (name === 'startDate' && value && packageData) {
      const endDate = calculateEndDate(value, packageData.duration);
      setBookingData(prev => ({
        ...prev,
        endDate: endDate
      }));
    }
  };

  const calculateEndDate = (startDate, duration) => {
    const start = new Date(startDate);
    let daysToAdd = 0;
    
    // Parse duration string to extract number of days
    if (duration.includes('1 Night') || duration.includes('1 Day')) {
      daysToAdd = 1;
    } else if (duration.includes('2 Days') || duration.includes('2 Nights')) {
      daysToAdd = 2;
    } else if (duration.includes('3 Days') || duration.includes('3 Nights')) {
      daysToAdd = 3;
    } else if (duration.includes('4 Days') || duration.includes('4 Nights')) {
      daysToAdd = 4;
    } else if (duration.includes('5 Days') || duration.includes('5 Nights')) {
      daysToAdd = 5;
    } else if (duration.includes('6 Days') || duration.includes('6 Nights')) {
      daysToAdd = 6;
    } else if (duration.includes('7 Days') || duration.includes('7 Nights')) {
      daysToAdd = 7;
    } else {
      // Default to 1 day if duration can't be parsed
      daysToAdd = 1;
    }
    
    const end = new Date(start);
    end.setDate(start.getDate() + daysToAdd);
    
    return end.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!bookingData.startDate) newErrors.startDate = 'Start date is required';
    if (!bookingData.endDate) newErrors.endDate = 'End date is required';
    if (!bookingData.emergencyContact) newErrors.emergencyContact = 'Emergency contact is required';
    
    if (bookingData.startDate && bookingData.endDate) {
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (bookingData.numberOfPeople < 1) {
      newErrors.numberOfPeople = 'Number of people must be at least 1';
    }

    if (packageData && bookingData.numberOfPeople > packageData.maxGroupSize) {
      newErrors.numberOfPeople = `Maximum group size is ${packageData.maxGroupSize} people`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalPrice = () => {
    if (!packageData) return 0;
    
    let basePrice = packageData.price * bookingData.numberOfPeople;
    let extraCosts = 0;
    
    // Add accommodation preference costs
    switch (bookingData.accommodationPreference) {
      case 'Luxury':
        extraCosts += 5000 * bookingData.numberOfPeople;
        break;
      case 'Tented Camp':
        extraCosts += 2000 * bookingData.numberOfPeople;
        break;
      case 'Eco Lodge':
        extraCosts += 3000 * bookingData.numberOfPeople;
        break;
      default:
        break;
    }
    
    // Add transportation preference costs
    switch (bookingData.transportationPreference) {
      case 'Private Vehicle':
        extraCosts += 3000 * bookingData.numberOfPeople;
        break;
      case 'Shared Vehicle':
        extraCosts += 1000 * bookingData.numberOfPeople;
        break;
      default:
        break;
    }
    
    return basePrice + extraCosts;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingPayload = {
        packageId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        numberOfPeople: bookingData.numberOfPeople,
        specialRequests: bookingData.specialRequests,
        emergencyContact: bookingData.emergencyContact,
        dietaryRestrictions: bookingData.dietaryRestrictions,
        accommodationPreference: bookingData.accommodationPreference,
        transportationPreference: bookingData.transportationPreference
      };

      const response = await bookingApi.createStripeCheckout(bookingPayload);
      
      if (response.success) {
        // Redirect to Stripe checkout
        window.location.href = response.session_url;
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-white font-abeze text-lg">Loading package details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Header triggerLogin={loginTriggerRef} />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-white font-abeze text-lg">Package not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header triggerLogin={loginTriggerRef} />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-4">
              Book Your <span className="text-green-400">Safari</span>
            </h1>
            <p className="text-gray-300 font-abeze text-lg">
              Complete your booking for {packageData.title}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Package Summary */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-abeze font-bold text-white mb-6">Package Summary</h2>
                
                <div className="space-y-4">
                  {/* Package Image */}
                  <div className="relative h-48 bg-gradient-to-br from-green-600/20 to-green-400/20 rounded-lg overflow-hidden">
                    {packageData.image?.url ? (
                      <img 
                        src={packageData.image.url} 
                        alt={packageData.title} 
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
                        {packageData.duration}
                      </span>
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-abeze font-bold text-white">{packageData.title}</h3>
                    <p className="text-gray-300 font-abeze text-sm">{packageData.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400 font-abeze">Category:</span>
                        <span className="text-white font-abeze ml-2">{packageData.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-abeze">Location:</span>
                        <span className="text-white font-abeze ml-2">{packageData.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-abeze">Max Group:</span>
                        <span className="text-white font-abeze ml-2">{packageData.maxGroupSize} people</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-abeze">Price:</span>
                        <span className="text-green-400 font-abeze font-bold ml-2">LKR {packageData.price?.toLocaleString()}/person</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    {packageData.highlights && packageData.highlights.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-green-400 font-abeze font-medium text-sm mb-2">Highlights:</h4>
                        <div className="space-y-1">
                          {packageData.highlights.slice(0, 3).map((highlight, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                              </svg>
                              <span className="text-gray-300 font-abeze text-xs">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-abeze font-bold text-white mb-6">Booking Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Travel Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-abeze font-medium mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={bookingData.startDate}
                        onChange={handleInputChange}
                        className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                          errors.startDate ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                        }`}
                      />
                      {errors.startDate && (
                        <p className="text-red-400 text-sm mt-1 font-abeze">{errors.startDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-abeze font-medium mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={bookingData.endDate}
                        onChange={handleInputChange}
                        className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                          errors.endDate ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                        }`}
                      />
                      {errors.endDate && (
                        <p className="text-red-400 text-sm mt-1 font-abeze">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Number of People */}
                  <div>
                    <label className="block text-white font-abeze font-medium mb-2">
                      Number of People *
                    </label>
                    <input
                      type="number"
                      name="numberOfPeople"
                      value={bookingData.numberOfPeople}
                      onChange={handleInputChange}
                      min="1"
                      max={packageData.maxGroupSize}
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                        errors.numberOfPeople ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                      }`}
                    />
                    {errors.numberOfPeople && (
                      <p className="text-red-400 text-sm mt-1 font-abeze">{errors.numberOfPeople}</p>
                    )}
                  </div>

                                     {/* Emergency Contact */}
                   <div>
                     <label className="block text-white font-abeze font-medium mb-2">
                       Emergency Contact *
                     </label>
                     <input
                       type="tel"
                       name="emergencyContact"
                       value={bookingData.emergencyContact}
                       onChange={handleInputChange}
                       className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                         errors.emergencyContact ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                       }`}
                       placeholder="+94 71 123 4567"
                     />
                     {errors.emergencyContact && (
                       <p className="text-red-400 text-sm mt-1 font-abeze">{errors.emergencyContact}</p>
                     )}
                   </div>

                                     {/* Preferences */}
                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-white font-abeze font-medium mb-2">
                         Accommodation Preference
                       </label>
                       <select
                         name="accommodationPreference"
                         value={bookingData.accommodationPreference}
                         onChange={handleInputChange}
                         className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze focus:outline-none focus:border-green-400 transition-colors"
                       >
                         <option value="Standard">Standard</option>
                         <option value="Luxury">Luxury (+LKR 5,000/person)</option>
                         <option value="Tented Camp">Tented Camp (+LKR 2,000/person)</option>
                         <option value="Eco Lodge">Eco Lodge (+LKR 3,000/person)</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-white font-abeze font-medium mb-2">
                         Transportation Preference
                       </label>
                       <select
                         name="transportationPreference"
                         value={bookingData.transportationPreference}
                         onChange={handleInputChange}
                         className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze focus:outline-none focus:border-green-400 transition-colors"
                       >
                         <option value="Included">Included</option>
                         <option value="Private Vehicle">Private Vehicle (+LKR 3,000/person)</option>
                         <option value="Shared Vehicle">Shared Vehicle (+LKR 1,000/person)</option>
                       </select>
                     </div>
                   </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-white font-abeze font-medium mb-2">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>

                  {/* Dietary Restrictions */}
                  <div>
                    <label className="block text-white font-abeze font-medium mb-2">
                      Dietary Restrictions
                    </label>
                    <textarea
                      name="dietaryRestrictions"
                      value={bookingData.dietaryRestrictions}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                      placeholder="Vegetarian, Vegan, Gluten-free, etc."
                    />
                  </div>

                                     {/* Total Price */}
                   <div className="bg-green-600/20 rounded-lg p-4 border border-green-400/30">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-white font-abeze font-medium">Total Price:</span>
                       <span className="text-2xl font-abeze font-bold text-green-400">
                         LKR {calculateTotalPrice().toLocaleString()}
                       </span>
                     </div>
                     <div className="space-y-1 text-sm">
                       <div className="flex justify-between">
                         <span className="text-gray-300 font-abeze">Base Price:</span>
                         <span className="text-gray-300 font-abeze">LKR {(packageData.price * bookingData.numberOfPeople).toLocaleString()}</span>
                       </div>
                       {bookingData.accommodationPreference !== 'Standard' && (
                         <div className="flex justify-between">
                           <span className="text-gray-300 font-abeze">Accommodation Upgrade:</span>
                           <span className="text-green-400 font-abeze">
                             +LKR {(() => {
                               switch (bookingData.accommodationPreference) {
                                 case 'Luxury': return (5000 * bookingData.numberOfPeople).toLocaleString();
                                 case 'Tented Camp': return (2000 * bookingData.numberOfPeople).toLocaleString();
                                 case 'Eco Lodge': return (3000 * bookingData.numberOfPeople).toLocaleString();
                                 default: return '0';
                               }
                             })()}
                           </span>
                         </div>
                       )}
                       {bookingData.transportationPreference !== 'Included' && (
                         <div className="flex justify-between">
                           <span className="text-gray-300 font-abeze">Transportation Upgrade:</span>
                           <span className="text-green-400 font-abeze">
                             +LKR {(() => {
                               switch (bookingData.transportationPreference) {
                                 case 'Private Vehicle': return (3000 * bookingData.numberOfPeople).toLocaleString();
                                 case 'Shared Vehicle': return (1000 * bookingData.numberOfPeople).toLocaleString();
                                 default: return '0';
                               }
                             })()}
                           </span>
                         </div>
                       )}
                     </div>
                   </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-4 rounded-lg font-abeze font-bold transition-colors duration-300"
                  >
                    {isSubmitting ? 'Processing Booking...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
