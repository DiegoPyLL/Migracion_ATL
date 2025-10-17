import React from "react";
import { Link } from "react-router-dom";
import "../../styles/cardSeguros.css";

type Seguro = {
  title: string;
  text: string;
  video: string;
  link: string;
};

const seguros: Seguro[] = [
  {
    title: "Seguro de Salud Premium",
    text: "Incluye consultas, hospitalización y emergencias.",
    video: "/videos/Video_de_Accidente_Vehicular_Generado.mp4", // reemplaza si usas otro origen
    link: "/comprar-seguro-salud",
  },
  {
    title: "Seguro de Salud Básico",
    text: "Cubre consultas y medicamentos esenciales.",
    video: "/videos/Clínica_Tranquila_con_Vista_Panorámica.mp4",
    link: "/comprar-seguro-salud",
  },
  {
    title: "Seguro de Vida Familiar",
    text: "Cobertura completa en caso de fallecimiento.",
    video: "/videos/familiaFeliz_1.mp4", // agrega el archivo al /videos
    link: "/comprar-seguro-vida",
  },
  {
    title: "Seguro de Vida Individual",
    text: "Protección adaptada a tus necesidades individuales.",
    video: "/videos/Joven_en_Restaurante_de_Playa.mp4", // agrega el archivo al /videos
    link: "/comprar-seguro-vida",
  },
];

const CardsSeguros: React.FC = () => {
  return (
    <div className="card text-center">
      <h1 className="card-main-title">Contrata tu Seguro 100% Online</h1>
      <div className="card-body">
        {seguros.map((seguro) => (
          <div key={seguro.title} className="card mb-5">
            <div className="card-header">{seguro.title}</div>
            <div className="card-body">
              <video
                className="seg-card-video"
                src={seguro.video}
                autoPlay
                muted
                loop
                playsInline
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
