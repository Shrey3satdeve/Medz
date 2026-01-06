// __tests__/orders.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Orders API Tests', () => {
    let createdOrderId;

    describe('GET /api/orders', () => {
        it('should return list of orders', async () => {
            const response = await request(app)
                .get('/api/orders')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('orders');
            expect(Array.isArray(response.body.orders)).toBe(true);
        });

        it('should return orders with required fields', async () => {
            const response = await request(app).get('/api/orders').expect(200);
            
            if (response.body.orders.length > 0) {
                const order = response.body.orders[0];
                expect(order).toHaveProperty('id');
                expect(order).toHaveProperty('status');
            }
        });
    });

    describe('GET /api/orders/:id', () => {
        it('should return a specific order', async () => {
            const response = await request(app)
                .get('/api/orders/ORD001')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('order');
            expect(response.body.order).toHaveProperty('id', 'ORD001');
        });

        it('should return 404 for non-existent order', async () => {
            const response = await request(app)
                .get('/api/orders/INVALID')
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should handle malformed order IDs', async () => {
            await request(app)
                .get('/api/orders/!@#$%')
                .expect(404);
        });
    });

    describe('POST /api/orders', () => {
        it('should create a new order with valid data', async () => {
            const orderData = {
                tests: ['CBC', 'Lipid Profile'],
                totalAmount: 1500,
                appointmentDate: '2025-12-20',
                appointmentTime: '10:00 AM'
            };

            const response = await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('tests');
            expect(response.body.tests).toEqual(orderData.tests);
            expect(response.body.totalAmount).toBe(orderData.totalAmount);
            
            createdOrderId = response.body.id;
        });

        it('should fail with empty tests array', async () => {
            const orderData = {
                tests: [],
                totalAmount: 0
            };

            const response = await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('should fail with missing tests field', async () => {
            const orderData = {
                totalAmount: 1000
            };

            await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect(400);
        });

        it('should fail with invalid tests type', async () => {
            const orderData = {
                tests: 'not-an-array',
                totalAmount: 1000
            };

            await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect(400);
        });

        it('should create order with minimal required fields', async () => {
            const orderData = {
                tests: ['CBC']
            };

            const response = await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.tests).toEqual(['CBC']);
        });

        it('should generate unique order IDs', async () => {
            const orderData = { tests: ['Test1'] };
            
            const response1 = await request(app).post('/api/orders').send(orderData).expect(201);
            const response2 = await request(app).post('/api/orders').send(orderData).expect(201);
            
            expect(response1.body.id).not.toBe(response2.body.id);
        });

        it('should set default status to IN_PROCESS', async () => {
            const orderData = { tests: ['CBC'] };
            
            const response = await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect(201);
            
            expect(response.body.status).toBe('IN_PROCESS');
        });
    });
});
