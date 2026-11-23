import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateApplication from '../pages/application/CreateApplication';
import { apiFetch } from '../services/api';

vi.mock('../services/api', () => ({
    apiFetch: vi.fn(),
}));

describe('CreateApplication', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Muestra el primer paso y deshabilita Siguiente si no hay nombre', () => {
        render(<CreateApplication />);

        expect(
            screen.getByRole('heading', { name: 'Crear aplicación' })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', { name: 'Siguiente' })
        ).toBeDisabled();
    });

    it('Permite buscar y seleccionar clínicos', async () => {
        const user = userEvent.setup();

        apiFetch.mockResolvedValue({
            ok: true,
            json: async () => [
                { id: 1, name: 'Ana García', email: 'ana@test.com' },
            ],
        });

        render(<CreateApplication />);

        await user.type(
            screen.getByPlaceholderText('Nombre de la aplicación'),
            'Clínica Demo'
        );

        await user.click(screen.getByRole('button', { name: 'Siguiente' }));

        await user.type(
            screen.getByPlaceholderText('Buscar por nombre o correo...'),
            'Ana'
        );

        expect(await screen.findByText('Ana García')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Añadir' }));

        expect(
            screen.getByText('Clínicos seleccionados (1)')
        ).toBeInTheDocument();
    });

    it('Valida que el formulario tenga nombre y campos', async () => {
        const user = userEvent.setup();

        render(<CreateApplication />);

        await user.type(
            screen.getByPlaceholderText('Nombre de la aplicación'),
            'Clínica Demo'
        );

        await user.click(screen.getByRole('button', { name: 'Siguiente' }));
        await user.click(screen.getByRole('button', { name: 'Siguiente' }));

        await user.click(
            screen.getByRole('button', { name: 'Guardar formulario' })
        );

        expect(
            screen.getByText('Introduce un nombre para el formulario.')
        ).toBeInTheDocument();

        await user.type(
            screen.getByPlaceholderText('Ej. Primera visita'),
            'Primera visita'
        );

        await user.click(
            screen.getByRole('button', { name: 'Guardar formulario' })
        );

        expect(
            screen.getByText('Añade al menos un campo y completa sus nombres.')
        ).toBeInTheDocument();
    });

    it('Permite añadir un formulario con un campo', async () => {
        const user = userEvent.setup();

        render(<CreateApplication />);

        await user.type(
            screen.getByPlaceholderText('Nombre de la aplicación'),
            'Clínica Demo'
        );

        await user.click(screen.getByRole('button', { name: 'Siguiente' }));
        await user.click(screen.getByRole('button', { name: 'Siguiente' }));

        await user.type(
            screen.getByPlaceholderText('Ej. Primera visita'),
            'Primera visita'
        );

        await user.click(screen.getByRole('button', { name: 'Añadir campo' }));

        await user.type(
            screen.getByPlaceholderText('Nombre del campo'),
            'Nombre del paciente'
        );

        await user.click(
            screen.getByRole('button', { name: 'Guardar formulario' })
        );

        expect(screen.getByText('Primera visita')).toBeInTheDocument();
        expect(screen.getByText('(1 campos)')).toBeInTheDocument();
    });

    it('Impide crear la aplicación si no se ha añadido ningún formulario', async () => {
        const user = userEvent.setup();

        render(<CreateApplication />);

        await user.type(
            screen.getByPlaceholderText('Nombre de la aplicación'),
            'Clínica Demo'
        );

        await user.click(screen.getByRole('button', { name: 'Siguiente' }));
        await user.click(screen.getByRole('button', { name: 'Siguiente' }));

        await user.click(
            screen.getByRole('button', { name: 'Crear aplicación' })
        );

        expect(
            screen.getByText('Debes añadir al menos un formulario.')
        ).toBeInTheDocument();

        expect(apiFetch).not.toHaveBeenCalled();
    });
});