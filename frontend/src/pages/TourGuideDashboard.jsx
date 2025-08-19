import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TourGuideDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [availableBookings, setAvailableBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [availableRes, acceptedRes, completedRes] = await Promise.all([
        bookingApi.getAvailableBookingsForGuide(),
        bookingApi.getGuideAcceptedBookings(),
        bookingApi.getGuideCompletedBookings()
      ]);

      if (availableRes.success) setAvailableBookings(availableRes.bookings);
      if (acceptedRes.success) setAcceptedBookings(acceptedRes.bookings);
      if (completedRes.success) setCompletedBookings(completedRes.bookings);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get assigned but not yet accepted bookings
  const getAssignedBookings = () => {
    return availableBookings.filter(booking => 
      booking.guideId && !booking.guideAccepted
    );
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      setLoading(true);
      const response = await bookingApi.acceptBookingAsGuide(bookingId);
      if (response.success) {
        // Reload data to reflect changes
        await loadDashboardData();
      }
    } catch (err) {
      setError('Failed to accept booking');
      console.error('Accept booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTour = async (bookingId) => {
    try {
      setLoading(true);
      const response = await bookingApi.completeTourAsGuide(bookingId);
      if (response.success) {
        // Reload data to reflect changes
        await loadDashboardData();
      }
    } catch (err) {
      setError('Failed to complete tour');
      console.error('Complete tour error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Calculate dashboard statistics
  const dashboardStats = {
    totalTours: acceptedBookings.length + completedBookings.length,
    completedTours: completedBookings.length,
    upcomingTours: acceptedBookings.length,
    totalGuests: [...acceptedBookings, ...completedBookings].reduce((sum, booking) => sum + booking.bookingDetails.numberOfPeople, 0),
    averageRating: 4.9 // This would come from reviews in a real implementation
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate monthly chart data for the last 12 months
  const generateMonthlyChartData = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      // Count completed bookings for this month
      const monthBookings = completedBookings.filter(booking => {
        const completionDate = new Date(booking.updatedAt);
        return completionDate.getMonth() === date.getMonth() && 
               completionDate.getFullYear() === date.getFullYear();
      });
      
      months.push({
        month: `${monthName} ${year}`,
        bookings: monthBookings.length,
        guests: monthBookings.reduce((sum, booking) => sum + booking.bookingDetails.numberOfPeople, 0),
        earnings: monthBookings.reduce((sum, booking) => sum + (booking.bookingDetails.numberOfPeople * 7500), 0) // Rs. 7500 per guest
      });
    }
    
    return months;
  };

  const downloadReport = () => {
    const monthlyData = generateMonthlyChartData();
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Calculate current month statistics
    const currentMonthData = monthlyData[monthlyData.length - 1];
    const baseSalary = user?.basicSalary || 50000;
    const commissionPerGuest = 7500; // Rs. 7500 per guest
    const monthlyGuests = currentMonthData.guests;
    const monthlyCommission = monthlyGuests * commissionPerGuest;
    const totalMonthlySalary = baseSalary + monthlyCommission;

    // Create report content
    const reportContent = `
TOUR GUIDE MONTHLY REPORT
Generated on: ${new Date().toLocaleDateString()}
Tour Guide: ${user?.firstName} ${user?.lastName}
Email: ${user?.email}

MONTHLY OVERVIEW - ${currentMonth}
===========================================
Total Tours Completed: ${currentMonthData.bookings}
Total Guests: ${monthlyGuests}
Base Salary: Rs. ${baseSalary.toLocaleString()}
Commission (Rs. ${commissionPerGuest.toLocaleString()} per guest): Rs. ${monthlyCommission.toLocaleString()}
Total Monthly Salary: Rs. ${totalMonthlySalary.toLocaleString()}

MONTHLY TREND (Last 12 Months)
===========================================
${monthlyData.map(data => 
  `${data.month}: ${data.bookings} tours, ${data.guests} guests, Rs. ${data.earnings.toLocaleString()} earnings`
).join('\n')}

DETAILED TOUR BREAKDOWN - ${currentMonth}
===========================================
${completedBookings
  .filter(booking => {
    const completionDate = new Date(booking.updatedAt);
    const currentDate = new Date();
    return completionDate.getMonth() === currentDate.getMonth() && 
           completionDate.getFullYear() === currentDate.getFullYear();
  })
  .map((booking, index) => 
    `${index + 1}. ${booking.userId.firstName} ${booking.userId.lastName}
     Package: ${booking.packageId.title}
     Date: ${formatDate(booking.bookingDetails.startDate)}
     Guests: ${booking.bookingDetails.numberOfPeople}
     Commission: Rs. ${(booking.bookingDetails.numberOfPeople * commissionPerGuest).toLocaleString()}`
  ).join('\n\n')}

---
Report generated by Wildlife Safari Management System
    `;

    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tour-guide-report-${currentMonth.replace(' ', '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

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
              <p className="text-blue-200 font-abeze text-sm">Upcoming</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.upcomingTours}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 font-abeze text-sm">Completed</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.completedTours}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

      {/* Assigned Tasks */}
      {getAssignedBookings().length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-abeze font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Assigned Tasks (Pending Acceptance)
          </h3>
          <div className="space-y-4">
            {getAssignedBookings().map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-abeze font-medium">
                      {booking.userId?.firstName} {booking.userId?.lastName}
                    </h4>
                    <p className="text-gray-300 font-abeze text-sm">
                      {booking.packageDetails?.title || booking.packageId?.title} • {formatDate(booking.bookingDetails?.startDate)}
                    </p>
                    <p className="text-gray-400 font-abeze text-xs">
                      {booking.bookingDetails?.numberOfPeople} guests • Assigned by Admin
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptBooking(booking._id)}
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Accept Assignment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Bookings */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-abeze font-bold text-white mb-4">Available Bookings</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading available bookings...</p>
          </div>
        ) : availableBookings.length === 0 ? (
          <p className="text-gray-300 text-center py-8">No available bookings at the moment.</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Customer</th>
                  <th className="text-left py-3 px-4 text-green-200 font-abeze">Package</th>
                  <th className="text-left py-3 px-4 text-green-200 font-abeze">Start Date</th>
                  <th className="text-left py-3 px-4 text-green-200 font-abeze">End Date</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Guests</th>
                  <th className="text-left py-3 px-4 text-green-200 font-abeze">Action</th>
              </tr>
            </thead>
            <tbody>
                {availableBookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-white/10">
                    <td className="py-3 px-4 text-white font-abeze">
                      {booking.userId.firstName} {booking.userId.lastName}
                    </td>
                    <td className="py-3 px-4 text-white font-abeze">{booking.packageId.title}</td>
                    <td className="py-3 px-4 text-white font-abeze">{formatDate(booking.bookingDetails.startDate)}</td>
                    <td className="py-3 px-4 text-white font-abeze">{formatDate(booking.bookingDetails.endDate)}</td>
                    <td className="py-3 px-4 text-white font-abeze">{booking.bookingDetails.numberOfPeople}</td>
                  <td className="py-3 px-4">
                      <button
                        onClick={() => handleAcceptBooking(booking._id)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                      >
                        Accept
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-400 font-abeze">{error}</p>
        </div>
      )}
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-abeze font-bold text-white mb-4">My Tour Schedule</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading schedule...</p>
          </div>
        ) : acceptedBookings.length === 0 ? (
          <p className="text-gray-300 text-center py-8">No upcoming tours scheduled.</p>
        ) : (
        <div className="space-y-4">
            {acceptedBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                <div>
                    <h4 className="text-white font-abeze font-medium">
                      {booking.userId.firstName} {booking.userId.lastName}
                    </h4>
                    <p className="text-gray-300 font-abeze text-sm">
                      {booking.packageId.title} • {formatDate(booking.bookingDetails.startDate)} - {formatDate(booking.bookingDetails.endDate)}
                    </p>
                    <p className="text-gray-400 font-abeze text-xs">
                      {booking.bookingDetails.numberOfPeople} guests • {booking.packageId.location}
                    </p>
                </div>
              </div>
                <button
                  onClick={() => handleCompleteTour(booking._id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Complete Tour
                </button>
            </div>
          ))}
          </div>
        )}
        </div>
      </div>
  );

  const renderCompleted = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-abeze font-bold text-white mb-4">Completed Tours</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading completed tours...</p>
          </div>
        ) : completedBookings.length === 0 ? (
          <p className="text-gray-300 text-center py-8">No completed tours yet.</p>
        ) : (
        <div className="space-y-4">
            {completedBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                    <h4 className="text-white font-abeze font-medium">
                      {booking.userId.firstName} {booking.userId.lastName}
                    </h4>
                    <p className="text-gray-300 font-abeze text-sm">
                      {booking.packageId.title} • {formatDate(booking.bookingDetails.startDate)} - {formatDate(booking.bookingDetails.endDate)}
                    </p>
                    <p className="text-gray-400 font-abeze text-xs">
                      {booking.bookingDetails.numberOfPeople} guests • {booking.packageId.location}
                    </p>
                </div>
              </div>
                <div className="text-right">
                  <span className="text-green-400 font-abeze text-sm">Completed</span>
                  <p className="text-gray-400 font-abeze text-xs">
                    {formatDate(booking.updatedAt)}
                  </p>
                </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );

  const renderReports = () => {
    // Calculate monthly statistics
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyCompletedBookings = completedBookings.filter(booking => {
      const completionDate = new Date(booking.updatedAt);
      return completionDate.getMonth() === currentMonth && completionDate.getFullYear() === currentYear;
    });

    const monthlyGuests = monthlyCompletedBookings.reduce((sum, booking) => 
      sum + booking.bookingDetails.numberOfPeople, 0
    );

    // Calculate salary in Sri Lankan Rupees
    const commissionPerGuest = 7500; // Rs. 7500 per guest
    const monthlySalary = monthlyGuests * commissionPerGuest;
    const baseSalary = (user?.basicSalary || 50000) * 3.5; // Convert to LKR (assuming 1 USD = 350 LKR)
    const totalMonthlySalary = baseSalary + monthlySalary;

    const chartData = generateMonthlyChartData();

    return (
      <div className="space-y-6">
        {/* Download Report Button */}
        <div className="flex justify-end">
          <button
            onClick={downloadReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Report</span>
          </button>
        </div>

        {/* Monthly Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 font-abeze text-sm">Monthly Tours</p>
                <p className="text-3xl font-abeze font-bold text-white">{monthlyCompletedBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 font-abeze text-sm">Monthly Guests</p>
                <p className="text-3xl font-abeze font-bold text-white">{monthlyGuests}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 font-abeze text-sm">Monthly Salary</p>
                <p className="text-3xl font-abeze font-bold text-white">Rs. {totalMonthlySalary.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-abeze font-bold text-white mb-4">Monthly Completed Tours Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Bar dataKey="bookings" fill="#10B981" name="Completed Tours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Breakdown */}
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-abeze font-bold text-white mb-4">Salary Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-abeze font-medium">Base Salary</p>
                <p className="text-gray-400 font-abeze text-sm">Monthly fixed salary</p>
              </div>
              <p className="text-white font-abeze font-bold">Rs. {baseSalary.toLocaleString()}</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-abeze font-medium">Commission</p>
                <p className="text-gray-400 font-abeze text-sm">Rs. {commissionPerGuest.toLocaleString()} per guest × {monthlyGuests} guests</p>
              </div>
              <p className="text-white font-abeze font-bold">Rs. {monthlySalary.toLocaleString()}</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div>
                <p className="text-green-200 font-abeze font-medium">Total Monthly Salary</p>
                <p className="text-green-400 font-abeze text-sm">Base + Commission</p>
              </div>
              <p className="text-green-200 font-abeze font-bold text-2xl">Rs. {totalMonthlySalary.toLocaleString()}</p>
            </div>
          </div>
    </div>

        {/* Monthly Completed Tours */}
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-abeze font-bold text-white mb-4">
            Monthly Completed Tours - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          {monthlyCompletedBookings.length === 0 ? (
            <p className="text-gray-300 text-center py-8">No tours completed this month yet.</p>
          ) : (
            <div className="space-y-4">
              {monthlyCompletedBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-abeze font-medium">
                        {booking.userId.firstName} {booking.userId.lastName}
                      </h4>
                      <p className="text-gray-300 font-abeze text-sm">
                        {booking.packageId.title} • {formatDate(booking.bookingDetails.startDate)}
                      </p>
                      <p className="text-gray-400 font-abeze text-xs">
                        {booking.bookingDetails.numberOfPeople} guests
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-abeze font-medium">
                      Rs. {(booking.bookingDetails.numberOfPeople * commissionPerGuest).toLocaleString()}
                    </p>
                    <p className="text-gray-400 font-abeze text-xs">Commission</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Main Content */}
      <div className="pt-8 pb-16">
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
                { id: 'completed', label: 'Completed', icon: '✅' },
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
              {activeTab === 'completed' && renderCompleted()}
              {activeTab === 'reports' && renderReports()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideDashboard;
