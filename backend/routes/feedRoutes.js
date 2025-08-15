const express = require('express');
const { submitContactForm } = require('../controllers/feedBackController');

const router = express.Router();

// POST /api/feedback - Submit feedback form
router.post('/feedback', submitContactForm);

module.exports = router;