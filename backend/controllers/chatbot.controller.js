// Chatbot Controller - Groq AI Integration
const fetch = require('node-fetch');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt for LabDash health assistant
const SYSTEM_PROMPT = `You are LabDash AI Health Assistant, a friendly and knowledgeable healthcare chatbot for Indian users.

CRITICAL LANGUAGE RULES:
- ALWAYS detect and match the user's language
- If user writes in Hinglish (Hindi + English mix like "CBC test kya hota hai?"), respond in Hinglish
- If user writes in pure Hindi (देवनागरी script), respond in Hindi
- If user writes in Marathi, respond in Marathi
- If user writes in pure English, respond in English
- Hinglish example: "CBC test ek blood test hai jo aapke blood cells count karta hai. Isme RBC, WBC aur platelets check hote hain."

You help users with:
- Information about lab tests (blood tests, urine tests, health checkups, etc.)
- Explaining test results in simple language
- Booking lab tests and home collection
- Medicine and pharma product queries
- Pet care and veterinary lab services
- General health tips and wellness advice

LabDash Services & Pricing:
- Complete Blood Count (CBC) - ₹350
- Lipid Profile - ₹559
- Thyroid Profile (T3, T4, TSH) - ₹499
- Liver Function Test (LFT) - ₹599
- Kidney Function Test (KFT) - ₹549
- HbA1c (Diabetes) - ₹450
- Vitamin D Test - ₹899
- Full Body Checkup - ₹1999
- Home Collection - FREE (available 7AM-9PM)

Guidelines:
- Always be polite, empathetic, and professional
- For serious symptoms, advise users to consult a doctor immediately
- Never diagnose conditions - only provide general information
- Keep responses concise but helpful (2-3 paragraphs max)
- Use emojis to make responses friendly 😊
- When discussing tests, mention approximate prices
- For booking, say "Aap website pe 'Book Now' button click karke ya home collection schedule kar sakte ho"

You represent LabDash - India's trusted healthcare platform for lab tests, medicines, and pet care services.`;

// Chat with AI
exports.chat = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        if (!GROQ_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'AI service not configured'
            });
        }

        // Build messages array with conversation history
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: message }
        ];

        // Call Groq API
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Groq API error:', response.status, errorData);
            return res.status(500).json({
                success: false,
                message: 'AI service temporarily unavailable'
            });
        }

        const data = await response.json();
        const aiMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';

        res.json({
            success: true,
            message: aiMessage,
            usage: data.usage
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again.'
        });
    }
};

// Quick replies / suggestions
exports.getSuggestions = (req, res) => {
    const suggestions = [
        "What lab tests do you offer?",
        "How to book a home collection?",
        "Explain CBC test results",
        "What are your pricing plans?",
        "Pet care services available?",
        "How to upload prescription?",
        "Track my order status",
        "Contact customer support"
    ];

    res.json({
        success: true,
        suggestions
    });
};
