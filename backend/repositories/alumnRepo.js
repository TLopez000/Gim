const db = require('../config/db');

class AlumnRepository 
{
    // Insertar un nuevo registro de alumno
    async create(alumnData) 
    {
        const { user_id, alumn_name, alumn_age, alumn_level, alumn_group, phone, pay_state } = alumnData;
        const [rows] = await db.execute(
            'CALL sp_create_alumn(?, ?, ?, ?, ?, ?, ?)', 
            [user_id, alumn_name, alumn_age, alumn_level, pay_state, alumn_group, phone]
        );
        return rows[0][0].insertId;
    }

    // Obtener todos los alumns de un productor específico
    async findByUserId(userId) 
    {
        const [rows] = await db.execute('CALL sp_find_alumns_by_user(?)', [userId]);
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
}

module.exports = new AlumnRepository();