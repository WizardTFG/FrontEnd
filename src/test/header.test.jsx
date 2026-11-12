import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import Header from "../templates/header.jsx";

describe('Pruebas del Header', () => {

    it('Muestra Entrar cuando no se ha iniciado sesión', () => {
        render(<Header user={null} />);

        const boton = screen.getByRole('link', {
            name: 'Entrar'
        });

        expect(boton).toBeInTheDocument();
        expect(boton).toHaveAttribute('href', '/iniciar-sesion');
    });


    it('Muestra el username cuando se ha iniciado sesión', () => {
        const user = {
            username: 'usuario_prueba'
        };

        render(<Header user={user} />);

        expect(
            screen.getByRole('link', {
                name: 'usuario_prueba'
            })
        ).toHaveAttribute('href', '/perfil');
    });


    it('Corta el username cuando supere los 50 caracteres y se haya iniciado sesión', () => {
        const user = {
            username: 'a'.repeat(60)
        };

        render(<Header user={user} />);

        const boton = screen.getByRole('link', {
            name: 'a'.repeat(50) + '...'
        });

        expect(boton).toBeInTheDocument();
    });

});