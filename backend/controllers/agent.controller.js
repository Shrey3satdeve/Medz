// AI Agent Controller
const axios = require('axios');

// n8n webhook URL (update this with your actual n8n webhook URL)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/ai-agent';

// Send query to AI agent via n8n
exports.queryAgent = async (req, res, next) => {
  try {
    const { query, context } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Send request to n8n webhook
    const response = await axios.post(N8N_WEBHOOK_URL, {
      query,
      context: context || {},
      timestamp: new Date().toISOString()
    }, {
      timeout: 30000 // 30 second timeout
    });

    res.json({
      success: true,
      response: response.data
    });

  } catch (err) {
    console.error('AI Agent error:', err.message);
    
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI Agent service unavailable. Please check n8n is running.' 
      });
    }
    
    next(err);
  }
};

// Get recommended tests based on symptoms (AI-powered)
exports.recommendTests = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ error: 'Symptoms array is required' });
    }

    // Send to AI agent for analysis
    const response = await axios.post(N8N_WEBHOOK_URL, {
      action: 'recommend_tests',
      symptoms,
      timestamp: new Date().toISOString()
    }, {
      timeout: 30000
    });

    res.json({
      success: true,
      recommendations: response.data
    });

  } catch (err) {
    console.error('Test recommendation error:', err.message);
    next(err);
  }
};

// Chat with AI assistant
exports.chat = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await axios.post(N8N_WEBHOOK_URL, {
      action: 'chat',
      message,
      conversationId: conversationId || null,
      timestamp: new Date().toISOString()
    }, {
      timeout: 30000
    });

    res.json({
      success: true,
      reply: response.data.reply,
      conversationId: response.data.conversationId
    });

  } catch (err) {
    console.error('Chat error:', err.message);
    next(err);
  }
};
