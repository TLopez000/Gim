const express = require('express');
const router = express.Router();
const alumnController = require('../controllers/alumnController');
const { verifyToken } = require('../middleware/authMiddleware');

// Todas las rutas de alumnos requieren que el usuario esté logueado
router.use(verifyToken);

// 1. RUTAS ESPECÍFICAS (Van primero)

router.get('/my-alumns', alumnController.getMyAlumns);
router.put('/update-level/:id', alumnController.updateAlumnLevel);
router.put('/update-group/:id', alumnController.updateAlumnGroup);
router.put('/update-paystate/:id', alumnController.updateAlumnPayState);
router.put('/reset-group/:teacherId', alumnController.resetAlumnGroup);


// 2. RUTAS DINÁMICAS CON PREFIJO (Si tuvieras, ej: /group/:group)
// Tip: Es mejor que la ruta de grupo sea '/group/:group' para que no choque con '/:id'
router.get('/filter/:group/:level/:pay_state', alumnController.getAlumnsByFilter); 

// 3. RUTAS TOTALMENTE DINÁMICAS (Van al final de todo)
router.delete('/:id', alumnController.deleteAlumn);

module.exports = router;