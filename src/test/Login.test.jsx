import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';

vi.mock('@react-oauth/google', () => ({
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
    GoogleLogin: ({ onSuccess, onError }) => (
        <div>
            <button onClick={() => onSuccess({ credential: 'google-token' })}>
                Google Login
            </button>
            <button onClick={onError}>Error Google</button>
        </div>
    ),
}));

describe('Login', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.stubGlobal('fetch', vi.fn());
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('Muestra el formulario de inicio de sesión', () => {
        render(<Login />);

        expect(screen.getByRole('heading', {
            name: 'Iniciar sesión',
        })).toBeInTheDocument();

        expect(screen.getByText(
            'Accede a tu cuenta para continuar.'
        )).toBeInTheDocument();

        expect(screen.getByRole('button', {
            name: 'Google Login',
        })).toBeInTheDocument();
    });

    it('Inicia sesión correctamente y guarda los tokens', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                access: 'access-token',
                refresh: 'refresh-token',
            }),
        });

        render(<Login />);

        fireEvent.click(screen.getByRole('button', {
            name: 'Google Login',
        }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${import.meta.env.VITE_API_URL}/auth/google/`,
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        credential: 'google-token',
                    }),
                })
            );

            expect(localStorage.getItem('access')).toBe('access-token');
            expect(localStorage.getItem('refresh')).toBe('refresh-token');
        });
    });

    it('Muestra un error si falla la autenticación', async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: 'Credenciales inválidas',
            }),
        });

        render(<Login />);

        fireEvent.click(screen.getByRole('button', {
            name: 'Google Login',
        }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                'Credenciales inválidas'
            );
        });

        expect(localStorage.getItem('access')).toBeNull();
    });

    it('Muestra un error si falla la conexión', async () => {
        fetch.mockRejectedValue(new Error('Error de conexión'));

        render(<Login />);

        fireEvent.click(screen.getByRole('button', {
            name: 'Google Login',
        }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                'Error de conexión'
            );
        });
    });

    it('Muestra una alerta si Google devuelve un error', () => {
        render(<Login />);

        fireEvent.click(screen.getByRole('button', {
            name: 'Error Google',
        }));

        expect(window.alert).toHaveBeenCalledWith('Error con Google');
    });
});