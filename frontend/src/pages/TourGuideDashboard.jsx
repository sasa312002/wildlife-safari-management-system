import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TourGuideDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Mock data for demonstration
  const dashboardStats = {
    totalTours: 38,
    completedTours: 35,
    upcomingTours: 3,
    totalGuests: 156,
    averageRating: 4.9
  };

  const upcomingTours = [
    { id: 1, customer: 'John Doe', destination: 'Yala National Park', date: '2024-01-15', time: '06:00 AM', guests: 4, status: 'Confirmed' },
    { id: 2, customer: 'Jane Smith', destination: 'Wilpattu National Park', date: '2024-01-16', time: '05:30 AM', guests: 2, status: 'Confirmed' },
    { id: 3, customer: 'Mike Johnson', destination: 'Udawalawe National Park', date: '2024-01-17', time: '07:00 AM', guests: 6, status: 'Pending' },
  ];

  const recentTours = [
    { id: 1, customer: 'Sarah Wilson', destination: 'Yala National Park', date: '2024-01-14', guests: 3, rating: 5, feedback: 'Amazing wildlife sightings! Our guide was incredibly knowledgeable.' },
    { id: 2, customer: 'David Brown', destination: 'Wilpattu National Park', date: '2024-01-13', guests: 2, rating: 5, feedback: 'Excellent tour guide, very informative about the wildlife.' },
    { id: 3, customer: 'Lisa Davis', destination: 'Udawalawe National Park', date: '2024-01-12', guests: 4, rating: 5, feedback: 'Best safari experience ever! Great guide!' },
  ];

  const wildlifeSightings = [
    { id: 1, animal: 'Leopard', location: 'Yala National Park', date: '2024-01-14', time: '08:30 AM', notes: 'Male leopard near waterhole' },
    { id: 2, animal: 'Elephant Herd', location: 'Udawalawe National Park', date: '2024-01-13', time: '09:15 AM', notes: 'Family of 8 elephants' },
    { id: 3, animal: 'Sloth Bear', location: 'Wilpattu National Park', date: '2024-01-12', time: '07:45 AM', notes: 'Solo bear foraging' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 font-abeze text-sm">Total Tours</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.totalTours}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 font-abeze text-sm">Completed</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.completedTours}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 font-abeze text-sm">Upcoming</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.upcomingTours}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 font-abeze text-sm">Total Guests</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.totalGuests}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 font-abeze text-sm">Rating</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tours */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-abeze font-bold text-white mb-4">Upcoming Tours</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Customer</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Destination</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Date</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Time</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Guests</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingTours.map((tour) => (
                <tr key={tour.id} className="border-b border-white/10">
                  <td className="py-3 px-4 text-white font-abeze">{tour.customer}</td>
                  <td className="py-3 px-4 text-white font-abeze">{tour.destination}</td>
                  <td className="py-3 px-4 text-white font-abeze">{tour.date}</td>
                  <td className="py-3 px-4 text-white font-abeze">{tour.time}</td>
                  <td className="py-3 px-4 text-white font-abeze">{tour.guests}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                      tour.status === 'Confirmed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {tour.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Tours */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-abeze font-bold text-white mb-4">Recent Tours</h3>
        <div className="space-y-4">
          {recentTours.map((tour) => (
            <div key={tour.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="text-white font-abeze font-medium">{tour.customer}</h4>
                  <p className="text-gray-300 font-abeze text-sm">{tour.destination} • {tour.date} • {tour.guests} guests</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white font-abeze">{tour.rating}</span>
                </div>
                <div className="text-gray-300 font-abeze text-sm max-w-xs truncate">
                  "{tour.feedback}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Wildlife Sightings */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-abeze font-bold text-white mb-4">Recent Wildlife Sightings</h3>
        <div className="space-y-4">
          {wildlifeSightings.map((sighting) => (
            <div key={sighting.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-abeze font-medium">{sighting.animal}</h4>
                  <p className="text-gray-300 font-abeze text-sm">{sighting.location} • {sighting.date} at {sighting.time}</p>
                  <p className="text-gray-400 font-abeze text-xs">{sighting.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-abeze font-bold text-white mb-4">Tour Schedule</h3>
      <p className="text-gray-300 font-abeze">Tour schedule management functionality will be implemented here.</p>
    </div>
  );

  const renderKnowledge = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-abeze font-bold text-white mb-4">Knowledge Base</h3>
      <p className="text-gray-300 font-abeze">Wildlife knowledge and tour guide resources will be implemented here.</p>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-abeze font-bold text-white mb-4">Tour Reports</h3>
      <p className="text-gray-300 font-abeze">Tour reports and feedback analysis will be implemented here.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-4">
              <div></div> {/* Empty div for spacing */}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-4">
              Tour Guide Dashboard
            </h1>
            <p className="text-gray-300 font-abeze text-lg">
              Welcome back, {user?.firstName} {user?.lastName}
            </p>
          </div>

          {/* Tour Guide Content */}
          <div className="max-w-7xl mx-auto">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'schedule', label: 'Schedule', icon: '📅' },
                { id: 'knowledge', label: 'Knowledge', icon: '📚' },
                { id: 'reports', label: 'Reports', icon: '📈' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-3 rounded-lg font-abeze font-medium transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'schedule' && renderSchedule()}
              {activeTab === 'knowledge' && renderKnowledge()}
              {activeTab === 'reports' && renderReports()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TourGuideDashboard;
