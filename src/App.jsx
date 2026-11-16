import { useState, useEffect } from 'react';

import Header from './templates/header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Aplicaciones from './pages/Aplicaciones';
import Perfil from './pages/Perfil';

const pages = {
    '/': Home,
    '/sobre-nosotros': About,
    '/iniciar-sesion': Login,
    '/mis-aplicaciones': Aplicaciones,
    '/perfil': Perfil,
};

function App() {
    const Page = pages[window.location.pathname];

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access');

        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/auth/me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Sesión no válida');
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(() => {
                setUser(null);
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            })
            .finally(() => setLoading(false));

    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <>
            <Header user={user} />

            {Page ? (
                <Page user={user} />
            ) : (
                <h1>404 - Página no encontrada</h1>
            )}
        </>
    );
}

export default App;