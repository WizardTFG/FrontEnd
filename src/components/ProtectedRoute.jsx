function ProtectedRoute({ user, loading, adminOnly = false, children }) {
    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!user) {
        window.location.replace('/iniciar-sesion');
        return null;
    }

    if (adminOnly && !user.is_admin) {
        return <h1>No tienes permisos para acceder a esta página.</h1>;
    }

    return children;
}

export default ProtectedRoute;