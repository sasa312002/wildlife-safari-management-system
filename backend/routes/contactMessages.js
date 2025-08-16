import express from 'express';
const router = express.Router();
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
  getContactMessageStats,
  getUserContactMessages
} from '../controllers/contactMessageController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

// Public route - anyone can submit a contact message
router.post('/', createContactMessage);

// User route - get user's own contact messages
router.get('/user/:email', authenticateToken, getUserContactMessages);

// Admin routes - require authentication and admin role
router.get('/', authenticateToken, requireAdmin, getAllContactMessages);
router.get('/stats', authenticateToken, requireAdmin, getContactMessageStats);
router.get('/:id', authenticateToken, requireAdmin, getContactMessageById);
router.put('/:id', authenticateToken, requireAdmin, updateContactMessage);
router.delete('/:id', authenticateToken, requireAdmin, deleteContactMessage);

export default router;
