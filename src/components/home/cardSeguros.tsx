import React from "react";
import { Link } from "react-router-dom";
import "../../styles/cardSeguros.css"; // Se agregan dos puntos ..

const CardsSeguros: React.FC = () => {
  const seguros = [
    {
      title: "Seguro de Salud Premium",
      text: "Incluye consultas, hospitalización y emergencias.",
      video: "https://videos.openai.com/vg-assets/assets%2Ftask_01k5hxtprhf7ztc9ddm0h397t0%2Ftask_01k5hxtprhf7ztc9ddm0h397t0_genid_e41e8133-8c2c-4595-a7a9-0879c70ef318_25_09_19_21_24_517028%2Fvideos%2F00000_819540294%2Fsource.mp4",
      link: "/seguros/venta",
    },
    {
      title: "Seguro de Salud Básico",
      text: "Cubre consultas y medicamentos esenciales.",
      video: "https://videos.openai.com/vg-assets/assets%2Ftask_01k5ss8vg2e1rvrnftypgz90h6%2Ftask_01k5ss8vg2e1rvrnftypgz90h6_genid_dc4bed9e-8fa0-4aa9-8806-bcd370df1c81_25_09_22_22_39_451437%2Fvideos%2F00000_269393005%2Fsource.mp4",
      link: "/seguros/venta",
    },
    // Agrega más seguros si quieres
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
