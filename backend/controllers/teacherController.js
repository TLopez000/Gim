const teacherRepo = require('../repositories/teacherRepo');
const jwt = require('jsonwebtoken'); // Para generar tokens de sesión

class teacherController {

    //Crear un teacher
    async createTeacher(req, res) {
        try
        {

            const userId = req.userId; // Proveniente del verifyToken
            const teacher_name = req.body.teacher_name;

            // 2. Persistencia mediante el SP 
            const insertId = await teacherRepo.create({
                user_id: userId,
                teacher_name: teacher_name,
            });

            res.status(201).json({ 
                message: "Profesor cargado con exito.", 
                id: insertId,

            });
        }
        catch (error)
        {          
            res.status(500).json({ message: "Error durante la carga del sample.", error: error.message });
        }
    }

    // Listar teachers
    async getTeachers(req, res) {
        try {
            const teachers = await teacherRepo.findAllTeachers(req.userId);
            res.json(teachers);
        } catch (error) {
            res.status(500).json({ message: "Error al recuperar la lista de teachers.", error: error.message });
        }
    }

    // Eliminar un teacher
    async deleteTeacher(req, res) {
        try {
            const { id } = req.params;
            await teacherRepo.deleteTeacher(id);
            res.json({ message: "Teacher eliminado exitosamente." });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el teacher.", error: error.message });
        }
    }
}

module.exports = new teacherController();