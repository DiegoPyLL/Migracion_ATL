import "./header.css";

function Header() {
  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/logo.png?raw=true" alt="Logo" />
          Clínica a tu Lado
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="/pedirHora">Pedir Hora</a></li>
            <li className="nav-item"><a className="nav-link" href="/ventaSeguros">Venta Seguros</a></li>
            <li className="nav-item"><a className="nav-link" href="/sobre_nosotros">Sobre Nosotros</a></li>
            <li className="nav-item"><a className="nav-link" href="/perfil">Mi Perfil</a></li>
            <li className="nav-item"><a className="nav-link" href="/registro">Regístrate</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
