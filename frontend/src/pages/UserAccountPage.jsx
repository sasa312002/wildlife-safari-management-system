import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditProfileModal from '../components/EditProfileModal';
import UserContactMessages from '../components/UserContactMessages';
import AddReviewModal from '../components/AddReviewModal';
import { reviewApi } from '../services/api';

const UserAccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [showReviewForBookingId, setShowReviewForBookingId] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const handleViewBookings = async () => {
    if (showBookings) {
      setShowBookings(false);
      return;
    }
    
    setShowBookings(true);
    setLoadingBookings(true);
    setBookingsError(null);
    
    try {
      const response = await bookingApi.getUserBookings();
      if (response.success) {
        setBookings(response.bookings);
      } else {
        setBookingsError(response.message || 'Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingsError('Failed to load bookings. Please try again.');
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch bookings when component mounts if user has any
  useEffect(() => {
    const checkBookings = async () => {
      try {
        const response = await bookingApi.getUserBookings();
        if (response.success && response.bookings.length > 0) {
          setBookings(response.bookings);
        }
      } catch (error) {
        console.error('Error checking initial bookings:', error);
      }
    };
    
    checkBookings();
  }, []);

  // Load bookings when bookings tab is selected
  useEffect(() => {
    if (activeTab === 'bookings' && bookings.length === 0) {
      handleViewBookings();
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'bookings' && bookings.length === 0) {
      handleViewBookings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      <Header />
      
      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-4">
              My Account
            </h1>
            <p className="text-green-200 font-abeze text-lg">
              Manage your profile and bookings
            </p>
          </div>

          {/* Account Content */}
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              <button
                onClick={() => handleTabChange('profile')}
                className={`px-6 py-3 rounded-lg font-abeze font-medium transition-colors duration-300 ${
                  activeTab === 'profile'
                    ? 'bg-green-600 text-white'
                    : 'text-green-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => handleTabChange('bookings')}
                className={`px-6 py-3 rounded-lg font-abeze font-medium transition-colors duration-300 ${
                  activeTab === 'bookings'
                    ? 'bg-green-600 text-white'
                    : 'text-green-200 hover:text-white hover:bg-white/10'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => handleTabChange('messages')}
                className={`px-6 py-3 rounded-lg font-abeze font-medium transition-colors duration-300 ${
                  activeTab === 'messages'
                    ? 'bg-green-600 text-white'
                    : 'text-green-200 hover:text-white hover:bg-white/10'
                }`}
              >
                My Messages
              </button>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white/20">
                        {user?.profilePicture?.url ? (
                          <img 
                            src={user.profilePicture.url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-green-500 flex items-center justify-center">
                            <span className="text-2xl font-abeze font-bold text-white">
                              {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <h2 className="text-xl font-abeze font-bold text-white">
                        {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'User'}
                      </h2>
                      <p className="text-green-200 font-abeze">
                        {user?.email}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={handleEditProfile}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-abeze font-medium transition-colors duration-300"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-abeze font-medium transition-colors duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="md:col-span-2">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <h3 className="text-2xl font-abeze font-bold text-white mb-6">
                      Account Information
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-green-200 font-abeze font-medium mb-2">
                          First Name
                        </label>
                        <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                          {user?.firstName || 'Not provided'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-green-200 font-abeze font-medium mb-2">
                          Last Name
                        </label>
                        <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                          {user?.lastName || 'Not provided'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-green-200 font-abeze font-medium mb-2">
                          Email Address
                        </label>
                        <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                          {user?.email}
                        </div>
                      </div>

                      <div>
                        <label className="block text-green-200 font-abeze font-medium mb-2">
                          Phone Number
                        </label>
                        <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                          {user?.phone || 'Not provided'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-green-200 font-abeze font-medium mb-2">
                          Country
                        </label>
                        <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                          {user?.country || 'Not provided'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-green-200 font-abeze font-medium mb-2">
                          Member Since
                        </label>
                        <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-green-200 font-abeze font-medium mb-2">
                          Last Updated
                        </label>
                        <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                          {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <h3 className="text-2xl font-abeze font-bold text-white mb-6">
                      Quick Actions
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleTabChange('bookings')}
                        className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>View Bookings</span>
                      </button>
                      
                      <button
                        onClick={() => navigate('/travel-packages')}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Browse Packages</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Tab Content */}
            {activeTab === 'messages' && (
              <UserContactMessages userEmail={user?.email} />
            )}

            {/* Bookings Tab Content */}
            {activeTab === 'bookings' && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-abeze font-bold text-white mb-6">
                  My Bookings
                </h3>
                
                {loadingBookings ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <p className="text-green-200 font-abeze">Loading your bookings...</p>
                  </div>
                ) : bookingsError ? (
                  <div className="text-center py-8">
                    <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-red-400 font-abeze mb-4">{bookingsError}</p>
                    <button
                      onClick={handleViewBookings}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-abeze font-medium transition-colors duration-300"
                    >
                      Try Again
                    </button>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-gray-300 font-abeze mb-4">No bookings found</p>
                    <button
                      onClick={() => navigate('/travel-packages')}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-abeze font-medium transition-colors duration-300"
                    >
                      Book Your First Safari
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-abeze font-bold text-white mb-2">
                              {booking.packageDetails?.title || 'Safari Package'}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-green-200 font-abeze">Location:</span>
                                <p className="text-white font-abeze">{booking.packageDetails?.location || 'N/A'}</p>
                              </div>
                              <div>
                                <span className="text-green-200 font-abeze">Duration:</span>
                                <p className="text-white font-abeze">{booking.packageDetails?.duration || 'N/A'}</p>
                              </div>
                              <div>
                                <span className="text-green-200 font-abeze">People:</span>
                                <p className="text-white font-abeze">{booking.bookingDetails?.numberOfPeople || 'N/A'}</p>
                              </div>
                              <div>
                                <span className="text-green-200 font-abeze">Total Price:</span>
                                <p className="text-white font-abeze">LKR {booking.totalPrice?.toLocaleString() || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-green-200 font-abeze">Start Date:</span>
                                <p className="text-white font-abeze">
                                  {booking.bookingDetails?.startDate ? new Date(booking.bookingDetails.startDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <span className="text-green-200 font-abeze">End Date:</span>
                                <p className="text-white font-abeze">
                                  {booking.bookingDetails?.endDate ? new Date(booking.bookingDetails.endDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <span className="text-green-200 font-abeze">Status:</span>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-abeze font-medium ${
                                  booking.status === 'Payment Confirmed' ? 'bg-green-600/20 text-green-400' :
                                  booking.status === 'Confirmed' ? 'bg-blue-600/20 text-blue-400' :
                                  booking.status === 'In Progress' ? 'bg-yellow-600/20 text-yellow-400' :
                                  booking.status === 'Completed' ? 'bg-purple-600/20 text-purple-400' :
                                  'bg-gray-600/20 text-gray-400'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div>
                                <span className="text-green-200 font-abeze">Payment:</span>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-abeze font-medium ${
                                  booking.payment ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                                }`}>
                                  {booking.payment ? 'Paid' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="md:ml-6">
                            {booking.status === 'Completed' && (
                              <button
                                onClick={() => setShowReviewForBookingId(booking._id)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-abeze"
                              >
                                Add Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal 
          onClose={handleCloseEditProfile}
          user={user}
        />
      )}

      {/* Add Review Modal */}
      {showReviewForBookingId && (
        <AddReviewModal
          onClose={() => setShowReviewForBookingId(null)}
          onSubmit={async ({ rating, comment, files }) => {
            const formData = new FormData();
            formData.append('rating', String(rating));
            formData.append('comment', comment || '');
            (files || []).forEach((f) => formData.append('images', f));
            await reviewApi.createReview(showReviewForBookingId, formData);
            setShowReviewForBookingId(null);
            // Optional: toast
          }}
        />
      )}
    </div>
  );
};

export default UserAccountPage;
