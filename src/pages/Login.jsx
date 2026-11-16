import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

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
            <h1>Iniciar sesión</h1>
            <p>Accede a tu cuenta o regístrate.</p>

            <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => alert('Error con Google')}
                />
            </GoogleOAuthProvider>
        </div>
    );
}

export default Login;