import { GoogleGenAI } from '@google/genai';

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
};

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // GET: Health / Status check
  if (req.method === 'GET') {
    const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');
    return res.status(200).json({
      success: true,
      isConfigured,
      model: 'gemini-2.5-flash',
      message: isConfigured
        ? 'Gemini API is ready and configured on Vercel.'
        : 'GEMINI_API_KEY environment variable is not configured. Add GEMINI_API_KEY in Vercel to activate AI capabilities.'
    });
  }

  // POST: Secure server-side content generation
  if (req.method === 'POST') {
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please add GEMINI_API_KEY in your Vercel project environment variables.',
        isConfigured: false
      });
    }

    let parsedBody = req.body;
    if (typeof parsedBody === 'string') {
      try {
        parsedBody = JSON.parse(parsedBody);
      } catch {
        parsedBody = {};
      }
    }

    const { prompt, systemInstruction, temperature, model } = parsedBody || {};
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      let modelToUse = model || 'gemini-2.5-flash';
      if (modelToUse.includes('1.5') || modelToUse.includes('2.0')) {
        modelToUse = 'gemini-2.5-flash';
      }

      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt.trim(),
        config: {
          systemInstruction: systemInstruction || 'You are an expert travel copywriter, itinerary planner, and content assistant for Spiky Cabs & Himalayan Travels. You specialize in Darjeeling, Gangtok, North Sikkim, Pelling, Kalimpong, and Bhutan tourism. Provide clear, professional, engaging text with bullet points where appropriate.',
          temperature: typeof temperature === 'number' ? temperature : 0.7,
        }
      });

      return res.status(200).json({
        success: true,
        text: response.text || '',
        model: modelToUse
      });
    } catch (err: any) {
      console.error('[Vercel Gemini Serverless Error]:', err);
      let errorMessage = err?.message || 'An error occurred while communicating with Google AI Studio Gemini API.';
      errorMessage = errorMessage.replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=REDACTED');
      return res.status(500).json({
        error: errorMessage
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
