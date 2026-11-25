import { GoogleLogin } from '@react-oauth/google';
import './Login.css';
import React from 'react';

function Login() {

    const handleSuccess = async (response) => {
        try {
            const result = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/google/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        credential: response.credential
                    })
                }
            );

            const data = await result.json();

            if (!result.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);

            window.location.href = '/';

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="iniciar-sesion">
            <div className="login-card">

                <h1>Iniciar sesión</h1>

                <p>Accede a tu cuenta para continuar.</p>

                <div className="google-login">
                    <GoogleLogin
                        theme="outline"
                        size="large"
                        shape="rectangular"
                        text="continue_with"
                        width="360"
                        onSuccess={handleSuccess}
                        onError={() => alert('Error con Google')}
                    />
                </div>

            </div>
        </div>
    );
}

export default Login;