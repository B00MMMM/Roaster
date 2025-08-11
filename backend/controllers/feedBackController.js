const Feed = require('../models/Feed');

const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Create new feedback entry
    const feedback = new Feed({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });
    
    await feedback.save();
    
    console.log('✅ Feedback submitted successfully:', {
      name: feedback.name,
      email: feedback.email,
      submittedAt: feedback.submittedAt
    });
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We\'ll get back to you soon.',
      data: {
        id: feedback._id,
        name: feedback.name,
        submittedAt: feedback.submittedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An entry with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again later.'
    });
  }
};

module.exports = {
  submitContactForm
};