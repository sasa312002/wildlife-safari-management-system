# PDF Download Feature for Bookings

## Overview
This feature allows customers to download their individual booking details as a PDF document from their account page.

## Features
- **Individual Booking Downloads**: Each booking has its own download button
- **Professional PDF Layout**: Clean, branded PDF with all booking information
- **Loading States**: Visual feedback during PDF generation
- **Error Handling**: Graceful error handling with user notifications

## Implementation Details

### Files Modified/Created:
1. **`frontend/src/utils/pdfGenerator.js`** - New utility for PDF generation
2. **`frontend/src/pages/UserAccountPage.jsx`** - Added download buttons and functionality

### Dependencies Added:
- `jspdf` - Core PDF generation library
- `jspdf-autotable` - For table formatting (future use)

### PDF Content Includes:
- Company header and branding
- Customer information (name, email, phone, country)
- Booking details (ID, package, location, duration, dates)
- Payment and status information
- Total price
- Generation timestamp
- Professional footer

### User Experience:
- Blue "Download PDF" button for each booking
- Loading spinner during generation
- Automatic file download with descriptive filename
- Error handling with user-friendly messages

## Usage
1. Navigate to "My Account" page
2. Click on "My Bookings" tab
3. Find the booking you want to download
4. Click the "Download PDF" button
5. PDF will be automatically downloaded to your device

## File Naming Convention
PDFs are saved with the format: `booking_[bookingId]_[date].pdf`

## Technical Notes
- PDF generation is client-side using jsPDF
- No server requests required for PDF generation
- Works offline once the page is loaded
- Responsive design maintains consistency with existing UI
