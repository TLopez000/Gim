const userRepo = require('../repositories/userRepo');
const alumnRepo = require('../repositories/alumnRepo');


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

    // Eliminar al usuario y sus archivos
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