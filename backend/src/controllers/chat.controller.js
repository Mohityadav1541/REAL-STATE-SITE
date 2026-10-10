const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handleChat = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are a helpful and professional real estate assistant for 'SS Developers'.
SS Developers specializes in premium industrial real estate, plots, warehouses, and built-to-suit factories.
Currently, they have two main projects:
1. SS1 (SS Industrial Park 1): Located on Ubhrat Road, Maroli. It's a 50+ acre master-planned industrial park with wide 60-feet roads, power substations, water treatment, and is ideal for heavy engineering and textiles.
2. SS3 (SS Industrial Land 3): Located at Hojwala, near the Palsana-Hazira industrial belt. Engineered for high-capacity logistics, advanced manufacturing, and built-to-suit sheds.
Your goal is to answer user queries politely, provide real-time suggestions about industrial plots, and encourage them to contact the team or schedule a site visit.
Keep your answers concise, professional, and directly related to industrial real estate.`;

    // Convert history to Gemini format if needed, but for simplicity we will just provide the context and the recent message.
    let formattedPrompt = systemPrompt + "\n\nUser Message: " + message;
    if (history && history.length > 0) {
      const historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
      formattedPrompt = systemPrompt + "\n\nChat History:\n" + historyText + "\n\nUser Message: " + message;
    }

    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    next(error);
  }
};
