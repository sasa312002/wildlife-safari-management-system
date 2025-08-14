import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditProfileModal from '../components/EditProfileModal';

const UserAccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);

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

  const handleViewBookings = () => {
    // TODO: Implement view bookings functionality
    console.log('View bookings clicked');
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
                        Password
                      </label>
                      <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze">
                        ••••••••••••••••
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
                      onClick={handleViewBookings}
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
    </div>
  );
};

export default UserAccountPage;
