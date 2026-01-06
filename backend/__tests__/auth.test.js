// __tests__/auth.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Auth API Tests', () => {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'Test@123';

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: testEmail,
                phone: '9876543210',
                password: testPassword
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', userData.email);
            expect(response.body.user).toHaveProperty('name', userData.name);
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('should fail with invalid email format', async () => {
            const userData = {
                name: 'Test User',
                email: 'invalid-email',
                phone: '9876543210',
                password: 'Test@123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with missing name', async () => {
            const userData = {
                email: 'test2@example.com',
                phone: '9876543210',
                password: 'Test@123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with missing email', async () => {
            const userData = {
                name: 'Test User',
                phone: '9876543210',
                password: 'Test@123'
            };

            await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
        });

        it('should fail with missing password', async () => {
            const userData = {
                name: 'Test User',
                email: 'test3@example.com',
                phone: '9876543210'
            };

            await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
        });

        it('should fail with weak password', async () => {
            const userData = {
                name: 'Test User',
                email: 'test4@example.com',
                phone: '9876543210',
                password: '123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with invalid phone format', async () => {
            const userData = {
                name: 'Test User',
                email: 'test5@example.com',
                phone: '123',
                password: 'Test@123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return error for non-existent user', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'Test@123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with invalid email format', async () => {
            const loginData = {
                email: 'invalid-email',
                password: 'Test@123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with missing email', async () => {
            const loginData = {
                password: 'Test@123'
            };

            await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(400);
        });

        it('should fail with missing password', async () => {
            const loginData = {
                email: 'test@example.com'
            };

            await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(400);
        });

        it('should fail with empty body', async () => {
            await request(app)
                .post('/api/auth/login')
                .send({})
                .expect(400);
        });
    });

    describe('Authentication Flow', () => {
        it('should register and login successfully', async () => {
            const uniqueEmail = `flow${Date.now()}@example.com`;
            const userData = {
                name: 'Flow Test',
                email: uniqueEmail,
                phone: '9876543210',
                password: 'Test@123'
            };

            // Register
            await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            // Login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: uniqueEmail,
                    password: 'Test@123'
                })
                .expect(200);

            expect(loginResponse.body).toHaveProperty('success', true);
        });
    });
});
