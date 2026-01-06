// services/email.service.js
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Use mock transporter in test environment
        if (process.env.NODE_ENV === 'test') {
            this.transporter = {
                sendMail: async () => ({ messageId: 'TEST_EMAIL_ID' })
            };
        } else {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        }
    }

    async sendWelcomeEmail(userEmail, userName, welcomeBonus) {
        const mailOptions = {
            from: `"LabDash" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: '🎉 Welcome to LabDash - Your ₹500 Bonus is Ready!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .bonus-card { background: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border: 2px solid #667eea; }
                        .bonus-amount { font-size: 48px; color: #667eea; font-weight: bold; }
                        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
                        .features { display: grid; gap: 15px; margin: 20px 0; }
                        .feature { background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🧪 Welcome to LabDash!</h1>
                            <p>Your Healthcare Journey Starts Here</p>
                        </div>
                        <div class="content">
                            <h2>Hi ${userName}! 👋</h2>
                            <p>Thank you for joining LabDash - India's leading healthcare platform!</p>
                            
                            <div class="bonus-card">
                                <h3>🎁 Your Welcome Bonus</h3>
                                <div class="bonus-amount">₹${welcomeBonus}</div>
                                <p>Credited to your account!</p>
                            </div>

                            <h3>What You Get:</h3>
                            <div class="features">
                                <div class="feature">✅ Flat 20% OFF on all lab tests</div>
                                <div class="feature">🏠 FREE home sample collection on first order</div>
                                <div class="feature">⭐ Priority customer support for 30 days</div>
                                <div class="feature">📱 Access to 18+ certified lab tests</div>
                                <div class="feature">💊 Order medicines online with prescription</div>
                                <div class="feature">🐾 Pet care & veterinary services</div>
                            </div>

                            <center>
                                <a href="https://labdash.com" class="button">Start Exploring →</a>
                            </center>

                            <p style="margin-top: 30px; font-size: 14px; color: #666;">
                                Need help? Contact us at support@labdash.com or call +91-9876543210
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${userEmail}`);
            return { success: true };
        } catch (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendOrderConfirmation(userEmail, orderDetails) {
        const mailOptions = {
            from: `"LabDash" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: `✅ Order Confirmed - ${orderDetails.orderId}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; }
                        .order-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
                        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                        .total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Order Confirmed!</h1>
                            <p>Order #${orderDetails.orderId}</p>
                        </div>
                        <div class="content">
                            <h2>Thank you for your order!</h2>
                            <div class="order-card">
                                <h3>Order Details:</h3>
                                ${orderDetails.items.map(item => `
                                    <div class="item">
                                        <span>${item.name}</span>
                                        <span>₹${item.price}</span>
                                    </div>
                                `).join('')}
                                <div class="total">Total: ₹${orderDetails.total}</div>
                            </div>
                            <p>We'll notify you once your order is ready for delivery/pickup.</p>
                            <p>Track your order: <a href="https://labdash.com/orders/${orderDetails.orderId}">Click here</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            console.error('Order email error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendReportReady(userEmail, reportDetails) {
        const mailOptions = {
            from: `"LabDash" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: '📋 Your Lab Report is Ready!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                        .content { background: #f9f9f9; padding: 30px; }
                        .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 25px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📋 Report Ready!</h1>
                        </div>
                        <div class="content">
                            <h2>Your ${reportDetails.testName} report is ready</h2>
                            <p>Report ID: ${reportDetails.reportId}</p>
                            <p>You can now download your report from your dashboard.</p>
                            <center>
                                <a href="https://labdash.com/reports/${reportDetails.reportId}" class="button">Download Report</a>
                            </center>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            console.error('Report email error:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
