# Driver Booking Acceptance System

## Overview

The Driver Booking Acceptance System allows drivers to view and accept available bookings after customers have successfully made payments. This system provides a seamless workflow from booking creation to driver assignment.

## Features

### 1. Booking Status Flow
- **Pending**: Initial state when booking is placed
- **Payment Confirmed**: Payment has been verified via Stripe
- **Driver Assigned**: Driver has accepted the booking
- **Confirmed**: Booking confirmed by staff (future enhancement)
- **In Progress**: Safari is currently happening
- **Completed**: Safari completed successfully
- **Cancelled**: Booking has been cancelled

### 2. Driver Dashboard Features
- **Available Bookings**: View all bookings with "Payment Confirmed" status that haven't been assigned to a driver
- **My Accepted Bookings**: View all bookings assigned to the logged-in driver
- **Accept Booking**: Drivers can accept available bookings
- **Complete Booking**: Drivers can mark their bookings as completed
- **Real-time Statistics**: Dashboard shows total trips, completed trips, pending trips, and available bookings

### 3. API Endpoints

#### Driver-specific endpoints:
- `GET /api/bookings/driver/pending` - Get pending bookings available for drivers
- `GET /api/bookings/driver/accepted` - Get driver's accepted bookings
- `POST /api/bookings/driver/accept/:bookingId` - Accept a booking
- `POST /api/bookings/driver/complete/:bookingId` - Complete a booking

#### Updated booking model fields:
- `driverId`: Reference to the assigned driver (Staff model)
- `driverAccepted`: Boolean indicating if driver has accepted
- `driverAcceptedAt`: Timestamp when driver accepted the booking

## How It Works

### 1. Customer Booking Flow
1. Customer creates a booking and pays via Stripe
2. Payment is verified and booking status becomes "Payment Confirmed"
3. Booking appears in the "Available Bookings" section for drivers
4. Customer receives confirmation email with booking details

### 2. Driver Assignment Flow
1. Driver logs into their dashboard
2. Driver sees available bookings in the "Available Bookings" section
3. Driver clicks "Accept" on a booking they want to take
4. Booking is assigned to the driver and status becomes "Driver Assigned"
5. Booking moves to "My Accepted Bookings" section
6. Driver can complete the booking when the safari is finished

### 3. Booking Management
- Drivers can only accept bookings that are in "Payment Confirmed" status
- Once accepted, only the assigned driver can complete the booking
- Completed bookings show in the driver's statistics

## Testing the System

### 1. Create Test Data
Run the test script to create sample data:
```bash
cd backend
node scripts/test-driver-booking.js
```

### 2. Test the Flow
1. Login as the test driver: `testdriver@example.com`
2. Navigate to the driver dashboard
3. View available bookings
4. Accept a booking
5. Verify it appears in "My Accepted Bookings"
6. Complete the booking

### 3. Clean Up Test Data
```bash
cd backend
node scripts/test-driver-booking.js --cleanup
```

## Security Features

- **Role-based Access**: Only users with `role: 'driver'` can access driver endpoints
- **Authentication Required**: All driver endpoints require valid authentication
- **Authorization**: Drivers can only accept/complete their own bookings
- **Status Validation**: Bookings can only be accepted if they're in the correct status

## Frontend Components

### DriverDashboard.jsx
- Main dashboard for drivers
- Shows available and accepted bookings
- Real-time statistics
- Accept and complete booking functionality

### Updated BookingSuccessPage.jsx
- Added information about driver assignment
- Explains the next steps in the booking process

## API Integration

### Frontend API Methods
```javascript
// Get pending bookings for drivers
bookingApi.getPendingBookingsForDriver()

// Get driver's accepted bookings
bookingApi.getDriverAcceptedBookings()

// Accept a booking
bookingApi.acceptBooking(bookingId)

// Complete a booking
bookingApi.completeBooking(bookingId)
```

## Future Enhancements

1. **Real-time Notifications**: Push notifications when new bookings become available
2. **Booking Preferences**: Allow drivers to set preferences for booking types/locations
3. **Rating System**: Customer ratings for drivers after completed bookings
4. **Scheduling**: Advanced scheduling and calendar integration
5. **Communication**: In-app messaging between drivers and customers
6. **Analytics**: Detailed reporting and analytics for drivers

## Database Schema Changes

### Booking Model Updates
```javascript
// New fields added to Booking schema
driverId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Staff',
  default: null
},
driverAccepted: {
  type: Boolean,
  default: false
},
driverAcceptedAt: {
  type: Date,
  default: null
}
```

### Status Enum Updates
```javascript
status: { 
  type: String, 
  enum: [
    'Pending',
    'Payment Confirmed',
    'Driver Assigned',  // New status
    'Confirmed',
    'In Progress',
    'Completed',
    'Cancelled'
  ], 
  default: 'Pending' 
}
```

## Error Handling

The system includes comprehensive error handling for:
- Invalid booking states
- Unauthorized access attempts
- Network errors
- Database connection issues
- Invalid driver assignments

## Performance Considerations

- Efficient database queries with proper indexing
- Pagination for large booking lists
- Optimized API responses with populated references
- Real-time data updates without full page refreshes
