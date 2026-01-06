// jest.setup.js
// Set test environment
process.env.NODE_ENV = 'test';

// Mock environment variables for tests
process.env.PORT = '5001';
process.env.HOST = 'localhost';

// Optional: Set dummy credentials if services require them
process.env.RAZORPAY_KEY_ID = 'rzp_test_dummy';
process.env.RAZORPAY_KEY_SECRET = 'dummy_secret';
