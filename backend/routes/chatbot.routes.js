// Chatbot Routes
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

// POST /api/chatbot/chat - Send message to AI
router.post('/chat', chatbotController.chat);

// GET /api/chatbot/suggestions - Get quick reply suggestions
router.get('/suggestions', chatbotController.getSuggestions);

module.exports = router;
