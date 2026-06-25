// Evento para el formulario de subida (SOLO TEXTO)
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // 1. Armamos el objeto JSON limpio usando ÚNICAMENTE los IDs que existen en tu HTML actual
                const alumnData = {
                    alumn_name: document.getElementById('alumn_name').value,
                    alumn_age: parseInt(document.getElementById('alumn_age').value, 10), // Forzamos entero para la BD
                    phone: document.getElementById('phone').value,
                    alumn_activity: document.getElementById('alumn_activity').value, // Ahora sí existe en el HTML
                    
                    // Como quitaste estos campos del HTML, los enviamos con valores por defecto
                    // para que tu backend (Node y MariaDB) no tire un error de campos requeridos
                    alumn_group: 'Sin grupo', 
                    alumn_level: '1'
                };

                // 2. Ejecutamos la petición enviando el JSON puro
                await apiService.request('/alumnos/inscript', 'POST', alumnData, false); 
                
                showModal('Éxito', 'Alumno inscripto exitosamente.');
                uploadForm.reset();

            } catch (error) {
                console.error("Error en el bloque submit:", error);
                showModal('Error en la inscripción', error.message);
            }
        });
    } else {
        console.error("No se encontró el formulario con ID 'uploadForm'. Revisa si el script está bien cargado.");
    }
});