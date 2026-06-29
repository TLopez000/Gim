const userRepo = require('../repositories/userRepo');
const alumnRepo = require('../repositories/alumnRepo');
const bcrypt = require('bcrypt'); // Biblioteca para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens de sesión


class AdminController 
{
    // Listar todos los usuarios con sus roles (vía SP sp_find_all_users)
    async getAllUsers(req, res)
    {
        try
        {
            const users = await userRepo.findAll();
            // El SP ya devuelve el nombre del rol gracias al JOIN interno
            res.json(users);
        }
        catch (error)
        {
            res.status(500).json({ 
                message: "Error al obtener la lista de usuarios", 
                error: error.message 
            });
        }
    }

    // Registro de usuarios
    async registerUser(req, res) 
    {
        try 
        {
            const { username, user_activity, password } = req.body;

            // 1. Validación de presencia
            if (!username || !password) {
                return res.status(400).json({ message: "Usuario y contraseña son requeridos." });
            }

            // Validación del largo de contraseña
            if (password.length < 6) {
                return res.status(400).json({ message: "La contraseña es demasiado corta" });
            }


            const hashedPassword = await bcrypt.hash(password, 10);            
            
            // 2. Creación mediante el repositorio (que usa el SP sp_create_user)
            const userId = await userRepo.create(username, user_activity, hashedPassword, 'school'); // Por defecto, todos los usuarios registrados son 'school'
            
            res.status(201).json({ 
                message: "Usuario registrado con éxito.", 
                userId 
            });
        }
        catch (error)
        {
            // 3. Manejo de error específico: Usuario Duplicado (Código ER_DUP_ENTRY en MySQL)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "El nombre de usuario ya existe." });
            }

            res.status(500).json({ 
                message: "Error interno durante el registro.", 
                error: error.message 
            });
        }
    }

    // Eliminar al usuario
    async deleteUser(req, res)
    {
        try
        {
            const targetUserId = req.params.id;
            const adminId = req.userId; // ID del administrador que realiza la acción (del JWT)

            // 1. Regla de Negocio: No permitir que un admin se elimine a sí mismo
            if (targetUserId == adminId) {
                return res.status(403).json({ 
                    message: "Operación denegada: No puedes eliminar tu propia cuenta de administrador." 
                });
            }
            
            // 3. Proceder con la eliminación en la DB (vía SP sp_delete_user)
            const success = await userRepo.delete(targetUserId);

            if (!success) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            res.json({ 
                message: `Usuario eliminado con éxito` 
            });
        }
        catch (error)
        {
            res.status(500).json({ 
                message: "Error crítico al intentar eliminar el usuario.", 
                error: error.message 
            });
        }
    }
}

module.exports = new AdminController();
