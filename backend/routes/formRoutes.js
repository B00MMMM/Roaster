const express = require('express');
const { body, validationResult } = require('express-validator');
const FormSubmission = require('../models/FormSubmission');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/form/submit
// @desc    Submit a form (protected route)
// @access  Private
router.post('/submit', auth, [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('message', 'Message is required').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    // Create new form submission
    const formSubmission = new FormSubmission({
      name,
      email,
      message,
      submittedBy: req.user.id
    });

    await formSubmission.save();

    res.json({
      msg: 'Form submitted successfully',
      submission: {
        id: formSubmission._id,
        name: formSubmission.name,
        email: formSubmission.email,
        message: formSubmission.message,
        status: formSubmission.status,
        createdAt: formSubmission.createdAt
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/form/submissions
// @desc    Get all form submissions for authenticated user
// @access  Private
router.get('/submissions', auth, async (req, res) => {
  try {
    const submissions = await FormSubmission.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;