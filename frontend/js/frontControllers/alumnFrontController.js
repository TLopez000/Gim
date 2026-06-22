// Al cargar la página, traer los samples del usuario
document.addEventListener('DOMContentLoaded', loadAlumns);

async function loadAlumns() {
    try {
        const alumns = await apiService.request('/alumnos/my-alumns', 'GET');
        renderAlumnsTable(alumns);
    } catch (error) {
        showModal('Error', 'No se pudieron cargar los alumnos: ' + error.message);
    }
}

function renderAlumnsTable(alumns) {
    const tbody = document.getElementById('alumnsTableBody');
    tbody.replaceChildren(); // Limpia el contenido de forma eficiente

    alumns.forEach(a => {
        const row = document.createElement('tr');

        // Celda Nombre
        const tdName = document.createElement('td');
        tdName.textContent = a.display_name;
        
        // Celda Edad
        const tdAge = document.createElement('td');
        tdAge.textContent = a.age;

        // Celda Teléfono
        const tdPhone = document.createElement('td');
        tdPhone.textContent = a.telefono;

        // Celda Estado
        const tdState = document.createElement('td');
        tdState.textContent = a.estado;

        // Celda teacher
         const tdteacher = document.createElement('td');
         tdteacher.textContent = a.teacher;
         
        // Celda Nivel
        const tdNivel = document.createElement('td');
        tdNivel.textContent = a.nivel;

        // Celda Acciones
        const tdActions = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.className = 'w3-button w3-red w3-tiny w3-round';
        btnDelete.textContent = 'Borrar';
        btnDelete.addEventListener('click', () => deleteAlumn(a.id));
        tdActions.appendChild(btnDelete);

        // Armar fila
        row.append(tdName, tdAge, tdPhone, tdState, tdteacher, tdNivel, tdActions);
        tbody.appendChild(row);
    });
}

async function deleteAlumn(id) {
    if (!confirm('¿Estás seguro de eliminar este alumno?')) return;
    try {
        await apiService.request(`/alumnos/${id}`, 'DELETE');
        showModal('Eliminado', 'El alumno ha sido borrado.');
        loadAlumns();
    } catch (error) {
        showModal('Error', error.message);
    }
}

// Evento para el formulario de subida
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('alumn_name', document.getElementById('alumn_name').value);
        formData.append('alumn_age', document.getElementById('alumn_age').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('pay_state', document.getElementById('pay_state').value);
        formData.append('alumn_group', document.getElementById('alumn_group').value);
        formData.append('alumn_level', document.getElementById('alumn_level').value);

        try {
            await apiService.request('/alumnos', 'POST', formData, true);
            showModal('Éxito', 'Alumno guardado.');
            uploadForm.reset();
            loadAlumns();
        } catch (error) {
            showModal('Error al subir', error.message);
        }
    });
}
