import ContactMessage from '../models/ContactMessage.js';

// Create a new contact message
const createContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: firstName, lastName, email, subject, message'
      });
    }

    // Create new contact message
    const contactMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message
    });

    await contactMessage.save();

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: contactMessage
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send contact message',
      error: error.message
    });
  }
};

// Get all contact messages (admin only)
const getAllContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'repliedBy',
        select: 'firstName lastName email'
      }
    };

    const contactMessages = await ContactMessage.paginate(filter, options);

    res.status(200).json({
      success: true,
      data: contactMessages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages',
      error: error.message
    });
  }
};

// Get a single contact message by ID
const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contactMessage = await ContactMessage.findById(id)
      .populate('repliedBy', 'firstName lastName email');

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contactMessage
    });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message',
      error: error.message
    });
  }
};

// Update contact message status and admin notes
const updateContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, adminNotes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    // If status is being set to 'replied', update repliedAt and repliedBy
    if (status === 'replied') {
      updateData.repliedAt = new Date();
      updateData.repliedBy = req.user.id; // Assuming user is authenticated
    }

    const contactMessage = await ContactMessage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('repliedBy', 'firstName lastName email');

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message updated successfully',
      data: contactMessage
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message',
      error: error.message
    });
  }
};

// Delete a contact message
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contactMessage = await ContactMessage.findByIdAndDelete(id);

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message',
      error: error.message
    });
  }
};

// Get contact message statistics
const getContactMessageStats = async (req, res) => {
  try {
    const stats = await ContactMessage.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalMessages = await ContactMessage.countDocuments();
    const newMessages = await ContactMessage.countDocuments({ status: 'new' });
    const todayMessages = await ContactMessage.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    const statsObject = {
      total: totalMessages,
      new: newMessages,
      today: todayMessages,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      data: statsObject
    });
  } catch (error) {
    console.error('Error fetching contact message stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message statistics',
      error: error.message
    });
  }
};

// Get contact messages for a specific user
const getUserContactMessages = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const filter = { email: email.toLowerCase() };

    const contactMessages = await ContactMessage.paginate(filter, options);

    res.status(200).json({
      success: true,
      data: contactMessages
    });
  } catch (error) {
    console.error('Error fetching user contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user contact messages',
      error: error.message
    });
  }
};

export {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
  getContactMessageStats,
  getUserContactMessages
};
