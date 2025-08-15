import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { packageApi, userApi, staffApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddPackageModal from '../components/AddPackageModal';
import EditPackageModal from '../components/EditPackageModal';
import AddStaffModal from '../components/AddStaffModal';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showEditPackage, setShowEditPackage] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Load data when tabs are selected
  useEffect(() => {
    if (activeTab === 'packages') {
      loadPackages();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'staff') {
      loadStaff();
    }
  }, [activeTab]);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const packagesData = await packageApi.getAllPackages();
      setPackages(packagesData);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageAdded = () => {
    loadPackages();
  };

  const handlePackageUpdated = () => {
    loadPackages();
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowEditPackage(true);
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await packageApi.deletePackage(packageId);
        loadPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package');
      }
    }
  };



  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const usersData = await userApi.getAllUsers();
      // Filter out admin users, show only customers (normal users)
      const customersOnly = usersData.filter(user => user.role === 'user');
      setUsers(customersOnly);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userApi.deleteUser(userId);
        loadUsers();
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const loadStaff = async () => {
    setStaffLoading(true);
    try {
      // Fetch staff members from Staff collection
      const staffData = await staffApi.getAllStaff();
      
      // Fetch main admin from User collection
      const usersData = await userApi.getAllUsers();
      const mainAdmin = usersData.find(user => user.role === 'admin');
      
      // Combine main admin with staff members
      const allStaff = [];
      
      // Add main admin if found
      if (mainAdmin) {
        allStaff.push({
          ...mainAdmin,
          _id: mainAdmin._id,
          firstName: mainAdmin.firstName,
          lastName: mainAdmin.lastName,
          email: mainAdmin.email,
          phone: mainAdmin.phone || 'N/A',
          role: 'admin',
          specialization: 'Main Administrator',
          experience: 'N/A',
          isActive: true,
          profilePicture: mainAdmin.profilePicture,
          userType: 'main_admin' // Flag to identify main admin
        });
      }
      
      // Add staff members
      allStaff.push(...staffData);
      
      setStaff(allStaff);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleStaffAdded = () => {
    loadStaff();
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      try {
        await staffApi.deleteStaff(staffId);
        loadStaff();
        alert('Staff member deleted successfully');
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert(error.response?.data?.message || 'Failed to delete staff member');
      }
    }
  };

  const handleToggleStaffStatus = async (staffId) => {
    try {
      await staffApi.toggleStaffStatus(staffId);
      loadStaff();
    } catch (error) {
      console.error('Error toggling staff status:', error);
      alert('Failed to update staff status');
    }
  };

  // Mock data for demonstration
  const dashboardStats = {
    totalUsers: 1250,
    totalBookings: 342,
    totalRevenue: 45600,
    activeStaff: 15
  };

  const recentBookings = [
    { id: 1, customer: 'John Doe', package: 'Elephant Safari', date: '2024-01-15', status: 'Confirmed' },
    { id: 2, customer: 'Jane Smith', package: 'Lion Safari', date: '2024-01-16', status: 'Pending' },
    { id: 3, customer: 'Mike Johnson', package: 'Bird Watching', date: '2024-01-17', status: 'Confirmed' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 font-abeze text-sm">Total Users</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 font-abeze text-sm">Total Bookings</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 font-abeze text-sm">Total Revenue</p>
              <p className="text-3xl font-abeze font-bold text-white">${dashboardStats.totalRevenue}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 font-abeze text-sm">Active Staff</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.activeStaff}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-abeze font-bold text-white mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Customer</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Package</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Date</th>
                <th className="text-left py-3 px-4 text-green-200 font-abeze">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/10">
                  <td className="py-3 px-4 text-white font-abeze">{booking.customer}</td>
                  <td className="py-3 px-4 text-white font-abeze">{booking.package}</td>
                  <td className="py-3 px-4 text-white font-abeze">{booking.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                      booking.status === 'Confirmed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Customer Management</h3>
        <div className="text-gray-300 font-abeze text-sm">
          Total Customers: {users.length}
        </div>
      </div>

      {/* Users List */}
      {usersLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading customers...</div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No customers found.</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Name</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Email</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Phone</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Country</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Role</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Joined</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-abeze">
                      <div className="flex items-center space-x-3">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.firstName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="text-green-400 text-sm font-abeze">
                              {user.firstName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze">{user.email}</td>
                    <td className="py-4 px-6 text-white font-abeze">{user.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-white font-abeze">{user.country || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        user.role === 'admin' 
                          ? 'bg-red-500/20 text-red-400' 
                          : user.role === 'staff'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-abeze transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Staff Management</h3>
        <button
          onClick={() => setShowAddStaff(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Staff</span>
        </button>
      </div>

      {/* Staff List */}
      {staffLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading staff...</div>
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No staff members found.</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Name</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Email</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Phone</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Role</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Specialization</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Experience</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Status</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((staffMember) => (
                  <tr key={staffMember._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-abeze">
                      <div className="flex items-center space-x-3">
                        {staffMember.profilePicture?.url ? (
                          <img 
                            src={staffMember.profilePicture.url} 
                            alt={staffMember.firstName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-blue-400 text-sm font-abeze">
                              {staffMember.firstName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{staffMember.firstName} {staffMember.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze">{staffMember.email}</td>
                    <td className="py-4 px-6 text-white font-abeze">{staffMember.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        staffMember.userType === 'main_admin'
                          ? 'bg-purple-500/20 text-purple-400'
                          : staffMember.role === 'admin' 
                          ? 'bg-red-500/20 text-red-400' 
                          : staffMember.role === 'tour_guide'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {staffMember.userType === 'main_admin' 
                          ? 'Main Admin' 
                          : staffMember.role === 'tour_guide' 
                          ? 'Tour Guide' 
                          : staffMember.role === 'admin'
                          ? 'Sub Admin'
                          : staffMember.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {staffMember.specialization || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {staffMember.experience || 0} years
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        staffMember.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {staffMember.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {/* Don't show toggle/delete buttons for main admin */}
                        {staffMember.userType !== 'main_admin' ? (
                          <>
                            <button
                              onClick={() => handleToggleStaffStatus(staffMember._id)}
                              className={`px-3 py-1 rounded text-xs font-abeze transition-colors ${
                                staffMember.isActive 
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              }`}
                            >
                              {staffMember.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staffMember._id)}
                              className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-abeze transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs font-abeze">Main Admin</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderPackages = () => (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Package Management</h3>
        <button
          onClick={() => setShowAddPackage(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Package</span>
        </button>
      </div>

      {/* Packages List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading packages...</div>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No packages found. Add your first package!</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Package Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                    {pkg.image?.url ? (
                      <img 
                        src={pkg.image.url} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Package Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-abeze font-bold text-white">{pkg.title}</h4>
                      {pkg.isPopular && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-abeze">
                          Popular
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        pkg.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300 font-abeze">
                      <div>
                        <span className="text-gray-400">Category:</span> {pkg.category}
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span> {pkg.duration}
                      </div>
                      <div>
                        <span className="text-gray-400">Price:</span> LKR {pkg.price?.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-400">Location:</span> {pkg.location}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 font-abeze text-sm mt-2 line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>
                </div>

                                 {/* Actions */}
                 <div className="flex items-center space-x-2">
                   <button
                     onClick={() => handleEditPackage(pkg)}
                     className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-abeze transition-colors"
                   >
                     Edit
                   </button>
                   <button
                     onClick={() => handleDeletePackage(pkg._id)}
                     className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-abeze transition-colors"
                   >
                     Delete
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-abeze font-bold text-white mb-4">Booking Management</h3>
      <p className="text-gray-300 font-abeze">Booking management functionality will be implemented here.</p>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-abeze font-bold text-white mb-4">Reports & Analytics</h3>
      <p className="text-gray-300 font-abeze">Reports and analytics functionality will be implemented here.</p>
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
              Admin Dashboard
            </h1>
            <p className="text-gray-300 font-abeze text-lg">
              Welcome back, {user?.firstName} {user?.lastName}
            </p>
          </div>

          {/* Admin Content */}
          <div className="max-w-7xl mx-auto">
            {/* Navigation Tabs */}
                         <div className="flex flex-wrap gap-2 mb-8">
               {[
                 { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                 { id: 'users', label: 'Customers', icon: '👥' },
                 { id: 'staff', label: 'Staff Management', icon: '👨‍💼' },
                 { id: 'packages', label: 'Packages', icon: '🎒' },
                 { id: 'bookings', label: 'Bookings', icon: '📅' },
                 { id: 'reports', label: 'Reports', icon: '📈' },
               ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-3 rounded-lg font-abeze font-medium transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
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
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'staff' && renderStaff()}
              {activeTab === 'packages' && renderPackages()}
              {activeTab === 'bookings' && renderBookings()}
              {activeTab === 'reports' && renderReports()}
            </div>
          </div>
        </div>
      </div>

      <Footer />

             {/* Add Package Modal */}
       {showAddPackage && (
         <AddPackageModal 
           onClose={() => setShowAddPackage(false)}
           onPackageAdded={handlePackageAdded}
         />
       )}

       {/* Edit Package Modal */}
       {showEditPackage && selectedPackage && (
         <EditPackageModal 
           package={selectedPackage}
           onClose={() => {
             setShowEditPackage(false);
             setSelectedPackage(null);
           }}
           onPackageUpdated={handlePackageUpdated}
         />
       )}

       {/* Add Staff Modal */}
       {showAddStaff && (
         <AddStaffModal 
           onClose={() => setShowAddStaff(false)}
           onStaffAdded={handleStaffAdded}
         />
       )}
    </div>
  );
};

export default AdminPage;
