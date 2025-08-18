import React, { useState, useEffect } from 'react';
import { payrollApi, staffApi } from '../services/api';

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 0,
    deductions: 0,
    bonuses: 0,
    allowances: 0,
    notes: ''
  });

  useEffect(() => {
    loadPayroll();
    loadStaff();
    loadStats();
  }, [selectedMonth, selectedYear]);

  const loadPayroll = async () => {
    setLoading(true);
    try {
      const data = await payrollApi.getPayrollByMonth(selectedMonth, selectedYear);
      setPayroll(data);
    } catch (error) {
      console.error('Error loading payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    setStaffLoading(true);
    try {
      const data = await staffApi.getAllStaff();
      setStaff(data.filter(s => s.isActive));
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setStaffLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await payrollApi.getPayrollStats(selectedYear);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      await payrollApi.generatePayroll(selectedMonth, selectedYear);
      setShowGenerateModal(false);
      loadPayroll();
      loadStats();
      alert(`Payroll generated successfully for ${getMonthName(selectedMonth)} ${selectedYear}`);
    } catch (error) {
      console.error('Error generating payroll:', error);
      alert('Error generating payroll. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.staffId || !formData.basicSalary) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      await payrollApi.createOrUpdatePayroll(formData);
      setShowEditModal(false);
      setFormData({
        staffId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicSalary: 0,
        deductions: 0,
        bonuses: 0,
        allowances: 0,
        notes: ''
      });
      loadPayroll();
      loadStats();
    } catch (error) {
      console.error('Error creating/updating payroll:', error);
      alert('Error saving payroll. Please try again.');
    }
  };

  const handleEdit = (payrollRecord) => {
    setSelectedPayroll(payrollRecord);
    setFormData({
      staffId: payrollRecord.staffId._id,
      month: payrollRecord.month,
      year: payrollRecord.year,
      basicSalary: payrollRecord.basicSalary,
      deductions: payrollRecord.deductions,
      bonuses: payrollRecord.bonuses,
      allowances: payrollRecord.allowances,
      notes: payrollRecord.notes
    });
    setShowEditModal(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await payrollApi.updatePayrollStatus(id, newStatus);
      loadPayroll();
      loadStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleRecalculate = async (id) => {
    try {
      await payrollApi.recalculatePayroll(id);
      loadPayroll();
      loadStats();
      alert('Payroll recalculated successfully');
    } catch (error) {
      console.error('Error recalculating payroll:', error);
      alert('Error recalculating payroll. Please try again.');
    }
  };

  const handleRefreshMonth = async () => {
    try {
      await payrollApi.refreshPayrollForMonth(selectedMonth, selectedYear);
      loadPayroll();
      loadStats();
      alert('All payroll records for this month have been refreshed with attendance data');
    } catch (error) {
      console.error('Error refreshing payroll:', error);
      alert('Error refreshing payroll. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        await payrollApi.deletePayroll(id);
        loadPayroll();
        loadStats();
        alert('Payroll record deleted successfully');
      } catch (error) {
        console.error('Error deleting payroll:', error);
        alert('Error deleting payroll. Please try again.');
      }
    }
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      pending: 'bg-yellow-500',
      approved: 'bg-blue-500',
      paid: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-abeze font-bold text-white">Payroll Management</h2>
          <p className="text-gray-400 font-abeze">Manage staff salaries and payroll records</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
          >
            Generate Payroll
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
          >
            Add/Edit Payroll
          </button>
          <button
            onClick={handleRefreshMonth}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
          >
            Refresh Month
          </button>
        </div>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div>
            <label className="block text-gray-300 font-abeze text-sm mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {getMonthName(i + 1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-abeze text-sm mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 font-abeze text-sm">Total Payroll</p>
                <p className="text-3xl font-abeze font-bold">{stats.totalPayroll}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 font-abeze text-sm">Total Amount</p>
                <p className="text-3xl font-abeze font-bold">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 font-abeze text-sm">Average Salary</p>
                <p className="text-3xl font-abeze font-bold">{formatCurrency(stats.averageSalary)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 font-abeze text-sm">Paid Records</p>
                <p className="text-3xl font-abeze font-bold">{stats.byStatus.paid}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-abeze font-semibold text-white">
            Payroll Records - {getMonthName(selectedMonth)} {selectedYear}
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-white">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading payroll records...
            </div>
          </div>
        ) : payroll.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-sm">No payroll records found for {getMonthName(selectedMonth)} {selectedYear}</p>
            <p className="text-xs">Click "Generate Payroll" to create records for this month</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Working Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Basic Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Overtime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {payroll.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {record.staffId.firstName.charAt(0)}{record.staffId.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {record.staffId.firstName} {record.staffId.lastName}
                          </div>
                          <div className="text-sm text-gray-400">{record.staffId.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {record.totalWorkingDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {record.totalWorkingHours.toFixed(1)} hrs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {formatCurrency(record.basicSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {formatCurrency(record.overtimePay)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      {formatCurrency(record.netPay)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)} text-white`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRecalculate(record._id)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="Recalculate"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Payroll Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-abeze font-bold text-white">Generate Payroll</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {getMonthName(i + 1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-300 text-sm">
                    This will generate payroll records for all active staff members based on their attendance data.
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex space-x-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePayroll}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
              >
                Generate Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Payroll Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-abeze font-bold text-white">
                {selectedPayroll ? 'Edit Payroll Record' : 'Add Payroll Record'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Staff Member</label>
                <select
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Staff Member</option>
                  {staff.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.firstName} {member.lastName} - {member.role}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-abeze text-sm mb-2">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                    required
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {getMonthName(i + 1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-abeze text-sm mb-2">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                    required
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Basic Salary</label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({ ...formData, basicSalary: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-abeze text-sm mb-2">Deductions</label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-abeze text-sm mb-2">Bonuses</label>
                  <input
                    type="number"
                    value={formData.bonuses}
                    onChange={(e) => setFormData({ ...formData, bonuses: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-abeze text-sm mb-2">Allowances</label>
                  <input
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({ ...formData, allowances: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  {selectedPayroll ? 'Update Record' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
