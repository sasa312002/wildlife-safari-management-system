import express from 'express';
import { 
    createStripeCheckout, 
    verifyStripePayment, 
    getUserBookings, 
    getAllBookings, 
    getBookingDetails, 
    updateBookingStatus,
    getPendingBookingsForDriver,
    getDriverAcceptedBookings,
    acceptBooking,
    completeBooking,
    testDriverAuth
} from '../controllers/bookingController.js';
import { authenticateToken as auth } from '../middleware/auth.js';

const bookingRouter = express.Router();

// User routes (require authentication)
bookingRouter.post('/stripe-checkout', auth, createStripeCheckout);
bookingRouter.post('/verify-payment', verifyStripePayment); // No auth required for Stripe redirect
bookingRouter.get('/user', auth, getUserBookings);
bookingRouter.get('/details/:bookingId', auth, getBookingDetails);

// Driver routes (require authentication)
bookingRouter.get('/driver/test-auth', auth, testDriverAuth);
bookingRouter.get('/driver/pending', auth, getPendingBookingsForDriver);
bookingRouter.get('/driver/accepted', auth, getDriverAcceptedBookings);
bookingRouter.post('/driver/accept/:bookingId', auth, acceptBooking);
bookingRouter.post('/driver/complete/:bookingId', auth, completeBooking);

// Admin/Staff routes (require authentication)
bookingRouter.get('/all', auth, getAllBookings);
bookingRouter.put('/status/:bookingId', auth, updateBookingStatus);

export default bookingRouter;
