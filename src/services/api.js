const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('VITE_API_URL no está configurada');
}

export async function getApiStatus() {
    const response = await fetch(`${API_URL}/test/`);

    if (!response.ok) {
        throw new Error('No se ha podido conectar con el servidor');
    }

    return response.json();
}