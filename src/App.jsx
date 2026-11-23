import { useState, useEffect } from 'react';

import Header from './templates/header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Aplicaciones from './pages/application/Aplicaciones';
import CreateApplication from './pages/application/CreateApplication';
import Perfil from './pages/Perfil';
import PublicApplication from './pages/application/PublicApplication';

// Rutas públicas
const pages = {
    '/': Home,
    '/sobre-nosotros': About,
    '/iniciar-sesion': Login,
};

// Rutas que requieren iniciar sesión
const protectedPages = {
    '/mis-aplicaciones': {
        component: Aplicaciones,
    },
    '/crear-aplicacion': {
        component: CreateApplication,
        adminOnly: true,
    },
    '/perfil': {
        component: Perfil,
    },
};

function App() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    const isSubdomain = hostname.endsWith('.localhost');
    const slug = isSubdomain
        ? hostname.replace('.localhost', '')
        : null;

    const Page = pages[pathname];
    const protectedRoute = protectedPages[pathname];

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

    if (loading) {
        return <p>Cargando...</p>;
    }

    // Aplicación pública cargada desde su subdominio.
    if (isSubdomain) {
        return <PublicApplication slug={slug} />;
    }

    // Rutas protegidas.
    if (protectedRoute) {
        if (!user) {
            window.location.replace('/iniciar-sesion');
            return null;
        }

        if (protectedRoute.adminOnly && !user.is_admin) {
            return (
                <>
                    <Header user={user} />
                    <h1>No tienes permisos para acceder a esta página.</h1>
                </>
            );
        }

        const ProtectedPage = protectedRoute.component;

        return (
            <>
                <Header user={user} />
                <ProtectedPage user={user} />
            </>
        );
    }

    // Rutas públicas.
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