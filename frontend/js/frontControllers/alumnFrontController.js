
// Al cargar la página, traer los samples del usuario
document.addEventListener('DOMContentLoaded', () => {
    loadAlumns(); // Tu función original que trae todo

    // 2. Escuchamos cuando el usuario le da clic al botón BUSCAR del formulario
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue solo
            
            const grupoSeleccionado = document.getElementById('selectGroup').value;
            const levelSeleccionado = document.getElementById('selectLevel').value;

            if (grupoSeleccionado || levelSeleccionado) {
                // Llamamos a la función de filtrar pasándole el grupo ("Ludmila" o "Messi"), o nivel
                await loadAlumnsByFilter(grupoSeleccionado, levelSeleccionado);
            } else {
                // Si eligen la opción vacía, volvemos a mostrar todos
                await loadAlumns();
            }
        });

    const btnClearFilter = document.getElementById('btnClearFilter');
    if (btnClearFilter) {
        btnClearFilter.addEventListener('click', async () => {
            // 1. Resetea el select a la opción vacía
            document.getElementById('selectGroup').value = "all";
            document.getElementById('selectLevel').value = 0;
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

async function loadAlumnsByFilter(group, level) { 
    try {
       const alumns = await apiService.request(`/alumnos/filter/${group}/${level}`, 'GET');
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
        
        // -- CELDA DE GRUPO EDITABLE
        const tdGroup = document.createElement('td');
        
        const selectGroup = document.createElement('select');
        selectGroup.className = 'w3-select w3-border w3-round w3-small';
        selectGroup.style.width = '120px'; // Ancho fijo para el select
        
        options = ['Sin grupo','Ludmila', 'Messi','Fede','Ronaldinho']; // Aquí puedes agregar más grupos si los hay
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (opt === a.alumn_group) {
                option.selected = true; // Selecciona el grupo actual del alumno
            }
            selectGroup.appendChild(option);
        });

        // Evento para actualizar el grupo en la base de datos
        selectGroup.addEventListener('change', async (e) => {
            const nuevoGrupo = e.target.value;
            try {
                await apiService.request(`/alumnos/update-group/${a.id}`, 'PUT', { group: nuevoGrupo });
                showModal('Éxito', 'Grupo actualizado');
                a.alumn_group = nuevoGrupo; // Actualizamos el registro en la memoria del navegador
            }
            catch (error) {
                showModal('Error', 'No se pudo actualizar el grupo: ' + error.message);
                selectGroup.value = a.alumn_group; // Revierte al grupo que tenía antes
            }
        });

        tdGroup.appendChild(selectGroup);

        const tdPhone = document.createElement('td');
        tdPhone.textContent = a.phone;

        // --- NUEVA CELDA DE NIVEL (EDITABLE CON FLECHITAS) ---
        const tdNivel = document.createElement('td');

        const inputLevel = document.createElement('input');
        inputLevel.type = 'number';  // 👈 Esto activa las flechitas nativas del navegador
        inputLevel.min = '1';        // Límite mínimo
        inputLevel.max = '10';       // Límite máximo
        inputLevel.step = '1';       // Sube y baja de 1 en 1

        // Clases de W3.CSS para inputs limpios
        inputLevel.className = 'w3-input w3-border w3-round w3-small';
        inputLevel.style.width = '70px'; // Un ancho pequeño ideal para números cortos

        // 🌟 AQUÍ SE MUESTRA EL NIVEL ACTUAL:
        // Tomamos el valor que viene de la base de datos para ese alumno 'a'
        inputLevel.value = a.alumn_level; 

         // Evento 'change': Se dispara tanto si escriben el número como si usan las flechitas
        inputLevel.addEventListener('change', async (e) => {
        let nuevoLevel = parseInt(e.target.value, 10);
    
        // Control de seguridad por si escriben a mano un número inválido
         if (isNaN(nuevoLevel) || nuevoLevel < 1 || nuevoLevel > 10) {
           showModal('Error', 'El nivel debe ser entre 1 y 10');
           inputLevel.value = a.alumn_level; // Revierte al nivel que tenía antes
          return;
       }

       try {
          // Enviamos el cambio a tu API
          const result = await apiService.request(`/alumnos/update-level/${a.id}`, 'PUT', { level: nuevoLevel });
          showModal('Éxito', 'Nivel actualizado');
          a.alumn_level = nuevoLevel; // Actualizamos el registro en la memoria del navegador
       } catch (error) {
             showModal('Error', 'No se pudo guardar el nuevo nivel');
             inputLevel.value = a.alumn_level; // Revierte si el servidor falla
       }
});

         // Agregamos el input a la celda
         tdNivel.appendChild(inputLevel);


        // ------------------------------------------------

        const tdActions = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.className = 'w3-button w3-red w3-tiny w3-round';
        btnDelete.textContent = 'Borrar';
        btnDelete.addEventListener('click', () => deleteAlumn(a.id));
        tdActions.appendChild(btnDelete);

        // Mantenemos tu orden del row.append
        row.append(tdName, tdAge, tdGroup, tdNivel, tdPhone, tdActions);
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


