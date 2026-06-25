const express = require('express');
const router = express.Router();
const alumnController = require('../controllers/alumnController');
const { verifyToken } = require('../middleware/authMiddleware');

// Todas las rutas de alumnos requieren que el usuario esté logueado
router.use(verifyToken);

// 1. RUTAS ESPECÍFICAS (Van primero)

router.get('/my-alumns', alumnController.getMyAlumns);
router.get('/groups', alumnController.getGroups);
router.put('/update-level/:id', alumnController.updateAlumnLevel);
router.put('/update-group/:id', alumnController.updateAlumnGroup);


// 2. RUTAS DINÁMICAS CON PREFIJO (Si tuvieras, ej: /group/:group)
// Tip: Es mejor que la ruta de grupo sea '/group/:group' para que no choque con '/:id'
router.get('/filter/:group/:level', alumnController.getAlumnsByFilter); 

// 3. RUTAS TOTALMENTE DINÁMICAS (Van al final de todo)
router.delete('/:id', alumnController.deleteAlumn);

module.exports = router;