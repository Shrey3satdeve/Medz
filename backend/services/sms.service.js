// services/sms.service.js
const twilio = require('twilio');

class SMSService {
    constructor() {
        // Skip Twilio initialization in test environment
        if (process.env.NODE_ENV === 'test') {
            this.client = {
                messages: {
                    create: async () => ({ sid: 'TEST_SMS_SID', status: 'sent' })
                }
            };
            this.fromNumber = '+1234567890';
        } else {
            this.client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
            this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
        }
    }

    async sendWelcomeSMS(phoneNumber, userName, welcomeBonus) {
        const message = `Hi ${userName}! Welcome to LabDash 🧪\n\nYour Welcome Bonus of ₹${welcomeBonus} has been credited!\n\nGet 20% OFF on all lab tests + FREE home sample collection.\n\nStart exploring: labdash.com`;

        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: phoneNumber
            });
            console.log(`Welcome SMS sent to ${phoneNumber}`);
            return { success: true, messageId: result.sid };
        } catch (error) {
            console.error('SMS send error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendOTP(phoneNumber, otp) {
        const message = `Your LabDash OTP is: ${otp}\n\nValid for 10 minutes. Do not share with anyone.\n\n- LabDash Team`;

        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: phoneNumber
            });
            return { success: true, messageId: result.sid };
        } catch (error) {
            console.error('OTP SMS error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendOrderConfirmation(phoneNumber, orderId, total) {
        const message = `✅ Order Confirmed!\n\nOrder ID: ${orderId}\nTotal: ₹${total}\n\nTrack your order: labdash.com/orders\n\nThank you for choosing LabDash!`;

        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: phoneNumber
            });
            return { success: true, messageId: result.sid };
        } catch (error) {
            console.error('Order SMS error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendReportReady(phoneNumber, testName, reportId) {
        const message = `📋 Your ${testName} report is ready!\n\nReport ID: ${reportId}\n\nDownload now: labdash.com/reports\n\n- LabDash`;

        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: phoneNumber
            });
            return { success: true, messageId: result.sid };
        } catch (error) {
            console.error('Report SMS error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendDeliveryUpdate(phoneNumber, orderId, status) {
        const statusMessages = {
            'dispatched': '📦 Your order has been dispatched!',
            'out_for_delivery': '🚚 Out for delivery! Arriving soon.',
            'delivered': '✅ Order delivered successfully!'
        };

        const message = `${statusMessages[status]}\n\nOrder ID: ${orderId}\n\nTrack: labdash.com/orders/${orderId}\n\n- LabDash`;

        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: phoneNumber
            });
            return { success: true, messageId: result.sid };
        } catch (error) {
            console.error('Delivery SMS error:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new SMSService();
