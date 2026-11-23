import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PublicApplication from '../pages/application/PublicApplication';

describe('PublicApplication', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('alert', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('Muestra el mensaje de carga', () => {
        fetch.mockReturnValue(new Promise(() => {}));

        render(<PublicApplication slug="clinica-demo" />);

        expect(screen.getByText('Cargando aplicación...')).toBeInTheDocument();
    });

    it('Muestra los datos y formularios de la aplicación', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                name: 'Clínica Demo',
                description: 'Descripción de prueba',
                forms: [
                    {
                        id: 1,
                        name: 'Primera visita',
                        fields: [
                            {
                                label: 'Nombre',
                                type: 'text',
                                required: true,
                            },
                        ],
                    },
                ],
            }),
        });

        render(<PublicApplication slug="clinica-demo" />);

        expect(
            await screen.findByRole('heading', { name: 'Clínica Demo' })
        ).toBeInTheDocument();

        expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Primera visita' })).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre/)).toBeRequired();
    });

    it('Muestra un mensaje si no hay formularios', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                name: 'Clínica Demo',
                forms: [],
            }),
        });

        render(<PublicApplication slug="clinica-demo" />);

        expect(
            await screen.findByText('Esta aplicación todavía no tiene formularios.')
        ).toBeInTheDocument();
    });

    it('Muestra un error si falla la petición', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 404,
        });

        render(<PublicApplication slug="clinica-demo" />);

        expect(
            await screen.findByText('No se ha encontrado esta aplicación.')
        ).toBeInTheDocument();
    });

    it('Muestra un aviso al intentar enviar el formulario', async () => {
        const user = userEvent.setup();

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                name: 'Clínica Demo',
                forms: [
                    {
                        id: 1,
                        name: 'Primera visita',
                        fields: [],
                    },
                ],
            }),
        });

        render(<PublicApplication slug="clinica-demo" />);

        await user.click(
            await screen.findByRole('button', { name: 'Enviar respuestas' })
        );

        expect(alert).toHaveBeenCalledWith(
            'El envío de respuestas todavía no está implementado.'
        );
    });
});