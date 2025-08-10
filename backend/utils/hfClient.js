const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function generateWithGroq(model, apiKey, prompt, timeout = 10000) {
  try {
    console.log(`📡 Sending request to Groq API with model: ${model}`);
    const res = await axios.post(
      GROQ_API_URL,
      {
        model, // Use the passed model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.9
      },
      {
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout
      }
    );

    if (res.data?.choices?.[0]?.message?.content) {
      const content = res.data.choices[0].message.content.trim();
      console.log(`📥 Groq API response: "${content}"`);
      return content;
    }
    
    console.log('⚠️ No valid content in Groq response:', res.data);
    return null;
  } catch (err) {
    console.error(`❌ Groq API error: ${err.message}`, {
      status: err.response?.status,
      data: err.response?.data
    });
    throw err;
  }
}

async function generateWithHF(model, apiKey, prompt, timeout = 10000) {
  return generateWithGroq(model, apiKey, prompt, timeout);
}

module.exports = { generateWithHF, generateWithGroq };