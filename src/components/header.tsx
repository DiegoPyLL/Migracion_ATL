import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./header.css";

function Header() {
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const usuarioSesion = localStorage.getItem("usuario");
    if (usuarioSesion) {
      try {
        const usuario = JSON.parse(usuarioSesion);
        let rol = usuario.role ? usuario.role.toLowerCase() : "paciente";
        if (rol.includes("admin")) rol = "administrativo";
        setUserRole(rol);
      } catch (e) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location]);

  const getLogoLink = () => {
    if (userRole === "doctor") return "/doctor-dashboard";
    if (userRole === "administrativo") return "/admin-dashboard";
    return "/";
  };

  const isStaff = userRole === "doctor" || userRole === "administrativo";

  return (
    <>
      <nav className="navbar navbar-expand-md">
        <div className="container-fluid">
          <Link className="navbar-brand" to={getLogoLink()}>
            <img src="/images/logo.png" alt="Logo" />
            Clínica a tu Lado
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!isStaff && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/pedir-hora">Pedir Hora</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/seguros/venta">Seguros</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/sobre-nosotros">Nosotros</Link></li>
                  {userRole ? (
                    <li className="nav-item"><Link className="nav-link" to="/perfil">Mi Perfil</Link></li>
                  ) : (
                    <>
                      <li className="nav-item"><Link className="nav-link" to="/login">Iniciar Sesión</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/registro">Regístrate</Link></li>
                    </>
                  )}
                </>
              )}

              {userRole === "doctor" && (
                <li className="nav-item">
                  <Link className="nav-link text-primary fw-bold" to="/doctor-dashboard">
                    <i className="bi bi-hospital-fill me-1"></i> Panel Médico
                  </Link>
                </li>
              )}

              {userRole === "administrativo" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-danger fw-bold" to="/admin-dashboard">
                      <i className="bi bi-shield-lock-fill me-1"></i> Panel Administración
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-danger" to="/admin/explorador">
                      <i className="bi bi-database me-1"></i> Explorador de Datos
                    </Link>
                  </li>
                </>
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
