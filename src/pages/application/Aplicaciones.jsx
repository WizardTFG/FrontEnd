import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import './Aplicaciones.css';

function Aplicaciones({ user }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadApplications = async () => {
            try {
                const response = await apiFetch(
                    '/applications/my-applications/'
                );

                if (!response.ok) {
                    throw new Error(
                        'No se pudieron cargar las aplicaciones.'
                    );
                }

                const data = await response.json();

                if (active) {
                    setApplications(data);
                }
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadApplications();

        return () => {
            active = false;
        };
    }, []);

    const openApplication = (slug) => {
        window.open(
            `http://${slug}.localhost:5173`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    const editApplication = (slug) => {
        window.location.href = `/editar-aplicacion/${slug}`;
    };

    if (loading) {
        return (
            <main className="applications-page">
                <p className="applications-loading">
                    Cargando aplicaciones...
                </p>
            </main>
        );
    }

    return (
        <main className="applications-page">
            <header className="applications-header">
                <div>
                    <h1>Mis aplicaciones</h1>
                    <p>
                        Gestiona tus aplicaciones y accede a sus espacios
                        de trabajo.
                    </p>
                </div>

                {user?.is_admin && (
                    <button
                        className="create-application-button"
                        type="button"
                        onClick={() => {
                            window.location.href = '/crear-aplicacion';
                        }}
                    >
                        <span>+</span> Crear aplicación
                    </button>
                )}
            </header>

            {error && (
                <p className="applications-error" role="alert">
                    {error}
                </p>
            )}

            {!error && applications.length === 0 && (
                <section className="applications-empty">
                    <div className="empty-icon">▤</div>
                    <h2>Aún no tienes aplicaciones</h2>
                    <p>
                        Cuando tengas aplicaciones disponibles,
                        aparecerán aquí.
                    </p>

                    {user?.is_admin && (
                        <button
                            type="button"
                            className="create-application-button"
                            onClick={() => {
                                window.location.href = '/crear-aplicacion';
                            }}
                        >
                            Crear mi primera aplicación
                        </button>
                    )}
                </section>
            )}

            {!error && applications.length > 0 && (
                <section className="applications-grid">
                    {applications.map((application) => (
                        <article
                            className="application-card"
                            key={application.id}
                        >
                            <div className="application-card-top">
                                <div className="application-icon">
                                    {application.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                {user?.is_admin && (
                                    <button
                                        type="button"
                                        className="edit-application-button"
                                        onClick={() =>
                                            editApplication(application.slug)
                                        }
                                        aria-label={`Modificar ${application.name}`}
                                        title="Modificar aplicación"
                                    >
                                        ✎
                                    </button>
                                )}
                            </div>

                            <h2>
                                <a
                                    className="application-title-link"
                                    href={`http://${application.slug}.localhost:5173`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {application.name}
                                </a>
                            </h2>

                            <p className="application-description">
                                {application.description ||
                                    'Sin descripción disponible.'}
                            </p>

                            <div className="application-stats">
                                <div className="application-stat">
                                    <span className="stat-number">
                                        {application.clinicians?.length ?? 0}
                                    </span>
                                    <span className="stat-label">
                                        Profesionales
                                    </span>
                                </div>

                                <div className="application-stat">
                                    <span className="stat-number">
                                        {application.forms?.length ?? 0}
                                    </span>
                                    <span className="stat-label">
                                        Formularios
                                    </span>
                                </div>
                            </div>

                            <a
                                className="open-application-link"
                                href={`http://${application.slug}.localhost:5173`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Abrir aplicación <span>↗</span>
                            </a>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default Aplicaciones;
