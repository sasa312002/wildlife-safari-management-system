import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    position: { 
      type: String, 
      required: true,
      enum: ['admin', 'driver', 'guide', 'manager', 'receptionist']
    },
    department: { 
      type: String, 
      required: true,
      enum: ['management', 'operations', 'customer_service', 'transportation']
    },
    employeeId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    hireDate: { 
      type: Date, 
      default: Date.now 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    permissions: [{
      type: String,
      enum: ['manage_users', 'manage_bookings', 'manage_packages', 'view_reports', 'manage_staff']
    }]
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
