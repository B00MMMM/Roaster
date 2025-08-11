const { generateRoast } = require('../utils/hfClient');

// Test endpoint for Groq API
const testGroq = async (req, res) => {
  try {
    console.log('🧪 Testing Groq API...');
    
    // Test with a simple prompt
    const testPrompt = "Generate a funny roast for someone named John in a friendly style.";
    
    console.log('📤 Sending test prompt to Groq:', testPrompt);
    
    const result = await generateRoast(testPrompt);
    
    console.log('✅ Groq API Response received:', result);
    
    res.json({
      success: true,
      message: 'Groq API is working!',
      testPrompt,
      response: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Groq API Test Failed:', error);
    
    res.status(500).json({
      success: false,
      message: 'Groq API test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

// Test endpoint for environment variables
const testEnv = async (req, res) => {
  try {
    console.log('🔍 Testing environment variables...');
    
    const envCheck = {
      GROQ_API_KEY: process.env.GROQ_API_KEY ? 'Set ✅' : 'Missing ❌',
      AI_MODEL: process.env.AI_MODEL || 'Not set',
      AI_TIMEOUT: process.env.AI_TIMEOUT || 'Not set',
      MONGO_URI: process.env.MONGO_URI ? 'Set ✅' : 'Missing ❌',
      PORT: process.env.PORT || 'Not set'
    };
    
    console.log('📋 Environment Check:', envCheck);
    
    res.json({
      success: true,
      message: 'Environment variables check',
      environment: envCheck,
      nodeEnv: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Environment Test Failed:', error);
    
    res.status(500).json({
      success: false,
      message: 'Environment test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Simple health check
const healthCheck = async (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
};

module.exports = {
  testGroq,
  testEnv,
  healthCheck
};
