const fetch = require('node-fetch');
const Roast = require('../models/Roast');

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

// Craft different prompts based on mode
function craftPrompt(name, mode) {
  const basePrompts = {
    savage: `Create a short(max 1 line), savage but hilarious roast for someone named ${name}. Make it witty, clever, and brutally funny but not cruel. MAXIMUM 2 lines only. Use modern slang and make it sting but in a playful way. Be concise and punchy.`,
    friendly: `Create a short(max 1 line), friendly, light-hearted roast for someone named ${name}. Make it funny and teasing but warm and affectionate. Like something you'd say to your best friend. MAXIMUM 2 lines only. Be concise and sweet.`,
    professional: `Create a short(max 1 line), professional but humorous roast for someone named ${name}. Make it workplace-appropriate, clever, and funny. Think office banter that's witty but respectful. MAXIMUM 2 lines only. Be concise and professional.`,
    random: `Create a short(max 1 line), completely random and absurd roast for someone named ${name}. Be weird, unexpected, and hilariously nonsensical. Make it so random it's funny. MAXIMUM 2 lines only. Be concise and weird.`
  };
  
  return basePrompts[mode] || basePrompts.savage;
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
    return content.trim();

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

// Main controller function
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
  const prompt = craftPrompt(name, mode);
  const model = process.env.AI_MODEL || 'mixtral-8x7b-32768';
  const apiKey = process.env.GROQ_API_KEY;
  const aiTimeout = Number(process.env.AI_TIMEOUT || 15000);

  console.log('🔧 Environment Variables:', {
    AI_MODEL: model,
    GROQ_API_KEY: apiKey ? `${apiKey.substring(0, 7)}...${apiKey.slice(-4)}` : 'undefined',
    AI_TIMEOUT: aiTimeout
  });

  // Try AI generation first
  if (apiKey) {
    try {
      console.log(`🤖 Attempting AI generation with Groq model: ${model}`);
      console.log(`📝 Prompt: ${prompt}`);
      
      const aiText = await generateWithGroq(model, apiKey, prompt, aiTimeout);
      console.log(`🎯 AI Response: "${aiText}"`);
      console.log(`📏 AI Response length: ${aiText?.length || 0}`);
      
      if (aiText && aiText.trim().length > 10) {
        const roast = aiText.replace(/\{name\}/g, name).trim();
        console.log(`✅ Using AI roast: "${roast}"`);
        return res.json({ roast, source: 'ai' });
      }
      console.log(`❌ AI output too short, falling back to DB`);
    } catch (err) {
      console.error(`❌ AI failed: ${err.message}`);
    }
  } else {
    console.log(`❌ No valid GROQ_API_KEY found, skipping AI generation`);
  }

  // Try database fallback
  try {
    console.log(`🗄️ Trying database fallback...`);
    const dbRoast = await getRandomRoastFromDB();
    if (dbRoast) {
      const roast = dbRoast.replace(/\{name\}/g, name);
      console.log(`✅ Using DB roast: "${roast}"`);
      return res.json({ roast, source: 'db' });
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
  return res.json({ roast: finalRoast, source: 'local' });
}

module.exports = {
  generateRoast
};