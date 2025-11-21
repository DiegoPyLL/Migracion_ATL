import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./header.css";

function Header() {
  const location = useLocation(); // Detectamos cambio de página
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const usuarioSesion = localStorage.getItem('usuario');
    if (usuarioSesion) {
      try {
        const usuario = JSON.parse(usuarioSesion);
        // Normalizamos a minúsculas: 'doctor', 'administrativo', 'paciente'
        // Ojo: En tu BD el rol es 'Administrativo' (no 'administrador')
        let rol = usuario.role ? usuario.role.toLowerCase() : 'paciente';
        
        // Pequeño parche por si el login devuelve 'administrador' en vez de 'administrativo'
        if (rol.includes('admin')) rol = 'administrativo';
        
        setUserRole(rol);
      } catch (e) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location]);

  // Definimos a dónde lleva el logo según el rol
  const getLogoLink = () => {
    if (userRole === 'doctor') return "/doctor-dashboard";
    if (userRole === 'administrativo') return "/admin-dashboard";
    return "/"; // Pacientes y público
  };

  // Definimos si es "Personal de la Clínica" (Para ocultar menús de pacientes)
  const isStaff = userRole === 'doctor' || userRole === 'administrativo';

  return (
    <>
      <nav className="navbar navbar-expand-md">
        <div className="container-fluid">
          
          {/* LOGO CON REDIRECCIÓN INTELIGENTE */}
          <Link className="navbar-brand" to={getLogoLink()}>
            <img src="/images/logo.png" alt="Logo" />
            Clínica a tu Lado
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              
              {/* --- MENÚ PÚBLICO / PACIENTES --- */}
              {/* Solo se muestra si NO eres personal médico/admin */}
              {!isStaff && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/pedir-hora">Pedir Hora</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/seguros/venta">Seguros</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/sobre-nosotros">Nosotros</Link></li>
                  
                  {userRole ? (
                    // Si ya está logueado como paciente
                    <li className="nav-item"><Link className="nav-link" to="/perfil">Mi Perfil</Link></li>
                  ) : (
                    // Si no ha iniciado sesión
                    <>
                      <li className="nav-item"><Link className="nav-link" to="/login">Iniciar Sesión</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/registro">Regístrate</Link></li>
                    </>
                  )}
                </>
              )}

              {/* --- MENÚ EXCLUSIVO DOCTORES --- */}
              {userRole === 'doctor' && (
                <li className="nav-item">
                    <Link className="nav-link text-primary fw-bold" to="/doctor-dashboard">
                        <i className="bi bi-hospital-fill me-1"></i> Panel Médico
                    </Link>
                </li>
              )}
              
              {/* --- MENÚ EXCLUSIVO ADMINISTRADORES --- */}
              {userRole === 'administrativo' && (
                <li className="nav-item">
                    <Link className="nav-link text-danger fw-bold" to="/admin-dashboard">
                        <i className="bi bi-shield-lock-fill me-1"></i> Panel Administración
                    </Link>
                </li>
              )}

            </ul>
          </div>
        </div>
      </nav>
      <div className="navbar-spacer"></div>
    </>
  );
}

export default Header;