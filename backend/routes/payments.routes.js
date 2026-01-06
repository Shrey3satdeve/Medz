// routes/payments.routes.js
const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller');

// Create Razorpay order
router.post('/payments/create-order', paymentsController.createOrder);

// Verify payment signature
router.post('/payments/verify', paymentsController.verifyPayment);

// Razorpay webhook
router.post('/payments/webhook', paymentsController.webhook);

// Get payment details
router.get('/payments/:payment_id', paymentsController.getPaymentDetails);

module.exports = router;
