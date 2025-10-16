import "./footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
              <Link to="/sobre-nosotros" className="footer-link">
                <h5>Sobre nosotros</h5>
              </Link>
            <p>Somos una clínica dedicada a tu bienestar, ofreciendo servicios médicos y seguros confiables.</p>
          </div>
          <div className="col-md-3">
            <h5>Dirección</h5>
            <p>Av. San Marino 1550<br />Santiago de Chile</p>
          </div>
          <div className="col-md-3">
            <h5>Contáctanos</h5>
            <p>Teléfono: +56 9 9077 1151<br />Email: contacto@atl_clinica.com</p>
          </div>
          <div className="col-md-3">
            <h5>Términos y Redes</h5>
            <p><a href="/terminos-y-condiciones">Términos y Condiciones</a></p>
            <div className="social-icons">
              <a href="https://web.facebook.com/" title="Visítanos en Facebook"><i className="bi bi-facebook"></i></a>
              <a href="https://x.com/?lang=en" title="Síguenos en X (Twitter)"><i className="bi bi-twitter"></i></a>
              <a href="https://www.instagram.com/" title="Síguenos en Instagram"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center">
          &copy; 2025 Clínica a tu Lado. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
