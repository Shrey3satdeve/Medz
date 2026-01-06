// routes/tests.routes.js
const express = require('express');
const router = express.Router();
const testsController = require('../controllers/tests.controller');

router.get('/tests', testsController.getTests);
router.get('/packages', testsController.getPackages);

module.exports = router;