const express = require('express');
const router = express.Router();
/**
 * Módulo/Biblioteca para el manejo de rutas:
 */
const path = require('path');

// --- Rutas de Navegación del Frontend HTML ---

// Al entrar a http://localhost:3000/ cargamos login
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/login.html'));
});

// Rutas amigables para las pantallas:
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/register.html'));
});

router.get('/inscript-Dashboard', (req, res)=> {
    res.sendFile(path.join(__dirname,'../../frontend/html/inscript-Dashboard.html'));
});

router.get('/profe-Dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/profe-Dashboard.html'));
});

router.get('/admin-Dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/admin-Dashboard.html'));
});

module.exports = router;