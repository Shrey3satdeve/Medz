// __tests__/payments.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Payments API Tests', () => {
    describe('POST /api/payments/create-order', () => {
        it('should create a Razorpay order with valid data', async () => {
            const orderData = {
                amount: 1000,
                currency: 'INR',
                receipt: 'TEST_RECEIPT_001'
            };

            const response = await request(app)
                .post('/api/payments/create-order')
                .send(orderData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('order');
            expect(response.body.order).toHaveProperty('id');
            expect(response.body.order).toHaveProperty('amount', orderData.amount);
        });

        it('should fail with negative amount', async () => {
            const orderData = {
                amount: -100,
                currency: 'INR'
            };

            const response = await request(app)
                .post('/api/payments/create-order')
                .send(orderData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with zero amount', async () => {
            const orderData = {
                amount: 0,
                currency: 'INR'
            };

            await request(app)
                .post('/api/payments/create-order')
                .send(orderData)
                .expect(400);
        });

        it('should fail with missing amount', async () => {
            const orderData = {
                currency: 'INR'
            };

            await request(app)
                .post('/api/payments/create-order')
                .send(orderData)
                .expect(400);
        });

        it('should use default currency INR', async () => {
            const orderData = {
                amount: 1000
            };

            const response = await request(app)
                .post('/api/payments/create-order')
                .send(orderData)
                .expect(201);

            expect(response.body.order.currency).toBe('INR');
        });

        it('should accept large amounts', async () => {
            const orderData = {
                amount: 100000,
                currency: 'INR'
            };

            const response = await request(app)
                .post('/api/payments/create-order')
                .send(orderData)
                .expect(201);

            expect(response.body.order.amount).toBe(100000);
        });
    });

    describe('POST /api/payments/verify', () => {
        it('should fail with missing signature', async () => {
            const verifyData = {
                razorpay_order_id: 'order_test123',
                razorpay_payment_id: 'pay_test123'
            };

            const response = await request(app)
                .post('/api/payments/verify')
                .send(verifyData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with missing order_id', async () => {
            const verifyData = {
                razorpay_payment_id: 'pay_test123',
                razorpay_signature: 'sig_test'
            };

            await request(app)
                .post('/api/payments/verify')
                .send(verifyData)
                .expect(400);
        });

        it('should fail with missing payment_id', async () => {
            const verifyData = {
                razorpay_order_id: 'order_test123',
                razorpay_signature: 'sig_test'
            };

            await request(app)
                .post('/api/payments/verify')
                .send(verifyData)
                .expect(400);
        });

        it('should fail with invalid signature', async () => {
            const verifyData = {
                razorpay_order_id: 'order_test123',
                razorpay_payment_id: 'pay_test123',
                razorpay_signature: 'invalid_signature'
            };

            const response = await request(app)
                .post('/api/payments/verify')
                .send(verifyData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/payments/:paymentId', () => {
        it('should handle payment details request', async () => {
            const response = await request(app)
                .get('/api/payments/pay_test123')
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty('success');
        });

        it('should handle invalid payment ID format', async () => {
            await request(app)
                .get('/api/payments/invalid_id')
                .expect('Content-Type', /json/);
        });
    });

    describe('POST /api/payments/webhook', () => {
        it('should handle webhook requests', async () => {
            const webhookData = {
                event: 'payment.captured',
                payload: {
                    payment: {
                        entity: {
                            id: 'pay_test123',
                            amount: 1000,
                            status: 'captured'
                        }
                    }
                }
            };

            await request(app)
                .post('/api/payments/webhook')
                .send(webhookData)
                .expect('Content-Type', /json/);
        });
    });
});
