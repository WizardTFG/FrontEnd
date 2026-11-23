
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('VITE_API_URL no está configurada');
}

// Realizar peticiones a la API
export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('access');

    return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            ...options.headers
        }
    });
}
