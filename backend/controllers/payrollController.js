import Payroll from '../models/Payroll.js';
import Staff from '../models/Staff.js';
import Attendance from '../models/Attendance.js';

// Get all payroll records
const getAllPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.find()
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName')
      .sort({ year: -1, month: -1 });
    
    res.json(payroll);
  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get payroll by staff ID
const getPayrollByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { year } = req.query;
    
    let query = { staffId };
    if (year) {
      query.year = parseInt(year);
    }
    
    const payroll = await Payroll.find(query)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName')
      .sort({ year: -1, month: -1 });
    
    res.json(payroll);
  } catch (error) {
    console.error('Error fetching staff payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get payroll by month and year
const getPayrollByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    
    const payroll = await Payroll.find({ 
      month: parseInt(month), 
      year: parseInt(year) 
    })
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName')
      .sort({ 'staffId.firstName': 1 });
    
    res.json(payroll);
  } catch (error) {
    console.error('Error fetching monthly payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate payroll for a specific month and year
const generatePayroll = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    // Get all active staff
    const staff = await Staff.find({ isActive: true });
    
    // Get attendance data for the month
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month, end of day
    
    // Ensure valid dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid month or year provided' });
    }
    
    console.log('Payroll Generation Debug:');
    console.log('Month:', month, 'Year:', year);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    
    // Get ALL attendance data for the month (not just specific statuses)
    const attendanceData = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('staffId');
    
    console.log('Total attendance records found:', attendanceData.length);
    if (attendanceData.length > 0) {
      console.log('Attendance data sample:', attendanceData.slice(0, 2).map(a => ({
        id: a._id,
        staffId: a.staffId._id,
        staffName: a.staffId.firstName + ' ' + a.staffId.lastName,
        date: a.date,
        status: a.status,
        totalHours: a.totalHours,
        checkIn: a.checkIn?.time,
        checkOut: a.checkOut?.time
      })));
    } else {
      console.log('No attendance records found for the date range');
      console.log('Date range:', { startDate, endDate });
    }
    
    const generatedPayroll = [];
    
    for (const member of staff) {
      console.log(`Processing staff member: ${member.firstName} ${member.lastName}`);
      
      // Check if payroll already exists for this staff and month
      const existingPayroll = await Payroll.findOne({
        staffId: member._id,
        month: parseInt(month),
        year: parseInt(year)
      });
      
      if (existingPayroll) {
        console.log(`Existing payroll found for ${member.firstName}, skipping...`);
        generatedPayroll.push(existingPayroll);
        continue;
      }
      
      // Calculate working hours for this staff member
      const memberAttendance = attendanceData.filter(a => 
        a.staffId._id.toString() === member._id.toString()
      );
      
      console.log(`Attendance records for ${member.firstName}:`, memberAttendance.length);
      
      // Calculate working days (any day with attendance record)
      const totalWorkingDays = memberAttendance.length;
      
      // Calculate total working hours (sum of all totalHours)
      const totalWorkingHours = memberAttendance.reduce((sum, a) => {
        const hours = a.totalHours || 0;
        console.log(`Record date: ${a.date}, hours: ${hours}`);
        return sum + hours;
      }, 0);
      
      console.log(`${member.firstName} - Working days: ${totalWorkingDays}, Total hours: ${totalWorkingHours}`);
      
      // Get basic salary from staff member
      const basicSalary = member.basicSalary || 50000; // Use staff's salary or default
      
      // Create payroll record
      const payroll = new Payroll({
        staffId: member._id,
        month: parseInt(month),
        year: parseInt(year),
        basicSalary,
        totalWorkingDays,
        totalWorkingHours,
        status: 'draft'
      });
      
      // Calculate payroll (this will be done automatically by pre-save middleware)
      await payroll.save();
      
      const populatedPayroll = await Payroll.findById(payroll._id)
        .populate('staffId', 'firstName lastName email role')
        .populate('approvedBy', 'firstName lastName');
      
      generatedPayroll.push(populatedPayroll);
    }
    
    res.status(201).json({
      message: `Payroll generated for ${month}/${year}`,
      payroll: generatedPayroll
    });
  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create or update payroll record
const createOrUpdatePayroll = async (req, res) => {
  try {
    const { staffId, month, year, basicSalary, deductions, bonuses, allowances, notes } = req.body;
    
    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Check if payroll already exists
    let payroll = await Payroll.findOne({ staffId, month, year });
    
    if (payroll) {
      // Update existing payroll
      payroll.basicSalary = basicSalary || payroll.basicSalary;
      payroll.deductions = deductions || 0;
      payroll.bonuses = bonuses || 0;
      payroll.allowances = allowances || 0;
      payroll.notes = notes || '';
      
      await payroll.save();
    } else {
      // Create new payroll
      payroll = new Payroll({
        staffId,
        month,
        year,
        basicSalary,
        deductions: deductions || 0,
        bonuses: bonuses || 0,
        allowances: allowances || 0,
        notes: notes || ''
      });
      
      await payroll.save();
    }
    
    const populatedPayroll = await Payroll.findById(payroll._id)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName');
    
    res.json(populatedPayroll);
  } catch (error) {
    console.error('Error creating/updating payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update payroll status
const updatePayrollStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    payroll.status = status;
    if (notes) payroll.notes = notes;
    
    if (status === 'approved') {
      payroll.approvedBy = req.user.id;
      payroll.approvedAt = new Date();
    } else if (status === 'paid') {
      payroll.paidAt = new Date();
    }
    
    await payroll.save();
    
    const populatedPayroll = await Payroll.findById(payroll._id)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName');
    
    res.json(populatedPayroll);
  } catch (error) {
    console.error('Error updating payroll status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete payroll record
const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payroll = await Payroll.findByIdAndDelete(id);
    
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    res.json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    console.error('Error deleting payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get payroll statistics
const getPayrollStats = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    const payroll = await Payroll.find({ year: currentYear });
    
    const stats = {
      totalPayroll: payroll.length,
      totalAmount: payroll.reduce((sum, p) => sum + p.netPay, 0),
      averageSalary: payroll.length > 0 ? payroll.reduce((sum, p) => sum + p.netPay, 0) / payroll.length : 0,
      byStatus: {
        draft: payroll.filter(p => p.status === 'draft').length,
        pending: payroll.filter(p => p.status === 'pending').length,
        approved: payroll.filter(p => p.status === 'approved').length,
        paid: payroll.filter(p => p.status === 'paid').length,
        cancelled: payroll.filter(p => p.status === 'cancelled').length
      },
      monthlyBreakdown: Array.from({ length: 12 }, (_, i) => {
        const monthPayroll = payroll.filter(p => p.month === i + 1);
        return {
          month: i + 1,
          count: monthPayroll.length,
          total: monthPayroll.reduce((sum, p) => sum + p.netPay, 0)
        };
      })
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching payroll stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Recalculate payroll for a specific record
const recalculatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    // Get attendance data for the month to recalculate working hours
    const startDate = new Date(payroll.year, payroll.month - 1, 1);
    const endDate = new Date(payroll.year, payroll.month, 0, 23, 59, 59, 999);
    
    const attendanceData = await Attendance.find({
      staffId: payroll.staffId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Recalculate working days and hours
    payroll.totalWorkingDays = attendanceData.length;
    payroll.totalWorkingHours = attendanceData.reduce((sum, a) => sum + (a.totalHours || 0), 0);
    
    console.log(`Recalculating payroll for ${payroll.staffId} - Month: ${payroll.month}, Year: ${payroll.year}`);
    console.log(`Found ${attendanceData.length} attendance records, Total hours: ${payroll.totalWorkingHours}`);
    
    // Recalculate payroll
    payroll.calculatePayroll();
    await payroll.save();
    
    const populatedPayroll = await Payroll.findById(payroll._id)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName');
    
    res.json(populatedPayroll);
  } catch (error) {
    console.error('Error recalculating payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Refresh all payroll records for a month (fix zero values)
const refreshPayrollForMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    
    console.log(`Refreshing payroll for month: ${month}, year: ${year}`);
    
    // Get all payroll records for the month
    const payrollRecords = await Payroll.find({ month: parseInt(month), year: parseInt(year) });
    
    if (payrollRecords.length === 0) {
      return res.status(404).json({ message: 'No payroll records found for this month' });
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    
    // Get all attendance data for the month
    const attendanceData = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('staffId');
    
    console.log(`Found ${attendanceData.length} attendance records for ${month}/${year}`);
    
    const updatedPayrolls = [];
    
    for (const payroll of payrollRecords) {
      // Find attendance records for this staff member
      const memberAttendance = attendanceData.filter(a => 
        a.staffId._id.toString() === payroll.staffId.toString()
      );
      
      // Update working days and hours
      payroll.totalWorkingDays = memberAttendance.length;
      payroll.totalWorkingHours = memberAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);
      
      console.log(`Staff ${payroll.staffId}: ${memberAttendance.length} days, ${payroll.totalWorkingHours} hours`);
      
      // Recalculate payroll
      payroll.calculatePayroll();
      await payroll.save();
      
      const populatedPayroll = await Payroll.findById(payroll._id)
        .populate('staffId', 'firstName lastName email role')
        .populate('approvedBy', 'firstName lastName');
      
      updatedPayrolls.push(populatedPayroll);
    }
    
    res.json({
      message: `Payroll refreshed for ${month}/${year}`,
      updatedCount: updatedPayrolls.length,
      payroll: updatedPayrolls
    });
    
  } catch (error) {
    console.error('Error refreshing payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getAllPayroll,
  getPayrollByStaff,
  getPayrollByMonth,
  generatePayroll,
  createOrUpdatePayroll,
  updatePayrollStatus,
  deletePayroll,
  getPayrollStats,
  recalculatePayroll,
  refreshPayrollForMonth
};
