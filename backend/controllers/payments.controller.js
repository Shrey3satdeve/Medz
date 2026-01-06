// Payment controller using Razorpay
const Razorpay = require('razorpay');
const crypto = require('crypto');
const emailService = require('../services/email.service');
const smsService = require('../services/sms.service');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret',
});

// Create Razorpay order
exports.createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID, // Send to frontend for checkout
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    next(err);
  }
};

// Verify payment signature
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      // Update order status in database here
      
      // Send payment confirmation notifications
      if (req.body.userEmail) {
        await emailService.sendOrderConfirmation(req.body.userEmail, {
          orderId: razorpay_order_id,
          items: req.body.items || [],
          total: req.body.amount || 0
        });
      }
      
      if (req.body.userPhone) {
        await smsService.sendOrderConfirmation(
          req.body.userPhone,
          razorpay_order_id,
          req.body.amount || 0
        );
      }
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    next(err);
  }
};

// Razorpay webhook handler
exports.webhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature === expectedSignature) {
      const event = req.body.event;
      const payload = req.body.payload.payment.entity;

      console.log('Webhook event:', event);
      console.log('Payment details:', payload);

      // Handle different events
      switch (event) {
        case 'payment.captured':
          // Update order status to PAID
          console.log('Payment captured:', payload.id);
          break;
        case 'payment.failed':
          // Update order status to FAILED
          console.log('Payment failed:', payload.id);
          break;
        default:
          console.log('Unhandled event:', event);
      }

      res.json({ status: 'ok' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Webhook error:', err);
    next(err);
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { payment_id } = req.params;

    const payment = await razorpay.payments.fetch(payment_id);

    res.json({
      success: true,
      payment,
    });
  } catch (err) {
    console.error('Error fetching payment:', err);
    next(err);
  }
};
