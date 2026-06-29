// Evento para el formulario de subida (SOLO TEXTO)
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // 1. Armo el objeto JSON limpio
                const alumnData = {
                    alumn_name: document.getElementById('alumn_name').value,
                    alumn_age: parseInt(document.getElementById('alumn_age').value, 10), // Forzamos entero para la BD
                    phone: document.getElementById('phone').value,
                    alumn_activity: document.getElementById('alumn_activity').value,

                    // campos por defecto para cada alumno (son definidos despues por el usuario)
                    alumn_group: 'Sin Profe', 
                    pay_state: 'unpaid',
                    alumn_level: '1'
                };

                // 2. Ejecutamos la petición enviando el JSON 
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
