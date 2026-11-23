import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Aplicaciones from '../pages/application/Aplicaciones';
import { apiFetch } from '../services/api';

vi.mock('../services/api', () => ({
    apiFetch: vi.fn(),
}));

describe('Aplicaciones', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Muestra el mensaje de carga mientras obtiene las aplicaciones', () => {
        apiFetch.mockReturnValue(new Promise(() => {}));

        render(<Aplicaciones user={{ is_admin: false }} />);

        expect(
            screen.getByText('Cargando aplicaciones...')
        ).toBeInTheDocument();
    });

    it('Muestra las aplicaciones obtenidas de la API', async () => {
        apiFetch.mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    id: 1,
                    name: 'Clínica Demo',
                    slug: 'clinica-demo',
                    description: 'Aplicación de prueba',
                    clinicians: [{ id: 1 }, { id: 2 }],
                    forms: [{ id: 1 }],
                },
            ],
        });

        render(<Aplicaciones user={{ is_admin: false }} />);

        expect(
            await screen.findByRole('heading', {
                name: 'Mis aplicaciones',
            })
        ).toBeInTheDocument();

        expect(screen.getByText('Clínica Demo')).toBeInTheDocument();
        expect(screen.getByText('Aplicación de prueba')).toBeInTheDocument();
        expect(screen.getByText('Profesionales')).toBeInTheDocument();
        expect(screen.getByText('Formularios')).toBeInTheDocument();

        expect(
            screen.getByRole('link', { name: /Abrir aplicación/ })
        ).toHaveAttribute(
            'href',
            'http://clinica-demo.localhost:5173'
        );

        expect(apiFetch).toHaveBeenCalledWith(
            '/applications/my-applications/'
        );
    });

    it('Muestra el mensaje cuando no hay aplicaciones', async () => {
        apiFetch.mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        render(<Aplicaciones user={{ is_admin: false }} />);

        expect(
            await screen.findByRole('heading', {
                name: 'Aún no tienes aplicaciones',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'Cuando tengas aplicaciones disponibles, aparecerán aquí.'
            )
        ).toBeInTheDocument();
    });

    it('Muestra las opciones de administración si el usuario es administrador', async () => {
        apiFetch.mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    id: 1,
                    name: 'Clínica Demo',
                    slug: 'clinica-demo',
                    description: 'Aplicación de prueba',
                    clinicians: [],
                    forms: [],
                },
            ],
        });

        render(<Aplicaciones user={{ is_admin: true }} />);

        expect(
            await screen.findByRole('button', {
                name: /Crear aplicación/,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Modificar Clínica Demo',
            })
        ).toBeInTheDocument();
    });

    it('Muestra un mensaje de error si falla la carga', async () => {
        apiFetch.mockResolvedValue({
            ok: false,
        });

        render(<Aplicaciones user={{ is_admin: false }} />);

        expect(
            await screen.findByRole('alert')
        ).toHaveTextContent(
            'No se pudieron cargar las aplicaciones.'
        );
    });
});