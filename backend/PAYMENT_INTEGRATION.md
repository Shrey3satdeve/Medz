# Payment Gateway Integration Guide - Razorpay

## 🚀 Razorpay Setup

### 1. Create Razorpay Account

1. Visit https://razorpay.com/
2. Sign up for business account
3. Complete KYC verification

### 2. Get API Credentials

**Test Mode** (for development):
- Dashboard → Settings → API Keys
- Generate Test Key ID and Secret
- No KYC required for test mode

**Live Mode** (for production):
- Complete KYC verification
- Activate Live mode in dashboard
- Generate Live Key ID and Secret

### 3. Configure Environment Variables

Add to `.env` file:

```env
# Test Mode (Development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Live Mode (Production)
# RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
# RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxx
```

## 💳 Integration Flow

### Frontend Flow:
1. User adds items to cart
2. Clicks "Proceed to Checkout"
3. Frontend calls `/api/payments/create-order`
4. Razorpay checkout modal opens
5. User completes payment
6. Frontend receives payment response
7. Frontend calls `/api/payments/verify` to confirm

### Backend Flow:
1. Creates Razorpay order with amount
2. Returns order_id and key_id to frontend
3. Verifies payment signature after completion
4. Sends email/SMS confirmation
5. Updates order status in database

## 🧪 Test Payment

### Test Card Details:

**Success Card**:
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failed Card**:
- Card Number: `4000 0000 0000 0002`
- This will simulate payment failure

### Test UPI:
- UPI ID: `success@razorpay`
- This will auto-succeed

### Test Netbanking:
- Select any bank
- Use test credentials provided

## 📝 API Endpoints

### 1. Create Order
```javascript
POST /api/payments/create-order
Body: {
    "amount": 1000,      // in rupees
    "currency": "INR",
    "receipt": "order_123"
}

Response: {
    "success": true,
    "order_id": "order_xxx",
    "amount": 100000,    // in paise
    "currency": "INR",
    "key_id": "rzp_test_xxx"
}
```

### 2. Verify Payment
```javascript
POST /api/payments/verify
Body: {
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "signature_xxx",
    "userEmail": "user@example.com",
    "userPhone": "+919876543210",
    "amount": 1000,
    "items": [...]
}

Response: {
    "success": true,
    "message": "Payment verified successfully",
    "payment_id": "pay_xxx"
}
```

### 3. Get Payment Details
```javascript
GET /api/payments/:payment_id

Response: {
    "success": true,
    "payment": {
        "id": "pay_xxx",
        "amount": 100000,
        "status": "captured",
        ...
    }
}
```

## 🔔 Webhooks Setup

### 1. Configure Webhook URL

In Razorpay Dashboard:
- Settings → Webhooks
- Add Endpoint: `https://yourdomain.com/api/payments/webhook`
- Select Events:
  - `payment.captured`
  - `payment.failed`
  - `order.paid`

### 2. Webhook Secret

- Copy webhook secret from dashboard
- Add to `.env` as `RAZORPAY_WEBHOOK_SECRET`

## 💰 Pricing

### Transaction Fees:
- **Domestic Cards**: 2% per transaction
- **International Cards**: 3% per transaction
- **UPI**: 0% (₹0)
- **Netbanking**: 2% per transaction
- **Wallets**: 2% per transaction

### No Setup Fees:
- No setup cost
- No annual maintenance
- Pay only for successful transactions

### Settlement:
- T+3 days (automatic)
- Instant settlements available (extra charges)

## 🔒 Security Features

✅ PCI DSS Level 1 Certified
✅ 256-bit SSL Encryption
✅ Two-factor Authentication
✅ Signature Verification
✅ Webhook Security
✅ Fraud Detection

## 📊 Dashboard Features

- Real-time transaction tracking
- Payment analytics
- Refund management
- Settlement reports
- Customer details
- Dispute management

## 🧪 Testing Checklist

- [ ] Test mode credentials added
- [ ] Create order endpoint working
- [ ] Razorpay checkout modal opens
- [ ] Test card payment successful
- [ ] Payment verification working
- [ ] Email notification sent
- [ ] SMS notification sent
- [ ] Order status updated
- [ ] Error handling tested
- [ ] Webhook endpoint configured

## 🚀 Go Live Checklist

- [ ] Complete KYC verification
- [ ] Add bank account details
- [ ] Switch to live API keys
- [ ] Test live payments (small amount)
- [ ] Configure live webhook
- [ ] Update frontend with live keys
- [ ] Enable HTTPS
- [ ] Add GST invoice generation
- [ ] Setup refund policy
- [ ] Monitor first transactions

## 📱 Mobile App Integration

Razorpay provides SDKs for:
- React Native
- Flutter
- Android (Native)
- iOS (Native)

Documentation: https://razorpay.com/docs/

## ⚠️ Common Issues

### Issue: Payment signature verification fails
**Solution**: Ensure webhook secret matches in .env

### Issue: Order creation fails
**Solution**: Check API keys and amount format (paise vs rupees)

### Issue: Notifications not sent
**Solution**: Verify email/SMS service credentials

### Issue: Webhook not triggered
**Solution**: Check webhook URL is publicly accessible

## 📞 Support

- **Documentation**: https://razorpay.com/docs/
- **Support**: https://razorpay.com/support/
- **Test Credentials**: https://razorpay.com/docs/payments/payments/test-card-details/

---

**Status**: ✅ Integrated with notification services
**Test Mode**: Ready to test
**Live Mode**: Requires KYC completion
