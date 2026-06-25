const express = require('express');
const router = express.Router();
const alumnController = require('../controllers/alumnController');

// Esta ruta no tiene router.use(verifyToken), por lo que es pública
router.post('/', alumnController.uploadAlumn);

module.exports = router;