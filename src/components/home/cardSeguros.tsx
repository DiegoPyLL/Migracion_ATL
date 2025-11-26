import React from "react";
import { Link } from "react-router-dom";
import "../../styles/cardSeguros.css";

type Seguro = {
  title: string;
  text: string;
  tipo: "salud" | "vida";
  idSeguro: number;
  video: string;
};

const seguros: Seguro[] = [
  {
    title: "Seguro de Salud Premium",
    text: "Incluye consultas, hospitalización y emergencias.",
    tipo: "salud",
    idSeguro: 3,
    video: "/videos/Video_de_Accidente_Vehicular_Generado.mp4",
  },
  {
    title: "Seguro de Salud Básico",
    text: "Cubre consultas y medicamentos esenciales.",
    tipo: "salud",
    idSeguro: 1,
    video: "/videos/Clínica_Tranquila_con_Vista_Panorámica.mp4",
  },
  {
    title: "Seguro de Vida Familiar",
    text: "Cobertura completa en caso de fallecimiento.",
    tipo: "vida",
    idSeguro: 7,
    video: "/videos/familiaFeliz_1.mp4",
  },
  {
    title: "Seguro de Vida Individual",
    text: "Protección adaptada a tus necesidades individuales.",
    tipo: "vida",
    idSeguro: 5,
    video: "/videos/Joven_en_Restaurante_de_Playa.mp4",
  },
];

const CardsSeguros: React.FC = () => {
  return (
    <div className="seguros-container">
      <h1 className="card-main-title">Seguros más populares 100% online</h1>
      <div className="seguros-grid">
        {seguros.map((seguro) => (
          <div key={seguro.title} className="seguro-card">
            <video
              className="seg-card-video"
              src={seguro.video}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="seguro-card-content">
              <h3>{seguro.title}</h3>
              <p>{seguro.text}</p>
              <Link to={`/seguros/${seguro.idSeguro}/contratar`} className="btn-contratar">
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
