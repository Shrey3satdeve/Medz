// src/app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const healthRouter = require('../routes/health.routes');
const testsRouter = require('../routes/tests.routes');
const ordersRouter = require('../routes/orders.routes');
const paymentsRouter = require('../routes/payments.routes');
const authRouter = require('../routes/auth.routes');
const adminRouter = require('../routes/admin.routes');
const medicalRouter = require('../routes/medical.routes');
const chatbotRouter = require('../routes/chatbot.routes');

const app = express();

// Security middleware
app.use(helmet()); // Adds security headers
app.disable('x-powered-by');

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({ 
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression and logging
app.use(compression());
app.use(morgan('dev'));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// Optional roots
app.get('/', (_, res) => res.sendFile(path.join(__dirname, '../../frontend/index.html')));
app.get('/api', (_, res) => res.json({ 
    status: 'ok', 
    version: '1.0.0',
    endpoints: ['/api/health', '/api/tests', '/api/orders', '/api/payments', '/api/auth', '/api/admin', '/api/medical', '/api/chatbot'] 
}));

// Mount routes
app.use('/api', healthRouter);
app.use('/api', testsRouter);
app.use('/api', ordersRouter);
app.use('/api', paymentsRouter);
app.use('/api', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/medical', medicalRouter);
app.use('/api/chatbot', chatbotRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

module.exports = app;