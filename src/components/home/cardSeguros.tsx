import React from "react";
import { Link } from "react-router-dom";
import "../../styles/cardSeguros.css"; // Se agregan dos puntos ..

const CardsSeguros: React.FC = () => {
  const seguros = [
  {
    title: "Seguro de Salud Premium",
    text: "Incluye consultas, hospitalización y emergencias.",
    video: "URL_DEL_VIDEO_PREMIUM",
    // ✅ CAMBIO: Apunta a la ruta del formulario de compra
    link: "/comprar-seguro-salud", 
  },
  {
    title: "Seguro de Salud Básico",
    text: "Cubre consultas y medicamentos esenciales.",
    video: "URL_DEL_VIDEO_BASICO",
    // También apunta al mismo formulario
    link: "/comprar-seguro-salud",
  },
];

  return (
    <div className="card text-center">
      <h1 className="card-main-title">Contrata tu Seguro 100% Online</h1>
      <div className="card-body">
        {seguros.map((seguro, index) => (
          <div key={index} className="card mb-5">
            <div className="card-header">{seguro.title}</div>
            <div className="card-body">
              <video
                src={seguro.video}
                autoPlay
                muted
                loop
                playsInline
                //style={{ width: "80%", height: "250px", objectFit: "cover", borderRadius: "10px" }}
              />
              <h5 className="card-title mt-2">{seguro.title}</h5>
              <p className="card-text">{seguro.text}</p>
              <Link to={seguro.link} className="btn btn-primary">
                Contrátalo aquí
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsSeguros;
