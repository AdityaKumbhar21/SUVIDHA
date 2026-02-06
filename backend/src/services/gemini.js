// src/services/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });




function safeJsonParse(text) {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

async function generate(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}



const classificationSchema = z.object({
  department: z.enum(['ELECTRICITY', 'GAS', 'WATER', 'WASTE', 'MUNICIPAL']),
  complaintType: z.enum([
    'BILLING',
    'OUTAGE',
    'LEAKAGE',
    'NO_SUPPLY',
    'LOW_PRESSURE',
    'METER_ISSUE',
    'MISSED_PICKUP',
    'OVERFLOW',
    'CERTIFICATE',
    'GENERAL',
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'CRITICAL']),
  etaMinutes: z.number().int().positive(),
  isDuplicateLikely: z.boolean(),
  reason: z.string().optional(),
});



async function classifyComplaint(description, language = 'en') {
  try {
    const prompt = `
Analyze this complaint in ${language}:

"${description}"

Return ONLY valid JSON:
{
  "department": "ELECTRICITY|GAS|WATER|WASTE|MUNICIPAL",
  "complaintType": "BILLING|OUTAGE|LEAKAGE|NO_SUPPLY|LOW_PRESSURE|METER_ISSUE|MISSED_PICKUP|OVERFLOW|CERTIFICATE|GENERAL",
  "priority": "LOW|MEDIUM|CRITICAL",
  "etaMinutes": number,
  "isDuplicateLikely": boolean,
  "reason": string
}
`;

    const text = await generate(prompt);
    const parsed = safeJsonParse(text);

    const validated = classificationSchema.safeParse(parsed);

    if (!validated.success) throw new Error('Invalid AI output');

    return validated.data;
  } catch {
    
    return {
      department: 'MUNICIPAL',
      complaintType: 'GENERAL',
      priority: 'MEDIUM',
      etaMinutes: 1440,
      isDuplicateLikely: false,
      reason: 'AI fallback used',
    };
  }
}



async function detectIntent(inputText, language = 'en') {
  try {
    const prompt = `
Detect intent from "${inputText}" in ${language}.
Return JSON: { "intent": string, "params": object }
`;

    const text = await generate(prompt);
    return safeJsonParse(text) || { intent: 'UNKNOWN', params: {} };
  } catch {
    return { intent: 'UNKNOWN', params: {} };
  }
}



async function analyzeSentiment(feedbackText) {
  try {
    const prompt = `
Analyze sentiment of "${feedbackText}".
Return JSON: { "sentiment": "POSITIVE|NEGATIVE|NEUTRAL", "score": number }
`;

    const text = await generate(prompt);
    return safeJsonParse(text) || { sentiment: 'NEUTRAL', score: 0.5 };
  } catch {
    return { sentiment: 'NEUTRAL', score: 0.5 };
  }
}


async function predictEta() {
  return { etaMinutes: 1440 }; 
}

module.exports = {
  classifyComplaint,
  detectIntent,
  analyzeSentiment,
  predictEta,
};
