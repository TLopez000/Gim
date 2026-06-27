const db = require('../config/db');

class TeacherRepo
{ 
  // Crear un teacher 
async create(teacherdata) 
    {
        const { user_id, teacher_name } = teacherdata;
        const [rows] = await db.execute(
            'CALL sp_create_teacher(?, ?)', 
            [user_id, teacher_name]
        );
        return rows[0][0].insertId;
    }

  // Borrar un teacher
    async deleteTeacher(id){
        // En los SP de acción (DELETE/UPDATE), verificamos que la ejecución no lance error
        await db.execute('CALL sp_delete_teacher(?)', [id]);
        return true;
    }

  // Listar todos los teachers
  async findAllTeachers(user_id){
    const [rows] = await db.execute('CALL sp_find_teachers_by_user(?)', [user_id]);
    return rows[0];
  }

  // Contar alumnos por teacher
  async countAlumnsByTeacher(teacher_name) {
    const [rows] = await db.execute('CALL sp_count_alumns_by_teacher(?)', [teacher_name]);
    return rows[0][0].cantalumns; // Retorna la cantidad de alumnos
  }
}

module.exports = new TeacherRepo();