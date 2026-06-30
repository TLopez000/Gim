const db = require('../config/db');

class AlumnRepository 
{
    // Insertar un nuevo registro de alumno
    async create(alumnData) 
    {
        const { user_id, alumn_name, alumn_group, alumn_level, alumn_age, alumn_activity, pay_state, phone } = alumnData;
    
        try {
           const [rows] = await db.execute(
              'CALL sp_create_alumn(?, ?, ?, ?, ?, ?, ?, ?)', 
               [user_id, alumn_name, alumn_group, alumn_level, alumn_age , alumn_activity, pay_state, phone]
           );

          // Validamos de forma segura que la respuesta tenga la estructura esperada
          if (rows && rows[0] && rows[0][0]) {
              return rows[0][0].insertId;
          }
        
          throw new Error("No se pudo obtener el ID del alumno insertado.");
        } 
        catch (sqlError) {
        // Esto te mostrará en la consola de la terminal el error real de MySQL si falla por tipos de datos (como el ENUM)
        console.error("Error en la base de datos al crear alumno:", sqlError);
        throw sqlError; // Re-lanzamos para que lo ataje el controlador
        }
    }

    // Obtener todos los alumns de un user específico
    async findByUserId(userId) 
    {
        const [rows] = await db.execute('CALL sp_find_alumns_by_user(?)', [userId]);
        return rows[0];
    }

    // Obtener todos los alumnos de un grupo 
    async findByFilter(alumnGroup, alumnLevel, alumnPayState, userId) {
        const [rows] = await db.execute('CALL sp_find_alumns_by_filter(?,?, ?,?)', [alumnGroup, alumnLevel, alumnPayState, userId]);
        return rows[0];
    }

    // Buscar y obtener un alumno validando el ID y el propietario
    async findById(id, userId) 
    {
        const [rows] = await db.execute('CALL sp_find_alumn_by_id(?, ?)', [id, userId]);
        return rows[0][0]; 
    }

    // Eliminar un alumno validando la propiedad del mismo
    async delete(id, userId) 
    {
        await db.execute('CALL sp_delete_alumn(?, ?)', [id, userId]);
        return true;
    }

    // Actualizar el nivel de un alumno
    async updateAlumnLevel(id, userId, newlevel) 
    {
        await db.execute('CALL sp_update_level(?, ?, ?)', [id, userId, newlevel]);
        return true;
    }

    // Actualizar el estado de pago de un alumno
    async updateAlumnPayState(id, userId, newPayState)
    {
        await db.execute('CALL sp_update_pay_state(?,?,?)', [id,userId,newPayState]);
        return true;
    }

    // Actualizar el grupo de un alumno
    async updateAlumnGroup(id, userId, newGroup)
    {
        await db.execute('CALL sp_update_group(?, ?, ?)', [id, userId, newGroup]);
        return true;
    } 

    // Obtener los grupos existentes para un usuario específico
    async getGroupsByUserId(userId) 
    {
        const [rows] = await db.execute('CALL sp_get_groups_by_user(?)', [userId]);
        return rows[0];
    }

    // Resetear el grupo de los alumnos de un profesor eliminado
    async resetAlumnGroup(userId, teacherId)
    {
        await db.execute('CALL sp_reset_group(?,?)', [userId, teacherId]);
        return true;
    }
}

module.exports = new AlumnRepository();