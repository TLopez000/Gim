const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken } = require('../middleware/authMiddleware');

// Todas las rutas de alumnos requieren que el usuario esté logueado
router.use(verifyToken);

// 1. RUTAS ESPECÍFICAS (Van primero)

router.get('/my-teachers', teacherController.getTeachers);
router.post('/create', teacherController.createTeacher);

// 3. RUTAS TOTALMENTE DINÁMICAS (Van al final de todo)
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;