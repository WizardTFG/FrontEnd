import { useEffect, useState } from 'react';
import './PublicApplication.css';

import React from 'react';

function PublicApplication({ slug }) {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadApplication = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/applications/${slug}/`
                );

                if (!response.ok) {
                    throw new Error(
                        response.status === 404
                            ? 'No se ha encontrado esta aplicación.'
                            : 'No se ha podido cargar la aplicación.'
                    );
                }

                const data = await response.json();

                if (active) {
                    setApplication(data);
                }
            } catch (err) {
                if (active) {
                    setError(err.message);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadApplication();

        return () => {
            active = false;
        };
    }, [slug]);

    if (loading) {
        return (
            <main className="public-loading">
                <div className="loading-spinner"></div>
                <p>Cargando aplicación...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="public-error">
                <div className="public-error-card">
                    <span className="public-error-icon">!</span>
                    <h1>Aplicación no disponible</h1>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    if (!application) {
        return null;
    }

    return (
        <main className="public-application">
            <header className="public-header">
                <div className="public-header-content">
                    <div className="public-logo">
                        <span className="public-logo-icon">+</span>
                        <span>WEBGEN</span>
                    </div>
                </div>
            </header>

            <div className="public-container">
                <section className="public-intro">
                    <span className="public-label">
                        FORMULARIO
                    </span>

                    <h1>{application.name}</h1>

                    {application.description && (
                        <p>{application.description}</p>
                    )}
                </section>

                <form
                    className="public-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        alert('El envío de respuestas todavía no está implementado.');
                    }}
                >
                    {application.forms?.length > 0 ? (
                        application.forms.map((form, formIndex) => (
                            <section
                                className="public-form-section"
                                key={form.id}
                            >
                                <div className="public-form-heading">
                                    <span className="form-number">
                                        {String(formIndex + 1).padStart(2, '0')}
                                    </span>

                                    <h2>{form.name}</h2>
                                </div>

                                <div className="public-fields">
                                    {form.fields?.map((field, index) => (
                                        <div
                                            className="public-field"
                                            key={index}
                                        >
                                            <label htmlFor={`field-${form.id}-${index}`}>
                                                {field.label || 'Campo sin nombre'}

                                                {field.required && (
                                                    <span className="required-mark">
                                                        *
                                                    </span>
                                                )}
                                            </label>

                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    id={`field-${form.id}-${index}`}
                                                    name={`field-${form.id}-${index}`}
                                                    required={field.required}
                                                    placeholder="Escribe tu respuesta..."
                                                    rows="4"
                                                />
                                            ) : field.type === 'checkbox' ? (
                                                <label className="checkbox-field">
                                                    <input
                                                        id={`field-${form.id}-${index}`}
                                                        name={`field-${form.id}-${index}`}
                                                        type="checkbox"
                                                        required={field.required}
                                                    />
                                                    <span>
                                                        {field.label || 'Sí'}
                                                    </span>
                                                </label>
                                            ) : (
                                                <input
                                                    id={`field-${form.id}-${index}`}
                                                    name={`field-${form.id}-${index}`}
                                                    type={
                                                        ['text', 'number', 'date'].includes(field.type)
                                                            ? field.type
                                                            : 'text'
                                                    }
                                                    required={field.required}
                                                    placeholder="Escribe tu respuesta..."
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <p className="public-empty">
                            Esta aplicación todavía no tiene formularios.
                        </p>
                    )}

                    {application.forms?.length > 0 && (
                        <div className="public-form-actions">
                            <button type="submit">
                                Enviar respuestas
                            </button>
                        </div>
                    )}
                </form>

                <footer className="public-footer">
                    <p>Formulario gestionado con WEBGEN</p>
                </footer>
            </div>
        </main>
    );
}

export default PublicApplication;