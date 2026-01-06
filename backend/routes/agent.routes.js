// AI Agent Routes
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');

// General AI query
router.post('/agent/query', agentController.queryAgent);

// Get test recommendations based on symptoms
router.post('/agent/recommend', agentController.recommendTests);

// Chat with AI assistant
router.post('/agent/chat', agentController.chat);

module.exports = router;
