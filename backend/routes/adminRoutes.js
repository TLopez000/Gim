const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Importamos los middlewares centralizados
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/**
 * Aplicamos la cadena de seguridad a todas las rutas:
 * 1. ¿Quién sos? (verifyToken)
 * 2. ¿Tenés permiso? (isAdmin)
 */
router.use(verifyToken, isAdmin);

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;