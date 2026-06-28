/**
 * Utilidad para gestionar la persistencia de la sesión
 * Centraliza el uso de localStorage/sessionStorage
 */
 const authHelper = {
    /**
     * Se puede cambiar 'localStorage' por 'sessionStorage' aquí y afectará a toda la app
     * Cambiar a sessionStorage si se prefiere mayor seguridad en equipos compartidos
     */    
    storage: (() => {
        try {
            // Intentar acceder a localStorage para verificar disponibilidad
            const test = '__test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return sessionStorage;
        } catch (e) {
            // Si sessionStorage no está disponible, usar localStorage
            console.warn('sessionStorage no disponible, usando localStorage');
            return localStorage;
        }
    })(),

    saveSession(token, role) {
        try {
            this.storage.setItem('token', token);
            this.storage.setItem('role', role);
            console.log('Sesión guardada correctamente');
        } catch (e) {
            console.error('Error al guardar sesión:', e);
        }
    },

    getToken() {
        try {
            const token = this.storage.getItem('token');
            console.log('Token recuperado:', token ? 'Presente' : 'Ausente');
            return token;
        } catch (e) {
            console.error('Error al obtener token:', e);
            return null;
        }
    },

    logout() {
        try {
            this.storage.clear();
        } catch (e) {
            console.error('Error al limpiar almacenamiento:', e);
        }
        window.location.href = '/login';
    },

    // Buscamos botones de logout por clase para evitar onclick en HTML
    initLogoutButtons() {
        const logoutBtns = document.querySelectorAll('.btn-logout');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.logout());
        });
    }
};

// Inicializar escuchadores de logout al cargar
document.addEventListener('DOMContentLoaded', () => authHelper.initLogoutButtons());