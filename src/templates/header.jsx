import './header.css';
import { Globe } from 'lucide-react';
import React from 'react';

function Header({ user }) {
    const currentPath = window.location.pathname;

    const links = [
        { path: '/', label: 'Inicio' },
        { path: '/sobre-nosotros', label: 'Sobre nosotros' },
        ...(user
            ? [{ path: '/mis-aplicaciones', label: 'Mis aplicaciones' }]
            : []
        ),
    ];

    return (
        <header className="header">
            <div className="header-logo">WEBGEN</div>

            <nav className="header-nav">
                {links
                    .filter(link => link.path !== currentPath)
                    .map(link => (
                        <a key={link.path} href={link.path}>
                            {link.label}
                        </a>
                    ))}
            </nav>

            <div className="header-actions">
                <button
                    className="language-button"
                    title="Cambiar idioma"
                    aria-label="Cambiar idioma"
                >
                    <Globe size={22} />
                </button>
                {user ? (
                    <a href="/perfil" className="header-login">
                        {user.username.length > 50
                            ? user.username.slice(0, 50) + '...'
                            : user.username}
                    </a>
                ) : (
                    <a href="/iniciar-sesion" className="header-login">
                        Entrar
                    </a>
                )}
            </div>
        </header>
    );
}

export default Header;