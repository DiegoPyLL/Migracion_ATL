import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/logo.png?raw=true" alt="Logo" />
          Clínica a tu Lado
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/pedir-hora">Pedir Hora</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/seguros/venta">Venta Seguros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/perfil">Mi Perfil</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Iniciar Sesión</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/registro">Regístrate</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
