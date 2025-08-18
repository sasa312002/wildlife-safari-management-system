import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030
  },
  // Basic salary information
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  // Working hours and calculations
  totalWorkingDays: {
    type: Number,
    default: 0
  },
  totalWorkingHours: {
    type: Number,
    default: 0
  },
  regularHours: {
    type: Number,
    default: 0
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  // Salary components
  regularPay: {
    type: Number,
    default: 0
  },
  overtimePay: {
    type: Number,
    default: 0
  },
  // Deductions and additions
  deductions: {
    type: Number,
    default: 0
  },
  bonuses: {
    type: Number,
    default: 0
  },
  allowances: {
    type: Number,
    default: 0
  },
  // Final calculations
  grossPay: {
    type: Number,
    default: 0
  },
  netPay: {
    type: Number,
    default: 0
  },
  // Status and approval
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'paid', 'cancelled'],
    default: 'draft'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },
  // Additional information
  notes: {
    type: String,
    default: ''
  },
  // Payment method
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'check'],
    default: 'bank_transfer'
  },
  // Bank details for transfer
  bankDetails: {
    accountNumber: String,
    bankName: String,
    branchCode: String
  }
}, {
  timestamps: true
});

// Compound index to ensure one payroll record per staff per month
payrollSchema.index({ staffId: 1, month: 1, year: 1 }, { unique: true });

// Virtual for formatted month-year
payrollSchema.virtual('monthYear').get(function() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[this.month - 1]} ${this.year}`;
});

// Virtual for formatted status
payrollSchema.virtual('statusFormatted').get(function() {
  return this.status.charAt(0).toUpperCase() + this.status.slice(1);
});

// Method to calculate payroll
payrollSchema.methods.calculatePayroll = function() {
  // Calculate regular pay (assuming 8 hours per day, 5 days per week)
  const standardHoursPerDay = 8;
  const standardDaysPerMonth = 22; // Average working days per month
  
  this.regularHours = Math.min(this.totalWorkingHours, standardDaysPerMonth * standardHoursPerDay);
  this.overtimeHours = Math.max(0, this.totalWorkingHours - this.regularHours);
  
  // Calculate pay rates
  const hourlyRate = this.basicSalary / (standardDaysPerMonth * standardHoursPerDay);
  const overtimeRate = hourlyRate * 1.5; // 1.5x for overtime
  
  this.regularPay = this.regularHours * hourlyRate;
  this.overtimePay = this.overtimeHours * overtimeRate;
  
  // Calculate gross and net pay
  this.grossPay = this.regularPay + this.overtimePay + this.bonuses + this.allowances;
  this.netPay = this.grossPay - this.deductions;
  
  return {
    regularPay: this.regularPay,
    overtimePay: this.overtimePay,
    grossPay: this.grossPay,
    netPay: this.netPay
  };
};

// Pre-save middleware to calculate payroll
payrollSchema.pre('save', function(next) {
  if (this.isModified('totalWorkingHours') || this.isModified('basicSalary')) {
    this.calculatePayroll();
  }
  next();
});

const Payroll = mongoose.model('Payroll', payrollSchema);

export default Payroll;
