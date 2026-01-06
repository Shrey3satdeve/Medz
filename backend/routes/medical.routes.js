const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/medical.controller');

// Get all symptoms
router.get('/symptoms', medicalController.getAllSymptoms);

// Get specific symptom details
router.get('/symptoms/:symptomName', medicalController.getSymptomDetails);

// Add new symptom (admin only)
router.post('/symptoms', medicalController.addSymptom);

// Update symptom (admin only)
router.put('/symptoms/:symptomName', medicalController.updateSymptom);

// Delete symptom (admin only)
router.delete('/symptoms/:symptomName', medicalController.deleteSymptom);

// Search symptoms by keyword
router.get('/search', medicalController.searchSymptoms);

// AI-powered symptom analysis
router.post('/analyze', medicalController.analyzeSymptoms);

module.exports = router;
