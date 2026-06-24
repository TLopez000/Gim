// Al cargar la página, traer los samples del usuario
document.addEventListener('DOMContentLoaded', () => {
    loadAlumns(); // Tu función original que trae todo

    // 2. Escuchamos cuando el usuario le da clic al botón BUSCAR del formulario
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue solo
            
            const grupoSeleccionado = document.getElementById('selectGroup').value;
            const estadoSeleccionado = document.getElementById('selectState').value;
            
            if (grupoSeleccionado || estadoSeleccionado) {
                // Llamamos a la función de filtrar pasándole el grupo ("Ludmila" o "Messi"), o estados de pago
                await loadAlumnsByFilter(grupoSeleccionado, estadoSeleccionado);
            } else {
                // Si eligen la opción vacía, volvemos a mostrar todos
                await loadAlumns();
            }
        });

    const btnClearFilter = document.getElementById('btnClearFilter');
    if (btnClearFilter) {
        btnClearFilter.addEventListener('click', async () => {
            // 1. Resetea el select a la opción vacía
            document.getElementById('selectGroup').value = "";
            
            // 2. Vuelve a cargar todos los alumnos sin filtros
            await loadAlumns();
        });
    }
    }
});

async function loadAlumns() {
    try {
        const alumns = await apiService.request('/alumnos/my-alumns', 'GET');
        renderAlumnsTable(alumns);
    } catch (error) {
        showModal('Error', 'No se pudieron cargar los alumnos: ' + error.message);
    }
}

async function loadAlumnsByFilter(group, pay_state) { 
    try {
       const alumns = await apiService.request(`/alumnos/filter/${group}/${pay_state}`, 'GET');
       renderAlumnsTable(alumns);
    }
    catch (error) {
        showModal('Error', 'No se pudieron cargar los alumnos por grupo: ' + error.message);
    }
}


function renderAlumnsTable(alumns) {
    const tbody = document.getElementById('alumnsTableBody');
    tbody.replaceChildren(); 

    alumns.forEach(a => {
        const row = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = a.alumn_name;
        
        const tdAge = document.createElement('td');
        tdAge.textContent = a.alumn_age;

        const tdGroup = document.createElement('td');
        tdGroup.textContent = a.alumn_group; 

        const tdNivel = document.createElement('td');
        tdNivel.textContent = a.alumn_level;

        const tdPhone = document.createElement('td');
        tdPhone.textContent = a.phone;

        // --- NUEVA CELDA DE ESTADO DE PAGO (EDITABLE) ---
        const tdState = document.createElement('td');
        
        const selectState = document.createElement('select');
        selectState.className = 'w3-select w3-border w3-round w3-small';
        selectState.style.width = '100%';

        // Opción: Al día
        const optPaid = document.createElement('option');
        optPaid.value = 'paid';
        optPaid.textContent = '✅ Al día';
        optPaid.selected = a.pay_state === 'paid';

        // Opción: Impago
        const optUnpaid = document.createElement('option');
        optUnpaid.value = 'unpaid';
        optUnpaid.textContent = '❌ Impago';
        optUnpaid.selected = a.pay_state === 'unpaid';

        selectState.append(optPaid, optUnpaid);

        // Evento que se dispara al cambiar la opción del select
        selectState.addEventListener('change', async (e) => {
            const nuevoEstado = e.target.value;
            const result = await apiService.request(`/alumnos/update-payment-status/${a.id}`, 'PUT', { pay_state: nuevoEstado });
            showModal('Exito', 'Estado de pago actualizado');
        });

        tdState.appendChild(selectState);
        // ------------------------------------------------

        const tdActions = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.className = 'w3-button w3-red w3-tiny w3-round';
        btnDelete.textContent = 'Borrar';
        btnDelete.addEventListener('click', () => deleteAlumn(a.id));
        tdActions.appendChild(btnDelete);

        // Mantenemos tu orden del row.append
        row.append(tdName, tdAge, tdGroup, tdNivel, tdPhone, tdState, tdActions);
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
            
            showModal('Éxito', 'Alumno inscripto exitosamente.');
            uploadForm.reset();
            loadAlumns();
        } catch (error) {
            showModal('Error en la inscripcion', error.message);
        }
    });
}
