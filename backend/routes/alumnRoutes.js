const express = require('express');
const router = express.Router();
const alumnController = require('../controllers/alumnController');

const { verifyToken } = require('../middleware/authMiddleware');

// Todas las rutas de alumnos requieren que el usuario esté logueado
router.use(verifyToken);

// Subir un nuevo alumno: POST /api/alumnos/uploads
router.post('/', alumnController.uploadAlumn);

// Listar mis alumnos: GET /api/alumnos/my-alumns
router.get('/my-alumns', alumnController.getMyAlumns);

// Eliminar un alumno: DELETE /api/alumnos/:id
router.delete('/:id', alumnController.deleteAlumn);

module.exports = router;