// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public routes (base)
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/admin-login', authController.adminLogin);
router.post('/google', authController.googleAuth);

// Public routes (alias with /auth prefix for frontend compatibility)
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/admin-login', authController.adminLogin);
router.post('/auth/google', authController.googleAuth);

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;

// ========== OLD CODE BELOW (keeping for reference) ==========
const emailService = require('../services/email.service');
const smsService = require('../services/sms.service');

// Mock user database (replace with real DB)
const users = [];

// Register endpoint
router.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and password are required' 
            });
        }

        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }

        // Create user (in production, hash password with bcrypt)
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            phone: phone || '',
            createdAt: new Date().toISOString(),
            welcomeBonus: 500 // Welcome bonus in rupees
        };

        users.push(newUser);

        // Send welcome email
        if (email) {
            await emailService.sendWelcomeEmail(email, name, 500);
        }

        // Send welcome SMS
        if (phone) {
            await smsService.sendWelcomeSMS(phone, name, 500);
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome bonus of ₹500 credited.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                welcomeBonus: newUser.welcomeBonus
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// Login endpoint
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // In production, verify password hash
        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Contact form endpoint
router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, organization, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and message are required' 
            });
        }

        // In production: Save to database and send email notification
        console.log('Contact form submission:', { name, email, phone, organization, message });

        res.json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you within 24 hours.'
        });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        });
    }
});

module.exports = router;
