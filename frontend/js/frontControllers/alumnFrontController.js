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
        tdName.textContent = a.alumn_name;
        
        // Celda Edad
        const tdAge = document.createElement('td');
        tdAge.textContent = a.alumn_age;

        // Celda teacher
         const tdgroup = document.createElement('td');
         tdgroup.textContent = a.alumn_group;

        // Celda Teléfono
        const tdPhone = document.createElement('td');
        tdPhone.textContent = a.phone;

        // Celda Estado
        const tdState = document.createElement('td');
        if (a.pay_state === 'paid') {
            tdState.innerHTML = '<span class="w3-tag w3-green w3-round">Al día</span>';
        } else {
            tdState.innerHTML = '<span class="w3-tag w3-orange w3-round">Impago</span>';
        }
   
        // Celda Nivel
        const tdNivel = document.createElement('td');
        tdNivel.textContent = a.alumn_level;

        // Celda Acciones
        const tdActions = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.className = 'w3-button w3-red w3-tiny w3-round';
        btnDelete.textContent = 'Borrar';
        btnDelete.addEventListener('click', () => deleteAlumn(a.id));
        tdActions.appendChild(btnDelete);

        // Armar fila
        row.append(tdName, tdAge, tdgroup, tdNivel, tdPhone, tdState, tdActions);
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

// Evento para el formulario de subida CON ARCHIVOS
/*const uploadForm = document.getElementById('uploadForm');
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
}*/

// Evento para el formulario de subida (SOLO TEXTO)
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Armamos el objeto JSON limpio con los valores del formulario
        const alumnData = {
            alumn_name: document.getElementById('alumn_name').value,
            alumn_age: parseInt(document.getElementById('alumn_age').value, 10), // Forzamos entero para la BD
            phone: document.getElementById('phone').value,
            pay_state: document.getElementById('pay_state').value,
            alumn_group: document.getElementById('alumn_group').value,
            alumn_level: document.getElementById('alumn_level').value
        };

        try {
            // 2. Quitamos el 'true' del final (o ponemos 'false') para que viaje como JSON puro
            await apiService.request('/alumnos', 'POST', alumnData, false); 
            
            showModal('Éxito', 'Alumno guardado exitosamente.');
            uploadForm.reset();
            loadAlumns();
        } catch (error) {
            showModal('Error al subir', error.message);
        }
    });
}
