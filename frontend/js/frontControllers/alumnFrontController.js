let teachers = []; // 🌟 Variable global para almacenar los profesores

document.addEventListener('DOMContentLoaded', async () => {
    // 1. 🚨 CORREGIDO: Centralizamos la carga inicial de datos de manera limpia
    await loadAlumns(); 
    await loadTeachers(); // Esta función ahora se encarga de rellenar la lista y los selectores
    
    // 2. Inicializar los eventos de los Filtros (Buscar y Borrar)
    initFilterEvents();

    // 3. Escuchadores para alternar entre Alumnos y Profesores
    initViewTabs();

    // 4. Escuchador para añadir profesor
    createTeacher();
});

// --- EVENTOS DE FILTRADO ---
function initFilterEvents() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Capturamos ambos selectores del HTML
            const group = document.getElementById('selectGroup').value;
            const level = document.getElementById('selectLevel').value;
            
            // Si el grupo es "all", convertimos la lógica o llamamos al filtro correspondiente
            if (group === "all" && level === "0") {
                await loadAlumns();
            } else {
                await loadAlumnsByFilter(group, level);
            }
        });
    }

    const btnClearFilter = document.getElementById('btnClearFilter');
    if (btnClearFilter) {
        btnClearFilter.addEventListener('click', async () => {
            document.getElementById('selectGroup').value = "all";
            document.getElementById('selectLevel').value = "0";
            await loadAlumns();
        });
    }
}

// --- FUNCIÓN PARA LOS BOTONES DE CAMBIO DE VISTA ---
function initViewTabs() {
    const btnViewAlumns = document.getElementById('btnViewAlumns');
    const btnViewTeachers = document.getElementById('btnViewTeachers');

    if (btnViewAlumns && btnViewTeachers) {
        
        // Clic en pestaña Alumnos
        btnViewAlumns.addEventListener('click', () => {
            btnViewAlumns.className = "w3-button w3-red w3-round-large";
            btnViewTeachers.className = "w3-button w3-black w3-border w3-border-dark-grey w3-text-grey w3-round-large";
            
            document.getElementById('addTeacherForm').classList.add('w3-hide');
            document.getElementById('containerAlumns').classList.remove('w3-hide');
            document.getElementById('filterSection').classList.remove('w3-hide');
            document.getElementById('containerTeachers').classList.add('w3-hide');
            document.getElementById('tableTitle').textContent = "Listado de Alumnos";
            
            loadAlumns(); 
        });

        // Clic en pestaña Profesores
        btnViewTeachers.addEventListener('click', () => {
            btnViewAlumns.className = "w3-button w3-black w3-border w3-border-dark-grey w3-text-grey w3-round-large";
            btnViewTeachers.className = "w3-button w3-red w3-round-large";

            document.getElementById('addTeacherForm').classList.remove('w3-hide');
            document.getElementById('containerAlumns').classList.add('w3-hide');
            document.getElementById('filterSection').classList.add('w3-hide'); 
            document.getElementById('containerTeachers').classList.remove('w3-hide');
            document.getElementById('tableTitle').textContent = "Listado de Profesores";
            
            renderTeachersTable(); 
        });
    }
}

// --- FUNCIÓN PARA RENDERIZAR LAS TABLAS ---


function renderTeachersTable() {
    // 🚨 CORREGIDO: Apuntamos al cuerpo de la tabla (tbody) y no al contenedor DIV principal
    const tbody = document.getElementById('teachersTableBody');
    if (!tbody) return;
    tbody.replaceChildren();

    teachers.forEach(t => {
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid #2a2a2a";

        // Nombre del profesor
        const tdName = document.createElement('td');
        tdName.style.padding = "16px";
        tdName.textContent = t.teacher_name;

        // Columna de Alumnos Activos
        const tdActivos = document.createElement('td');
        tdActivos.style.padding = "16px";
        tdActivos.textContent = "-";

        // Acciones para el profesor
        // Celda Acciones
        const tdActions = document.createElement('td');
        tdActions.style.padding = "16px";
        tdActions.style.textAlign = "center";
        tdActions.style.verticalAlign = "middle";
        
        const btnBan = document.createElement('button');
        btnBan.className = "w3-button w3-round-large";
        btnBan.style.backgroundColor = "#ff4d4d";
        btnBan.style.color = "white";
        btnBan.style.padding = "6px 14px";
        btnBan.style.fontSize = "0.85em";
        btnBan.style.fontWeight = "bold";
        btnBan.style.border = "none";
        btnBan.style.cursor = "pointer";
        btnBan.textContent = "Eliminar";
        
        btnBan.addEventListener('click', () => deleteTeacher(t.id));
        tdActions.appendChild(btnBan);

        row.append(tdName, tdActivos, tdActions);
        tbody.appendChild(row);
    });
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
        const selectGroup = document.createElement('select');
        selectGroup.className = 'w3-select w3-border w3-round w3-small';
        selectGroup.style.width = '120px'; 
        
        let options = ['Sin grupo','Ludmila', 'Messi','Fede','Ronaldinho']; 
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (opt === a.alumn_group) {
                option.selected = true; 
            }
            selectGroup.appendChild(option);
        });

        selectGroup.addEventListener('change', async (e) => {
            const nuevoGrupo = e.target.value;
            try {
                await apiService.request(`/alumnos/update-group/${a.id}`, 'PUT', { group: nuevoGrupo });
                showModal('Éxito', 'Grupo actualizado');
                a.alumn_group = nuevoGrupo; 
            }
            catch (error) {
                showModal('Error', 'No se pudo actualizar el grupo: ' + error.message);
                selectGroup.value = a.alumn_group; 
            }
        });

        tdGroup.appendChild(selectGroup);

        const tdPhone = document.createElement('td');
        tdPhone.textContent = a.phone;

        const tdNivel = document.createElement('td');
        const inputLevel = document.createElement('input');
        inputLevel.type = 'number';  
        inputLevel.min = '1';        
        inputLevel.max = '10';       
        inputLevel.step = '1';       
        inputLevel.className = 'w3-input w3-border w3-round w3-small';
        inputLevel.style.width = '70px'; 
        inputLevel.value = a.alumn_level; 

        inputLevel.addEventListener('change', async (e) => {
            let nuevoLevel = parseInt(e.target.value, 10);
        
            if (isNaN(nuevoLevel) || nuevoLevel < 1 || nuevoLevel > 10) {
               showModal('Error', 'El nivel debe ser entre 1 y 10');
               inputLevel.value = a.alumn_level; 
               return;
            }

            try {
               await apiService.request(`/alumnos/update-level/${a.id}`, 'PUT', { level: nuevoLevel });
               showModal('Éxito', 'Nivel actualizado');
               a.alumn_level = nuevoLevel; 
            } catch (error) {
               showModal('Error', 'No se pudo guardar el nuevo nivel');
               inputLevel.value = a.alumn_level; 
            }
        });

        tdNivel.appendChild(inputLevel);

        const tdActions = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.className = 'w3-button w3-red w3-tiny w3-round';
        btnDelete.textContent = 'Borrar';
        btnDelete.addEventListener('click', () => deleteAlumn(a.id));
        tdActions.appendChild(btnDelete);

        row.append(tdName, tdAge, tdGroup, tdNivel, tdPhone, tdActions);
        tbody.appendChild(row);
    });
}

//--------- FUNCIONES PARA TEACHERS ---------

async function loadTeachers() {
    try {
        teachers = await apiService.request('/teachers/my-teachers', 'GET');
        renderTeachersTable(teachers);
    } catch (error) {
        showModal('Error', 'No se pudieron cargar los profesores: ' + error.message);
    }
}

async function createTeacher() { 
    const form = document.getElementById('addTeacherForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const teacherData = {
                    teacher_name: document.getElementById('teacherName').value,
                }

                const response = await apiService.request('/teachers/create', 'POST', teacherData);
                
                showModal('Éxito', 'Profesor creado correctamente');
                form.reset(); // 🌟 Limpia el input de texto automáticamente

                // 🌟 Actualiza la tabla en tiempo real
                await loadTeachers(); 
                renderTeachersTable();
            }
            catch(error) {
                showModal('Error', 'No se pudo crear el profesor: ' + error.message);
            }
        });
    }
} 

async function deleteTeacher(id) {
    if (!confirm('¿Estás seguro de borrar a este usuario? Se borrarán todos sus datos de forma permanente.')) {
        return;
    }

    try {
        await apiService.request(`/teachers/${id}`, 'DELETE');
        showModal('Éxito', 'Profesor eliminado con éxito');
        loadTeachers(); 
    } catch (error) {
        showModal('Error al borrar profesor', error.message);
    }
}

// ------------- FUNCIONES PARA ALUMNOS---------------


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

async function loadAlumnsByFilter(group, level) { 
    try {
       const alumns = await apiService.request(`/alumnos/filter/${group}/${level}`, 'GET');
       renderAlumnsTable(alumns);
    }
    catch (error) {
        showModal('Error', 'No se pudieron cargar los alumnos filtrados: ' + error.message);
    }
}

async function loadAlumns() {
    try {
        const alumns = await apiService.request('/alumnos/my-alumns', 'GET');
        renderAlumnsTable(alumns);
    } catch (error) {
        showModal('Error', 'No se pudieron cargar los alumnos: ' + error.message);
    }
}


