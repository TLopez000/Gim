
const alumnRepo = require('../repositories/alumnRepo');


class AlumnController 
{
    // Método para subir un alumno y guardarlo en la BD
    async uploadAlumn(req, res) 
    {
        try
        {

            const { alumn_name, alumn_age, alumn_level, pay_state, alumn_group, phone } = req.body;
            

            const userId = req.userId; // Proveniente del verifyToken

            // 2. Persistencia mediante el SP sp_create_sample
            const insertId = await alumnRepo.create({
                user_id: userId,
                alumn_name: alumn_name,
                alumn_age: alumn_age,
                alumn_level: alumn_level,
                pay_state: pay_state,
                phone: phone,
                alumn_group: alumn_group
            });
            res.status(201).json({ 
                message: "Alumno cargado exitosamente", 
                id: insertId,
            });
        }
        catch (error)
        {
            
            res.status(500).json({ message: "Error.", error: error.message });
        }
    }

    // Listar alumnos
    async getMyAlumns(req, res)
    {
        try
        {
            // El SP sp_find_samples_by_user filtra automáticamente por user_id
            const alumns = await alumnRepo.findByUserId(req.userId);
            res.json(alumns);
        }
        catch (error)
        {
            res.status(500).json({ message: "Error al recuperar la lista.", error: error.message });
        }
    }

    // Eliminar un alumno
    async deleteAlumn(req, res) 
    {
        try 
        {
            const { id } = req.params;
            const userId = req.userId;

            // 1. Obtener metadatos para conocer la ruta del archivo físico
            const alumn = await alumnRepo.findById(id, userId);
            
            if (!alumn) {
                return res.status(404).json({ message: "El alumno no existe o no tienes permisos para eliminarlo." });
            }

            // 2. Ejecutar sp_delete_sample en la base de datos
            await alumnRepo.delete(id, userId);
            
            return res.json({ message: "Alumno eliminado." });
        }
        catch (error)
        {
            res.status(500).json({ message: "Error al eliminar el alumno.", error: error.message });
        }
    }

    async updatePaymentStatus(req, res) {
        const id = parseInt(req.params.id, 10); 
        const { pay_state } = req.body;
        const userId = req.userId;

        try {
        // Al repositorio solo le pasas las variables limpias que necesita
        const result = await alumnRepo.updatePaymentStatus(id, userId, pay_state);
        
        // Enviamos la respuesta de éxito al frontend
        res.json({ message: "Estado de pago actualizado correctamente." });
       } 
       catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado de pago.", error: error.message });
       }
    }

   async getAlumnsByFilter(req, res) {
    try {
        // 1. LEER DE REQ.PARAMS (Coincide con ruta /filter/:group/:pay_state)
        const { group, pay_state } = req.params;
        const userId = req.userId;

        // 2. IMPORTANTE: Si el frontend manda el string "null" o "all", lo pasamos a null real para MariaDB
        const filterGroup = (group === 'null' || group === 'all' || !group) ? null : group;
        const filterPayState = (pay_state === 'null' || pay_state === 'all' || !pay_state) ? null : pay_state;

        // 3. Pasamos los valores normalizados al repositorio
        const result = await alumnRepo.findByFilter(filterGroup, filterPayState, userId);
         
        // 4. Validamos si encontramos alumnos
        if (!result || result.length === 0) {
            return res.status(404).json({ 
                message: "No se encontraron alumnos con los filtros especificados." 
            });
        }

        res.json(result);  
    }
    catch(error) {
        res.status(500).json({ 
            message: "Error al recuperar los alumnos por filtro.", 
            error: error.message 
        });
    }
  }
}

module.exports = new AlumnController();