import express from 'express';
import { 
    createStripeCheckout, 
    verifyStripePayment, 
    getUserBookings, 
    getAllBookings, 
    getBookingDetails, 
    updateBookingStatus 
} from '../controllers/bookingController.js';
import { authenticateToken as auth } from '../middleware/auth.js';

const bookingRouter = express.Router();

// User routes (require authentication)
bookingRouter.post('/stripe-checkout', auth, createStripeCheckout);
bookingRouter.post('/verify-payment', verifyStripePayment); // No auth required for Stripe redirect
bookingRouter.get('/user', auth, getUserBookings);
bookingRouter.get('/details/:bookingId', auth, getBookingDetails);

// Admin/Staff routes (require authentication)
bookingRouter.get('/all', auth, getAllBookings);
bookingRouter.put('/status/:bookingId', auth, updateBookingStatus);

export default bookingRouter;
