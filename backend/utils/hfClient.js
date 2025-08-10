const axios = require('axios');

const HF_API_URL = (model) => `https://api-inference.huggingface.co/models/${model}`;

async function generateWithHF(model, apiKey, prompt, timeout = 10000) {
  try {
    const res = await axios.post(
      HF_API_URL(model),
      { inputs: prompt, options: { wait_for_model: true } },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout
      }
    );

    // Response shape differs by model. Commonly res.data is string or object.
    if (!res.data) return null;

    // Many HF text-generation responses include a plain string:
    if (typeof res.data === 'string') return res.data;

    // Some models return array with generated_text or text field:
    if (Array.isArray(res.data) && res.data[0]?.generated_text) {
      return res.data[0].generated_text;
    }
    if (res.data.generated_text) return res.data.generated_text;
    if (res.data[0]?.text) return res.data[0].text;

    // As a fallback, stringify
    return typeof res.data === 'object' ? JSON.stringify(res.data) : String(res.data);
  } catch (err) {
    // bubble up error to let caller fallback
    // console.error('HF error:', err?.response?.data || err.message);
    throw err;
  }
}

module.exports = { generateWithHF };
