import React, { useEffect, useState } from 'react';
import './PublicApplication.css';

function PublicApplication({ slug }) {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [submitError, setSubmitError] = useState('');

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitting(true);
        setSuccess('');
        setSubmitError('');

        const formElement = event.currentTarget;
        const answers = {};

        application.forms.forEach((form) => {
            form.fields.forEach((field, index) => {
                const key = `field-${form.id}-${index}`;
                const input = formElement.elements.namedItem(key);

                if (field.type === 'checkbox') {
                    answers[key] = input.checked;
                } else {
                    answers[key] = input.value;
                }
            });
        });

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/applications/${slug}/responses/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ answers })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data === 'object'
                        ? JSON.stringify(data)
                        : 'No se pudieron enviar las respuestas.'
                );
            }

            setSuccess(
                'Las respuestas se han enviado correctamente.'
            );

            formElement.reset();

        } catch (err) {
            setSubmitError(err.message);

        } finally {
            setSubmitting(false);
        }
    };

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
                    onSubmit={handleSubmit}
                >

                    {success && (
                        <p role="status" className="success-message">
                            {success}
                        </p>
                    )}

                    {submitError && (
                        <p role="alert" className="error-message">
                            {submitError}
                        </p>
                    )}

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

                                    {form.fields?.map((field, index) => {

                                        const fieldId = `field-${form.id}-${index}`;

                                        return (
                                            <div
                                                className="public-field"
                                                key={fieldId}
                                            >

                                                <label htmlFor={fieldId}>
                                                    {field.label || 'Campo sin nombre'}

                                                    {field.required && (
                                                        <span className="required-mark">
                                                            *
                                                        </span>
                                                    )}
                                                </label>

                                                {field.type === 'textarea' ? (

                                                    <textarea
                                                        id={fieldId}
                                                        name={fieldId}
                                                        required={field.required}
                                                        placeholder="Escribe tu respuesta..."
                                                        rows="4"
                                                    />

                                                ) : field.type === 'checkbox' ? (

                                                    <label className="checkbox-field">
                                                        <input
                                                            id={fieldId}
                                                            name={fieldId}
                                                            type="checkbox"
                                                            required={field.required}
                                                        />

                                                        <span>
                                                            {field.label || 'Sí'}
                                                        </span>
                                                    </label>

                                                ) : (

                                                    <input
                                                        id={fieldId}
                                                        name={fieldId}
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
                                        );
                                    })}

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

                            <button
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? 'Enviando...'
                                    : 'Enviar respuestas'}
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