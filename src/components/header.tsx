import { Link, useLocation } from "react-router-dom"; // [1] Importamos useLocation
import { useState, useEffect } from "react";
import "./header.css";

function Header() {
  const location = useLocation(); // [2] Esto fuerza al Header a actualizarse al cambiar de página
  const [userRole, setUserRole] = useState<string | null>(null);

  // [3] Cada vez que cambiamos de página (location), releemos el usuario
  useEffect(() => {
    const usuarioSesion = localStorage.getItem('usuario');
    if (usuarioSesion) {
      try {
        const usuario = JSON.parse(usuarioSesion);
        // Normalizamos a minúsculas y aseguramos que no sea nulo
        setUserRole(usuario.role ? usuario.role.toLowerCase() : 'paciente');
      } catch (e) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location]); // <--- La clave es esta dependencia

  return (
    <>
      <nav className="navbar navbar-expand-md">
        <div className="container-fluid">
          
          {/* Logo inteligente */}
          <Link className="navbar-brand" to={userRole === 'doctor' ? "/doctor-dashboard" : "/"}>
            <img src="/images/logo.png" alt="Logo" />
            Clínica a tu Lado
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              
              {/* MENÚ PARA PACIENTES (O No Logueados) */}
              {userRole !== 'doctor' && userRole !== 'administrador' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/pedir-hora">Pedir Hora</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/seguros/venta">Seguros</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/sobre-nosotros">Nosotros</Link></li>
                  
                  {/* Si hay rol (es paciente), mostramos Perfil. Si es null, Login */}
                  {userRole ? (
                    <li className="nav-item"><Link className="nav-link" to="/perfil">Mi Perfil</Link></li>
                  ) : (
                    <>
                      <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/registro">Registro</Link></li>
                    </>
                  )}
                </>
              )}

              {/* MENÚ SOLO PARA DOCTORES */}
              {userRole === 'doctor' && (
                <li className="nav-item">
                    <span className="nav-link text-primary fw-bold">👨‍⚕️ Portal Médico</span>
                </li>
              )}
              
              {/* MENÚ SOLO PARA ADMINS */}
              {userRole === 'administrador' && (
                <li className="nav-item">
                    <span className="nav-link text-danger fw-bold">🔧 Administración</span>
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