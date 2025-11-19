import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Buscamos al usuario en la "memoria" del navegador
    const usuarioSesion = localStorage.getItem('usuario');

    // Si NO hay usuario, lo mandamos al Login ("/")
    if (!usuarioSesion) {
        return <Navigate to="/" replace />;
    }

    // Si SÍ hay usuario, dejamos que pase a la ruta hija (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;