import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRole: string; // 'doctor', 'paciente', 'administrador'
  redirectPath?: string;
}

const RoleProtectedRoute = ({ allowedRole, redirectPath = '/' }: Props) => {
  const usuarioSesion = localStorage.getItem('usuario');

  if (!usuarioSesion) {
    return <Navigate to="/login" replace />;
  }

  const usuario = JSON.parse(usuarioSesion);
  // Normalizamos a minúsculas para evitar errores (Doctor vs doctor)
  const userRole = usuario.role ? usuario.role.toLowerCase() : 'paciente';

  // Si el rol no coincide, lo mandamos a su lugar correspondiente
  if (userRole !== allowedRole) {
    if (userRole === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    if (userRole === 'administrador') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/perfil" replace />; // Si es paciente
  }

  return <Outlet />;
};

export default RoleProtectedRoute;