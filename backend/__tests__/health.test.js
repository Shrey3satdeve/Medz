// __tests__/health.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Health Check API Tests', () => {
    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
        });

        it('should respond quickly (under 100ms)', async () => {
            const start = Date.now();
            await request(app).get('/api/health').expect(200);
            const duration = Date.now() - start;
            expect(duration).toBeLessThan(100);
        });

        it('should handle multiple concurrent requests', async () => {
            const promises = Array(10).fill().map(() => 
                request(app).get('/api/health').expect(200)
            );
            const responses = await Promise.all(promises);
            responses.forEach(res => {
                expect(res.body.status).toBe('ok');
            });
        });
    });

    describe('GET /api', () => {
        it('should return API information', async () => {
            const response = await request(app)
                .get('/api')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
            expect(response.body).toHaveProperty('version');
            expect(response.body).toHaveProperty('endpoints');
            expect(Array.isArray(response.body.endpoints)).toBe(true);
        });

        it('should list all available endpoints', async () => {
            const response = await request(app).get('/api').expect(200);
            const endpoints = response.body.endpoints;
            
            expect(endpoints).toContain('/api/health');
            expect(endpoints).toContain('/api/tests');
            expect(endpoints).toContain('/api/orders');
            expect(endpoints).toContain('/api/payments');
            expect(endpoints).toContain('/api/auth');
        });
    });

    describe('GET /', () => {
        it('should serve the frontend HTML', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);
            
            expect(response.text).toContain('<!DOCTYPE html>');
        });
    });

    describe('404 Error Handling', () => {
        it('should return 404 for non-existent API routes', async () => {
            const response = await request(app)
                .get('/api/nonexistent')
                .expect(404);
            
            expect(response.body).toHaveProperty('error', 'Not Found');
        });

        it('should handle POST to non-existent routes', async () => {
            await request(app)
                .post('/api/invalid')
                .expect(404);
        });
    });
});
