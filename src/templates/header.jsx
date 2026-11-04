import './header.css';

function Header() {
    const currentPath = window.location.pathname;

    const links = [
        { path: '/', label: 'Inicio' },
        { path: '/sobre-nosotros', label: 'Sobre nosotros' },
    ];

    return (
        <header className="header">
            <div className="header-logo">
                <a href="/">WEBGEN</a>
            </div>

            <nav className="header-nav">
                {links
                    .filter(link => link.path !== currentPath)
                    .map(link => (
                        <a key={link.path} href={link.path}>
                            {link.label}
                        </a>
                    ))}
            </nav>

            <a href="/login" className="header-login">
                Entrar
            </a>
        </header>
    );
}

export default Header;