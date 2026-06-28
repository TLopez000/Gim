/**
 * adminFrontController.js (o adminController.js en el frontend)
 */

// 1. COMPROBACIÓN ANTIPARPADEO INMEDIATA
const role = sessionStorage.getItem('role');
const token = sessionStorage.getItem('token');

if (role != 'admin') {
    // Si no hay sesión, rebota al login sin mostrar nada
    window.location.href = '/login';
} else {
    // Si hay sesión, esperamos a que cargue el HTML para activar la vista correspondiente
    document.addEventListener('DOMContentLoaded', () => {
        const body = document.getElementById('pagebody');
        
        if (body) {
            // DETECTAMOS QUÉ PÁGINA ES:
            // Si en el HTML existe la tabla de usuarios, es el Panel de Admin
            if (document.getElementById('usersTableBody')) {
                body.style.display = 'block'; // Display normal para listas
                loadUsers(); // Tu función existente que carga la tabla
            } 
            // Si existe el formulario de registro, es la página de Register
            else if (document.getElementById('registerForm')) {
                body.style.display = 'flex'; // Display flex para centrar el formulario
            }
        }
    });
}


async function loadUsers() {
    try {
        const users = await apiService.request('/admin/users', 'GET');
        renderUsersTable(users);
    } catch (error) {
        showModal('Acceso denegado', error.message);
        window.location.href = '/login';
    }
}

/**
 * Renderiza la tabla de usuarios sin utilizar innerHTML para mayor seguridad
 */
function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return; // Salvaguarda extra
    
    tbody.replaceChildren();

    users.forEach(u => {
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid #2a2a2a";
        row.style.transition = "background 0.2s ease";
        row.onmouseover = () => row.style.backgroundColor = '#292929';
        row.onmouseout = () => row.style.backgroundColor = 'transparent';

        // Celda ID
        const tdId = document.createElement('td');
        tdId.style.padding = "16px";
        tdId.style.verticalAlign = "middle";
        tdId.textContent = u.id;

        // Celda Username
        const tdUser = document.createElement('td');
        tdUser.style.padding = "16px";
        tdUser.style.verticalAlign = "middle";
        const b = document.createElement('b');
        b.textContent = u.username;
        tdUser.appendChild(b);

        // Celda Rol (Estilizada en sintonía con el nuevo panel)
        const tdRole = document.createElement('td');
        tdRole.style.padding = "16px";
        tdRole.style.verticalAlign = "middle";
        const spanRole = document.createElement('span');
        spanRole.style.backgroundColor = "rgba(255, 202, 40, 0.15)";
        spanRole.style.color = "#ffca28";
        spanRole.style.padding = "4px 10px";
        spanRole.style.borderRadius = "20px";
        spanRole.style.fontWeight = "bold";
        spanRole.style.fontSize = "0.85em";
        spanRole.textContent = u.role;
        tdRole.appendChild(spanRole);

        // Celda Fecha de Registro
        const tdDate = document.createElement('td');
        tdDate.style.padding = "16px";
        tdDate.style.color = "#ccc";
        tdDate.style.verticalAlign = "middle";
        tdDate.textContent = new Date(u.created_at).toLocaleDateString();

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
        
        btnBan.addEventListener('click', () => banUser(u.id));
        tdActions.appendChild(btnBan);

        row.append(tdId, tdUser, tdRole, tdDate, tdActions);
        tbody.appendChild(row);
    });
}

async function banUser(id) {
    if (!confirm('¿Estás seguro de borrar a este usuario? Se borrarán todos sus datos de forma permanente.')) {
        return;
    }

    try {
        await apiService.request(`/admin/users/${id}`, 'DELETE');
        showModal('Éxito', 'Usuario eliminado con éxito');
        loadUsers(); 
    } catch (error) {
        showModal('Error al borrar usuario', error.message);
    }
}

// Lógica para el formulario de REGISTRO
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const user_activity = document.getElementById('user_activity').value;

        try {
            // El apiService adjuntará automáticamente el token del Admin si está en localStorage
            await apiService.request('/admin/users/register', 'POST', { username, user_activity, password });
            showModal('¡Éxito!', 'Usuario creado correctamente.');
            setTimeout(() => { window.location.href = '/admin-Dashboard'; }, 2000); // Redirige al panel de admin en vez de login
        } catch (error) {
            showModal('Error de Registro', error.message);
        }
    });
}