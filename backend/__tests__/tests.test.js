// __tests__/tests.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Tests API', () => {
    describe('GET /api/tests', () => {
        it('should return list of tests', async () => {
            const response = await request(app)
                .get('/api/tests')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('tests');
            expect(Array.isArray(response.body.tests)).toBe(true);
        });

        it('should return tests with required fields', async () => {
            const response = await request(app).get('/api/tests').expect(200);
            
            if (response.body.tests.length > 0) {
                const test = response.body.tests[0];
                expect(test).toHaveProperty('id');
                expect(test).toHaveProperty('name');
                expect(test).toHaveProperty('price');
            }
        });

        it('should handle query parameters', async () => {
            const response = await request(app)
                .get('/api/tests?category=blood')
                .expect(200);
            
            expect(response.body).toHaveProperty('tests');
        });
    });

    describe('GET /api/tests/packages', () => {
        it('should return list of packages', async () => {
            const response = await request(app)
                .get('/api/tests/packages')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('packages');
            expect(Array.isArray(response.body.packages)).toBe(true);
        });

        it('should return packages with required fields', async () => {
            const response = await request(app).get('/api/tests/packages').expect(200);
            
            if (response.body.packages.length > 0) {
                const pkg = response.body.packages[0];
                expect(pkg).toHaveProperty('id');
                expect(pkg).toHaveProperty('name');
                expect(pkg).toHaveProperty('price');
                expect(pkg).toHaveProperty('tests');
            }
        });
    });
});