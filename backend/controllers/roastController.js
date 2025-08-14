const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const Roast = require('../models/Roast');
const User = require('../models/User');
const Person = require('../models/Person');

// Fallback roasts in case everything else fails
const localFallbackRoasts = [
  "Hey {name}, you're like a participation trophy.\nEveryone gets one, but nobody really wants it! 🏆😂",
  "Yo {name}, if you were any more basic,\nyou'd be a pH strip! 🧪😆",
  "{name}, you're like Monday morning.\nNobody's excited to see you! ☕😴",
  "Listen {name}, you've got the personality\nof unsalted crackers! 🍘😊",
  "Oh {name}, you're like a broken GPS.\nAlways lost and giving wrong directions! 🧭🤦‍♂️",
  "Hey {name}, you're like a software update.\nEveryone ignores you until there's a problem! 💻😅",
  "{name}, you're like a math problem.\nComplicated, confusing, and most people skip you! 🧮😂",
  "Sup {name}, you're like a group project.\nSomeone always has to carry you! 📚🎒"
];

// Check if user is authenticated
async function checkAuthentication(req) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    return user;
  } catch (error) {
    return null;
  }
}

// Get person details for the user
async function getPersonDetails(userId, personName) {
  try {
    if (!userId || !personName) return null;
    
    const person = await Person.findOne({ 
      userId: userId, 
      name: { $regex: new RegExp(personName, 'i') } 
    }).populate('traits');
    
    return person;
  } catch (error) {
    console.error('Error fetching person details:', error);
    return null;
  }
}

// Craft personalized prompts based on person details
function craftPersonalizedPrompt(name, mode, personDetails) {
  const normalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
  
  let personalContext = '';
  if (personDetails) {
    const traits = personDetails.traits?.map(t => t.name).join(', ') || '';
    const skinColor = personDetails.skinColor || '';
    const animalType = personDetails.animalType || '';
    
    personalContext = `
Context about ${name}: 
- Appearance: ${skinColor ? `${skinColor} skin` : 'No specific appearance details'}
- Personality/traits: ${traits || 'No specific traits'}
- Animal comparison: ${animalType ? `Looks like a ${animalType}` : 'No animal comparison'}

Use these specific details to create a highly personalized roast that references their actual characteristics.`;
  }

  const basePrompts = {
    Savage: `Create a 1 line, savage roast for someone named ${name}. Make it witty, clever, and brutal. ${personalContext ? 'IMPORTANT: ' + personalContext : ''} MAXIMUM 1 line only. Use modern slang and make it sting. Be concise and punchy.`,
    Friendly: `Create a 1 line, friendly, light-hearted roast for someone named ${name}. ${personalContext ? 'IMPORTANT: ' + personalContext : ''} Make it funny and teasing but warm and affectionate. Like something you'd say to your best friend. MAXIMUM 1 line only. Be concise and sweet.`,
    Professional: `Create a 1 line, professional but humorous roast for someone named ${name}. ${personalContext ? 'IMPORTANT: ' + personalContext : ''} Make it workplace-appropriate, clever, and funny. Think office banter that's witty but respectful. MAXIMUM 1 line only. Be concise and professional.`,
    Random: `Create a 1 line, completely random and absurd roast for someone named ${name}. ${personalContext ? 'IMPORTANT: ' + personalContext : ''} Be weird, unexpected, and hilariously nonsensical. Make it so random it's funny. MAXIMUM 2 lines only. Be concise and weird.`,
    Witty: `Create a 1 line, razor-sharp witty roast for someone named ${name}. ${personalContext ? 'IMPORTANT: ' + personalContext : ''} Make it clever, wordplay-driven, and smart — like a master of sarcasm would say. MAXIMUM 1 line only. Be concise and clever.`,
    Gentle: `Create a 1 line, gentle roast for someone named ${name}. ${personalContext ? 'IMPORTANT: ' + personalContext : ''} Make it soft, playful, and harmless — like a friendly tease that still gets a laugh. MAXIMUM 1 line only. Be concise and kind.`,
    Epic: `Create a 1 line, epic roast for someone named ${name}. ${personalContext ? 'IMPORTANT: ' + personalContext : ''} Make it grand, over-the-top, and dramatic — like an insult from a fantasy hero or epic poem. MAXIMUM 1 line only. Be concise but powerful.`,
    Classic: `Create a 1 line, classic roast for someone named ${name}. ${personalContext ? 'IMPORTANT: ' + personalContext : ''} Make it timeless, old-school, and elegant — like something Oscar Wilde or Mark Twain might say. MAXIMUM 1 line only. Be concise and refined.`
  };
  
  const prompt = basePrompts[normalizedMode] || basePrompts.Savage;
  console.log(`🎯 Generated ${personalContext ? 'PERSONALIZED' : 'generic'} prompt for mode '${mode}':`, prompt.substring(0, 150) + '...');
  return prompt;
}

// Legacy prompt for non-authenticated users
function craftPrompt(name, mode) {
  return craftPersonalizedPrompt(name, mode, null);
}

// Generate roast using Groq API
async function generateWithGroq(model, apiKey, prompt, timeout = 15000) {
  console.log(`🚀 Making Groq API call with model: ${model}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: model,
        temperature: 0.9,
        max_tokens: 60,
        top_p: 1,
        stop: null,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Groq API Error ${response.status}:`, errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Groq API Response received:', {
      choices: data.choices?.length || 0,
      usage: data.usage
    });

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No choices returned from Groq API');
    }

    const content = data.choices[0].message?.content;
    if (!content) {
      throw new Error('No content in Groq API response');
    }

    console.log(`📝 Generated content: "${content.substring(0, 100)}..."`);
    
    // Clean the content by removing surrounding quotes and extra whitespace
    let cleanedContent = content.trim();
    
    // Remove surrounding quotes if present
    if ((cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) ||
        (cleanedContent.startsWith("'") && cleanedContent.endsWith("'"))) {
      cleanedContent = cleanedContent.slice(1, -1).trim();
    }
    
    return cleanedContent;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`Groq API timeout after ${timeout}ms`);
    }
    
    console.error('❌ Groq API Error:', error.message);
    throw error;
  }
}

// Get random roast from database
async function getRandomRoastFromDB() {
  try {
    const count = await Roast.countDocuments();
    if (count === 0) {
      console.log('📭 No roasts found in database');
      return null;
    }
    
    const random = Math.floor(Math.random() * count);
    const roast = await Roast.findOne().skip(random);
    console.log(`🎲 Found database roast: "${roast?.text?.substring(0, 50)}..."`);
    return roast?.text || null;
  } catch (error) {
    console.error('❌ Database query error:', error.message);
    return null;
  }
}

// Main controller function with enhanced logic
async function generateRoast(req, res) {
  console.log('🎯 ROAST REQUEST RECEIVED!', { 
    method: req.method,
    body: req.body, 
    headers: req.headers['content-type'],
    timestamp: new Date().toISOString() 
  });
  
  if (!req.body) {
    console.log('❌ No request body found - using defaults');
  }
  
  const { name = 'friend', mode = 'savage' } = req.body || {};
  
  // Step 1: Check if user is authenticated
  console.log('🔐 Checking authentication...');
  const user = await checkAuthentication(req);
  
  let prompt;
  let personDetails = null;
  let roastSource = 'generic';
  
  if (user) {
    console.log(`✅ User authenticated: ${user.username} (ID: ${user._id})`);
    
    // Step 2: Check if person details exist for this user and name
    console.log(`👤 Looking for person details for name: ${name}`);
    personDetails = await getPersonDetails(user._id, name);
    
    if (personDetails) {
      console.log(`✅ Found person details for ${name}:`, {
        skinColor: personDetails.skinColor,
        animalType: personDetails.animalType,
        traits: personDetails.traits?.map(t => t.name)
      });
      
      // Step 3: Create personalized prompt using stored details
      prompt = craftPersonalizedPrompt(name, mode, personDetails);
      roastSource = 'personalized';
    } else {
      console.log(`⚠️ No person details found for ${name} - using generic roast`);
      prompt = craftPrompt(name, mode);
      roastSource = 'authenticated-generic';
    }
  } else {
    console.log('🔓 User not authenticated - using generic roast');
    prompt = craftPrompt(name, mode);
    roastSource = 'unauthenticated';
  }
  
  const model = process.env.AI_MODEL || 'mixtral-8x7b-32768';
  const apiKey = process.env.GROQ_API_KEY;
  const backupApiKey = process.env.GROQ_API_KEY_BACKUP;
  const aiTimeout = Number(process.env.AI_TIMEOUT || 15000);

  console.log('🔧 Environment Variables:', {
    AI_MODEL: model,
    GROQ_API_KEY: apiKey ? `${apiKey.substring(0, 7)}...${apiKey.slice(-4)}` : 'undefined',
    GROQ_API_KEY_BACKUP: backupApiKey ? `${backupApiKey.substring(0, 7)}...${backupApiKey.slice(-4)}` : 'undefined',
    AI_TIMEOUT: aiTimeout,
    ROAST_SOURCE: roastSource
  });

  // Try AI generation with primary and backup keys
  const apiKeysToTry = [apiKey, backupApiKey].filter(key => key && key.trim());
  
  for (let i = 0; i < apiKeysToTry.length; i++) {
    const currentKey = apiKeysToTry[i];
    const keyType = i === 0 ? 'primary' : 'backup';
    
    try {
      console.log(`🤖 Attempting AI generation with ${keyType} key using Groq model: ${model}`);
      
      const aiText = await generateWithGroq(model, currentKey, prompt, aiTimeout);
      console.log(`🎯 AI Response from ${keyType} key: "${aiText}"`);
      console.log(`📏 AI Response length: ${aiText?.length || 0}`);
      
      if (aiText && aiText.trim().length > 10) {
        const roast = aiText.replace(/\{name\}/g, name).trim();
        console.log(`✅ Using AI roast from ${keyType} key: "${roast}"`);
        return res.json({ 
          roast, 
          source: `ai-${keyType}`,
          roastType: roastSource,
          personalized: !!personDetails,
          userId: user?._id,
          personId: personDetails?._id
        });
      }
      console.log(`❌ AI output from ${keyType} key too short, trying next option`);
    } catch (err) {
      console.error(`❌ AI failed with ${keyType} key: ${err.message}`);
      if (i === apiKeysToTry.length - 1) {
        console.log(`❌ All API keys failed, falling back to database`);
      }
    }
  }
  
  if (apiKeysToTry.length === 0) {
    console.log(`❌ No valid GROQ_API_KEY found, skipping AI generation`);
  }

  // Try database fallback
  try {
    console.log(`🗄️ Trying database fallback...`);
    const dbRoast = await getRandomRoastFromDB();
    if (dbRoast) {
      const roast = dbRoast.replace(/\{name\}/g, name);
      console.log(`✅ Using DB roast: "${roast}"`);
      return res.json({ 
        roast, 
        source: 'db',
        roastType: roastSource,
        personalized: !!personDetails,
        userId: user?._id,
        personId: personDetails?._id
      });
    }
    console.log(`❌ No roasts found in database`);
  } catch (err) {
    console.error(`❌ Database error: ${err.message}`, { stack: err.stack });
  }

  // Use local fallback
  console.log(`🏠 Using local fallback roast`);
  const local = localFallbackRoasts[Math.floor(Math.random() * localFallbackRoasts.length)];
  const finalRoast = local.replace(/\{name\}/g, name);
  console.log(`✅ Final roast: "${finalRoast}"`);
  return res.json({ 
    roast: finalRoast, 
    source: 'local',
    roastType: roastSource,
    personalized: !!personDetails,
    userId: user?._id,
    personId: personDetails?._id
  });
}

module.exports = {
  generateRoast
};