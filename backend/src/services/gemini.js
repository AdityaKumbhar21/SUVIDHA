// src/services/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function classifyComplaint(description, language = 'en') {
  const prompt = `
You are an expert in classifying civic complaints for a government service portal.

Analyze this complaint in ${language}:
"${description}"

Return **only** valid JSON (no markdown, no explanation) with this exact structure:

{
  "department": "ELECTRICITY" | "GAS" | "WATER" | "WASTE" | "MUNICIPAL",
  "complaintType": "BILLING" | "OUTAGE" | "LEAKAGE" | "NO_SUPPLY" | "LOW_PRESSURE" | "METER_ISSUE" | "MISSED_PICKUP" | "OVERFLOW" | "CERTIFICATE" | "GENERAL",
  "priority": "LOW" | "MEDIUM" | "CRITICAL",
  "etaMinutes": number,
  "isDuplicateLikely": boolean,
  "reason": "very short reason for classification"
}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    
    const cleaned = text.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.error('Gemini classification error:', err);
    
    return {
      department: 'GENERAL',
      complaintType: 'GENERAL',
      priority: 'MEDIUM',
      etaMinutes: 1440,
      isDuplicateLikely: false,
      reason: 'AI classification failed - fallback used',
    };
  }
}

module.exports = { classifyComplaint };