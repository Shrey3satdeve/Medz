const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Protect all admin routes
router.use(verifyToken, isAdmin);

// Dashboard Overview
router.get('/dashboard', adminController.getDashboard);

// Customers Management
router.get('/customers', adminController.getCustomers);

// Orders Management
router.get('/orders', adminController.getOrders);
router.post('/orders', adminController.addOrder);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);

// Lab Tests Analytics
router.get('/lab-tests', adminController.getLabTests);

// Pharma Products Analytics
router.get('/pharma-products', adminController.getPharmaProducts);

// Pet Products Analytics
router.get('/pet-products', adminController.getPetProducts);

module.exports = router;
