// Configuración base de la API
const API_URL = "/api";

const apiService = {
    // Función centralizada para peticiones Fetch
    async request(endpoint, method = 'GET', data = null, isFormData = false) {
        // Usamos el helper en lugar de acceder directo a localStorage o sessionStorage
        const token = authHelper.getToken();
        
        const headers = {};
        if (!isFormData) headers['Content-Type'] = 'application/json';
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const config = { method, headers };
        if (data) {
            // Si es FormData (para archivos), no se stringifica
            config.body = isFormData ? data : JSON.stringify(data);
        }

        const response = await fetch(`${API_URL}${endpoint}`, config);
        const result = await response.json();

        // Si el token expiró (401), forzamos logout automático
        // Ejecutar logout tras 2,5 segundos (2500 ms) - para dar tiempo a mostrar el mensaje de error antes de redirigir
        if (response.status === 401) {
            setTimeout(() => authHelper.logout(), 2500);
            throw new Error('Sesión inválida o corrompida. Vuelva a iniciar sesión.');
        }

        if (!response.ok) throw new Error(result.message || 'Error en la petición');
        
        return result;
    }
};