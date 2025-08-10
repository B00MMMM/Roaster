const { generateWithHF } = require('../utils/hfClient');
const Roast = require('../models/Roast');

const localFallbackRoasts = [
  "Hey {name}, you have the personality of a dial tone.",
  "{name}, your Wi-Fi signal is stronger than your arguments.",
  "If being awkward was art, {name} would be a masterpiece.",
  "{name}, you bring everyone to the yard… because they’re curious what’s wrong."
];

function craftPrompt(name, mode = 'savage') {
  // mode can be 'gentle' or 'savage'
  if (mode === 'savage') {
    return `Generate a funny savage roast for someone named ${name}. Maximum 20 words. Be witty but not offensive:`;
  }
  return `Generate a friendly, light-hearted roast for someone named ${name}. Maximum 15 words. Be playful and funny:`;
}

async function getRandomRoastFromDB() {
  const count = await Roast.countDocuments();
  if (!count) return null;
  const rand = Math.floor(Math.random() * count);
  const doc = await Roast.findOne().skip(rand).lean();
  return doc?.text || null;
}

async function generateRoast(req, res) {
  console.log('🎯 ROAST REQUEST RECEIVED!', { body: req.body, timestamp: new Date().toISOString() });
  
  const { name = 'friend', mode = 'savage' } = req.body;

  const prompt = craftPrompt(name, mode);
  const model = process.env.HF_MODEL || 'gpt2';
  const apiKey = process.env.HF_API_KEY;
  const hfTimeout = Number(process.env.HF_TIMEOUT || 10000);

  // Try AI first if API key present
  if (apiKey) {
    try {
      console.log(`🤖 Attempting AI generation with model: ${model}`);
      console.log(`📝 Prompt: ${prompt}`);
      
      const aiText = await generateWithHF(model, apiKey, prompt, hfTimeout);
      console.log(`🎯 AI Response: "${aiText}"`);
      console.log(`📏 AI Response length: ${aiText?.length || 0}`);
      
      if (aiText && aiText.trim().length > 3) {
        // Replace placeholder if model repeats name or not
        const roast = aiText.replace(/\{name\}/g, name).trim();
        console.log(`✅ Using AI roast: "${roast}"`);
        return res.json({ roast, source: 'ai' });
      }
      console.log(`❌ AI output too short or empty, falling back to DB`);
      // if AI output is empty or weird, fall through to DB
    } catch (err) {
      console.log(`❌ AI failed:`, err.message);
      // continue to fallback
    }
  } else {
    console.log(`❌ No HF_API_KEY found, skipping AI generation`);
  }

  // Fallback: try DB
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
    console.log(`❌ Database error:`, err.message);
    // ignore and use local fallback
  }

  // Final fallback: local array
  console.log(`🏠 Using local fallback roast`);
  const local = localFallbackRoasts[Math.floor(Math.random() * localFallbackRoasts.length)];
  const finalRoast = local.replace(/\{name\}/g, name);
  console.log(`✅ Final roast: "${finalRoast}"`);
  return res.json({ roast: finalRoast, source: 'local' });
}

module.exports = { generateRoast };
