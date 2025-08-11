const express = require('express');
const router = express.Router();
const { testGroq, testEnv, healthCheck } = require('../controllers/testController');

// Health check endpoint
router.get('/health', healthCheck);

// Test Groq API
router.get('/groq', testGroq);

// Test environment variables
router.get('/env', testEnv);

module.exports = router;
