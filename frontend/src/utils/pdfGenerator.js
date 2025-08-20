import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateBookingPDF = (booking, user) => {
  try {
    const doc = new jsPDF();
  
  // Add logo/header
  doc.setFontSize(24);
  doc.setTextColor(34, 139, 34); // Green color
  doc.text('Wildlife Safari Management', 105, 20, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Booking Confirmation', 105, 30, { align: 'center' });
  
  // Add line separator
  doc.setDrawColor(34, 139, 34);
  doc.line(20, 35, 190, 35);
  
  // Customer Information
  doc.setFontSize(16);
  doc.setTextColor(34, 139, 34);
  doc.text('Customer Information', 20, 50);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${user?.firstName || ''} ${user?.lastName || ''}`, 20, 60);
  doc.text(`Email: ${user?.email || ''}`, 20, 67);
  doc.text(`Phone: ${user?.phone || 'Not provided'}`, 20, 74);
  doc.text(`Country: ${user?.country || 'Not provided'}`, 20, 81);
  
  // Booking Information
  doc.setFontSize(16);
  doc.setTextColor(34, 139, 34);
  doc.text('Booking Details', 20, 100);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Booking ID: ${booking._id}`, 20, 110);
  doc.text(`Package: ${booking.packageDetails?.title || 'Safari Package'}`, 20, 117);
  doc.text(`Location: ${booking.packageDetails?.location || 'N/A'}`, 20, 124);
  doc.text(`Duration: ${booking.packageDetails?.duration || 'N/A'}`, 20, 131);
  doc.text(`Number of People: ${booking.bookingDetails?.numberOfPeople || 'N/A'}`, 20, 138);
  
  // Dates
  doc.text(`Start Date: ${booking.bookingDetails?.startDate ? new Date(booking.bookingDetails.startDate).toLocaleDateString() : 'N/A'}`, 20, 145);
  doc.text(`End Date: ${booking.bookingDetails?.endDate ? new Date(booking.bookingDetails.endDate).toLocaleDateString() : 'N/A'}`, 20, 152);
  
  // Status and Payment
  doc.text(`Status: ${booking.status || 'N/A'}`, 20, 159);
  doc.text(`Payment Status: ${booking.payment ? 'Paid' : 'Pending'}`, 20, 166);
  
  // Price Information
  doc.setFontSize(16);
  doc.setTextColor(34, 139, 34);
  doc.text('Price Information', 20, 185);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Price: LKR ${booking.totalPrice?.toLocaleString() || 'N/A'}`, 20, 195);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Generated on: ' + new Date().toLocaleString(), 20, 280);
  doc.text('Thank you for choosing Wildlife Safari Management!', 105, 280, { align: 'center' });
  
  // Save the PDF
  const fileName = `booking_${booking._id}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
