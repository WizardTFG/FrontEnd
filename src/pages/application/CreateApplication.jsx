import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import './CreateApplication.css';

function CreateApplication() {
    const [step, setStep] = useState(1);

    // Datos de la aplicación
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Clínicos
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [selectedClinicians, setSelectedClinicians] = useState([]);

    // Formularios
    const [forms, setForms] = useState([]);
    const [formName, setFormName] = useState('');
    const [fields, setFields] = useState([]);

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [searching, setSearching] = useState(false);

    // Buscar clínicos
    const searchClinicians = async (value) => {
        setSearch(value);
        setError('');

        if (value.trim().length < 2) {
            setResults([]);
            return;
        }

        setSearching(true);

        try {
            const response = await apiFetch(
                `/applications/clinicians/?q=${encodeURIComponent(value)}`
            );

            if (!response.ok) {
                throw new Error('No se pudo realizar la búsqueda.');
            }

            const data = await response.json();
            setResults(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setSearching(false);
        }
    };

    // Añadir o quitar clínico
    const toggleClinician = (clinician) => {
        setSelectedClinicians((previous) => {
            const exists = previous.some(
                (item) => item.id === clinician.id
            );

            if (exists) {
                return previous.filter(
                    (item) => item.id !== clinician.id
                );
            }

            return [...previous, clinician];
        });
    };

    // Añadir campo
    const addField = () => {
        setFields((previous) => [
            ...previous,
            {
                label: '',
                type: 'text',
                required: false
            }
        ]);
    };

    // Modificar campo
    const updateField = (index, property, value) => {
        setFields((previous) =>
            previous.map((field, i) =>
                i === index
                    ? { ...field, [property]: value }
                    : field
            )
        );
    };

    // Eliminar campo
    const removeField = (index) => {
        setFields((previous) =>
            previous.filter((_, i) => i !== index)
        );
    };

    // Guardar formulario en el estado
    const addForm = () => {
        setError('');

        if (!formName.trim()) {
            setError('Introduce un nombre para el formulario.');
            return;
        }

        if (
            fields.length === 0 ||
            fields.some((field) => !field.label.trim())
        ) {
            setError('Añade al menos un campo y completa sus nombres.');
            return;
        }

        if (forms.some(
            (form) => form.name.trim().toLowerCase() ===
                formName.trim().toLowerCase()
        )) {
            setError('Ya existe un formulario con ese nombre.');
            return;
        }

        setForms((previous) => [
            ...previous,
            {
                name: formName.trim(),
                fields: fields.map((field) => ({
                    ...field,
                    label: field.label.trim()
                }))
            }
        ]);

        setFormName('');
        setFields([]);
        setError('');
    };

    // Crear aplicación
    const saveApplication = async () => {
        setError('');

        if (!name.trim()) {
            setError('Introduce un nombre para la aplicación.');
            setStep(1);
            return;
        }

        if (forms.length === 0) {
            setError('Debes añadir al menos un formulario.');
            return;
        }

        setSaving(true);

        try {
            const response = await apiFetch('/applications/', {
                method: 'POST',
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    clinician_ids: selectedClinicians.map(
                        (clinician) => clinician.id
                    ),
                    forms
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data === 'object'
                        ? JSON.stringify(data)
                        : 'No se pudo crear la aplicación.'
                );
            }

            alert('Aplicación creada correctamente.');

            window.location.href = '/mis-aplicaciones';

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="application-wizard">

            <h1>Crear aplicación</h1>

            <div className="wizard-steps">
                <span className={step === 1 ? 'active' : ''}>
                    1. Datos
                </span>

                <span className={step === 2 ? 'active' : ''}>
                    2. Clínicos
                </span>

                <span className={step === 3 ? 'active' : ''}>
                    3. Formularios
                </span>
            </div>

            {error && (
                <p className="error-message" role="alert">
                    {error}
                </p>
            )}

            {/* PASO 1 */}
            {step === 1 && (
                <section>
                    <h2>Datos de la aplicación</h2>

                    <label>Nombre</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre de la aplicación"
                        required
                    />

                    <label>Descripción</label>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción de la aplicación"
                    />

                    <button
                        type="button"
                        disabled={!name.trim()}
                        onClick={() => {
                            setError('');
                            setStep(2);
                        }}
                    >
                        Siguiente
                    </button>
                </section>
            )}

            {/* PASO 2 */}
            {step === 2 && (
                <section>
                    <h2>Asignar clínicos</h2>

                    <p>
                        Busca los profesionales que podrán acceder
                        a esta aplicación.
                    </p>

                    <input
                        type="search"
                        value={search}
                        onChange={(e) => searchClinicians(e.target.value)}
                        placeholder="Buscar por nombre o correo..."
                    />

                    {searching && <p>Buscando clínicos...</p>}

                    <div className="search-results">
                        {results.map((clinician) => {
                            const selected = selectedClinicians.some(
                                (item) => item.id === clinician.id
                            );

                            return (
                                <div key={clinician.id}>
                                    <div>
                                        <strong>{clinician.name}</strong>
                                        <p>{clinician.email}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleClinician(clinician)
                                        }
                                    >
                                        {selected ? 'Quitar' : 'Añadir'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <h3>
                        Clínicos seleccionados ({selectedClinicians.length})
                    </h3>

                    {selectedClinicians.map((clinician) => (
                        <div key={clinician.id}>
                            {clinician.name}

                            <button
                                type="button"
                                onClick={() => toggleClinician(clinician)}
                            >
                                Quitar
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setError('');
                            setStep(1);
                        }}
                    >
                        Anterior
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setError('');
                            setStep(3);
                        }}
                    >
                        Siguiente
                    </button>
                </section>
            )}

            {/* PASO 3 */}
            {step === 3 && (
                <section>
                    <h2>Configurar formularios</h2>

                    <label>Nombre del formulario</label>

                    <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ej. Primera visita"
                    />

                    <h3>Campos del formulario</h3>

                    {fields.map((field, index) => (
                        <div key={index} className="form-field-editor">

                            <input
                                type="text"
                                value={field.label}
                                onChange={(e) =>
                                    updateField(
                                        index,
                                        'label',
                                        e.target.value
                                    )
                                }
                                placeholder="Nombre del campo"
                            />

                            <select
                                value={field.type}
                                onChange={(e) =>
                                    updateField(
                                        index,
                                        'type',
                                        e.target.value
                                    )
                                }
                            >
                                <option value="text">Texto</option>
                                <option value="textarea">Texto largo</option>
                                <option value="number">Número</option>
                                <option value="date">Fecha</option>
                                <option value="checkbox">Casilla</option>
                            </select>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'required',
                                            e.target.checked
                                        )
                                    }
                                />
                                Obligatorio
                            </label>

                            <button
                                type="button"
                                onClick={() => removeField(index)}
                            >
                                Eliminar campo
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addField}>
                        Añadir campo
                    </button>

                    <button type="button" onClick={addForm}>
                        Guardar formulario
                    </button>

                    <h3>Formularios añadidos</h3>

                    {forms.map((form, index) => (
                        <div key={index}>
                            <strong>{form.name}</strong>
                            <span> ({form.fields.length} campos)</span>

                            <button
                                type="button"
                                onClick={() =>
                                    setForms((previous) =>
                                        previous.filter((_, i) => i !== index)
                                    )
                                }
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setError('');
                            setStep(2);
                        }}
                    >
                        Anterior
                    </button>

                    <button
                        type="button"
                        onClick={saveApplication}
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Crear aplicación'}
                    </button>
                </section>
            )}
        </main>
    );
}

export default CreateApplication;
