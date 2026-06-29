
const alumnRepo = require('../repositories/alumnRepo');
const userRepo = require('../repositories/userRepo');



class AlumnController
{
    async uploadAlumn(req, res) {
    try {
        
        const { alumn_name, alumn_age, phone, alumn_activity, alumn_group, pay_state, alumn_level } = req.body;

        const schoolUser = await userRepo.findByActivity(alumn_activity); 
        
        // Validamos si la escuela existe en la BD
        if (!schoolUser) {
            return res.status(404).json({
                success: false,
                message: `La escuela o actividad '${alumn_activity}' no existe.`
            });
        }

        const userId = schoolUser.id;

        const alumnData = {
            user_id: userId,
            alumn_name: alumn_name || null,
            alumn_group: alumn_group || '-',
            alumn_level: alumn_level ? parseInt(alumn_level, 10) : 1,
            alumn_age: alumn_age ? parseInt(alumn_age, 10) : null,
            alumn_activity: alumn_activity,
            pay_state: pay_state || 'unpaid',
            phone: phone || null
        };

        // 4. Guardamos en MariaDB
        const insertId = await alumnRepo.create(alumnData);

        return res.status(201).json({
            success: true,
            message: "Alumno inscripto exitosamente.",
            insertId
        });

    } catch (error) {
        console.error("Error en el controlador al registrar alumno:", error);
        return res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message
        });
    }
};
    
    // Listar alumnos
    async getMyAlumns(req, res)
    {
        try
        {
            // El SP sp_find_alumns_by_user filtra por user_id
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

    async updateAlumnLevel(req, res) {
        const id = parseInt(req.params.id, 10); 
        const { level } = req.body;
        
        const userId = req.userId; 

        try {
        
        const result = await alumnRepo.updateAlumnLevel(id, userId, level);
        
        // Enviamos la respuesta de éxito al frontend
        res.json({ message: "Nivel actualizado correctamente." });
       } 
       catch (error) {
        res.status(500).json({ message: "Error al actualizar el nivel.", error: error.message });
       }
    }

    async updateAlumnPayState(req, res) {
        const id = parseInt(req.params.id, 10);
        const { pay_state } = req.body;
        
        const userId = req.userId;
        
        try {
            const result = await alumnRepo.updateAlumnPayState(id, userId, pay_state);
            res.json({ message: "Estado actualizado correctamente." });
        }
        catch (error) {
            res.status(500).json({ message: "Error al actualizar el estado.", error: error.message });
        }
    }

    async updateAlumnGroup(req, res) {
        const id = parseInt(req.params.id, 10);
        const { group } = req.body;
        
        const userId = req.userId;
        
        try {
            const result = await alumnRepo.updateAlumnGroup(id, userId, group);
            res.json({ message: "Grupo actualizado correctamente." });
        }
        catch (error) {
            res.status(500).json({ message: "Error al actualizar el grupo.", error: error.message });
        }
    }

   async getAlumnsByFilter(req, res) {
    try {
        // 1. LEER DE REQ.PARAMS (Coincide con ruta /filter/:group/:level/:pay_state)
        const { group, level, pay_state } = req.params;

        const userId = req.userId; // Id proveniente de la sesion iniciada

        // 2. IMPORTANTE: Si el frontend manda el string "null" o "all", lo pasamos a null real para MariaDB
        const filterGroup = (group === 'null' || group === 'all' || !group) ? null : group;
        const filterLevel = level;
        const filterPayState = (pay_state === 'null' || pay_state === 'all' || !pay_state) ? null : pay_state;

        // 3. Pasamos los valores normalizados al repositorio
        const result = await alumnRepo.findByFilter(filterGroup, filterLevel, filterPayState, userId);
         
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
