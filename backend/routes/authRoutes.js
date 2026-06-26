const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// El login queda público (no requiere token)
router.post('/login', authController.login);


module.exports = router;