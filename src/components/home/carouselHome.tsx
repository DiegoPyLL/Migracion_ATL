import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carouselHome.css";

const CarouselHome: React.FC = () => {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval={5500}>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="/images/familia_feliz1.png"
            className="d-block w-100"
            alt="Familia feliz"
          />
          <div className="texto-sobre-imagen">
            <h1>Nunca sabes cuando termina</h1>
            <h2>Contrata nuestro seguro de vida con nosotros</h2>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src="/images/clinica_4.png"
            className="d-block w-100"
            alt="Equipo medico preparando atencion"
          />
          <div className="texto-sobre-imagen">
            <h1>Cuidamos tu salud</h1>
            <h2>Accede a especialistas certificados</h2>
          </div>
        </div>

        <div className="carousel-item">
          <video autoPlay muted loop playsInline className="d-block w-100">
            <source src="/videos/Video_de_pareja_feliz_en_parque.mp4" type="video/mp4" />
          </video>
          <div className="texto-sobre-imagen">
            <h1>Disfruta cada momento</h1>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src="/images/seguro_vida_2.png"
            className="d-block w-100"
            alt="Pareja revisando su cobertura"
          />
          <div className="texto-sobre-imagen">
            <h1>Protege a quienes amas</h1>
            <h2>Planes flexibles para cada familia</h2>
          </div>
        </div>

        <div className="carousel-item">
          <video autoPlay muted loop playsInline className="d-block w-100">
            <source src="/videos/Video_De_Atardecer_En_La_Playa.mp4" type="video/mp4" />
          </video>
          <div className="texto-sobre-imagen">
            <h1>Disfruta cada momento</h1>
            <h2>Estamos contigo en cada etapa</h2>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src="/images/deporte_3.png"
            className="d-block w-100"
            alt="Profesional entregando orientacion"
          />
          <div className="texto-sobre-imagen">
            <h1>Respaldamos tu bienestar</h1>
            <h2>Consultas presenciales y online</h2>
          </div>
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default CarouselHome;