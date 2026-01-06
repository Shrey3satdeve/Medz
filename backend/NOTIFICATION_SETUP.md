# Email & SMS Notification Setup Guide

## 📧 Email Service (Nodemailer)

### Gmail Configuration

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Add to `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
```

### SendGrid (Alternative)

1. Sign up at https://sendgrid.com
2. Create API key
3. Update `.env`:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

## 📱 SMS Service (Twilio)

### Setup Steps

1. **Create Twilio Account**: https://www.twilio.com/try-twilio
2. **Get Credentials**:
   - Account SID
   - Auth Token
   - Phone Number

3. **Add to `.env` file**:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Test SMS (India)

For Indian numbers, format: `+91XXXXXXXXXX`

## 🎯 Available Notification Templates

### Email Templates:
1. **Welcome Email** - Sent on registration with ₹500 bonus details
2. **Order Confirmation** - Sent after successful payment
3. **Report Ready** - Sent when lab report is available

### SMS Templates:
1. **Welcome SMS** - Registration confirmation with bonus
2. **OTP SMS** - Authentication codes
3. **Order Confirmation** - Payment success notification
4. **Report Ready** - Lab report availability alert
5. **Delivery Updates** - Order tracking notifications

## 🧪 Testing Notifications

### Test Welcome Email:
```javascript
const emailService = require('./services/email.service');

await emailService.sendWelcomeEmail(
    'user@example.com',
    'John Doe',
    500
);
```

### Test SMS:
```javascript
const smsService = require('./services/sms.service');

await smsService.sendWelcomeSMS(
    '+919876543210',
    'John Doe',
    500
);
```

## 💰 Cost Estimates

### Twilio SMS (India):
- ₹0.55 per SMS
- Free trial: ₹1,000 credit
- Buy credits as needed

### SendGrid Email:
- Free: 100 emails/day
- Essentials: $19.95/month (50,000 emails)
- Pro: $89.95/month (100,000 emails)

### Gmail (Free):
- 500 emails/day limit
- Good for testing and small projects

## 🔒 Security Best Practices

1. Never commit `.env` file to Git
2. Use app-specific passwords, not account passwords
3. Enable rate limiting to prevent abuse
4. Validate email/phone formats before sending
5. Log all notification attempts for debugging

## 📊 Monitoring

Add logging to track:
- Successful sends
- Failed attempts
- Delivery rates
- Bounce rates

## 🚀 Production Checklist

- [ ] Valid SMTP credentials configured
- [ ] Twilio account verified and funded
- [ ] Email templates tested
- [ ] SMS templates tested
- [ ] Rate limiting enabled
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Backup notification method ready

## 📞 Support

- **Twilio Support**: https://support.twilio.com
- **SendGrid Support**: https://support.sendgrid.com
- **Gmail SMTP Issues**: https://support.google.com

---

**Status**: ✅ Service files created and integrated
**Next Step**: Add credentials to `.env` and test
