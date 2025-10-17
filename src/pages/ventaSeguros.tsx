import React from "react";

import SaludCarousel from "../components/seguros/SaludCarousel";
import VidaCarousel from "../components/seguros/VidaCarousel";
import "../styles/ventaSeguros.css";

const VentaSeguros: React.FC = () => {
  return (
    <div className="venta-seguros">
      <section className="venta-seguros__section">
        <div className="venta-seguros__heading">
          <h1>Seguros de Salud</h1>
          <p>
            Conoce planes flexibles que equilibran cobertura, precio y bienestar para ti y tu familia.
          </p>
        </div>
        <SaludCarousel />
      </section>

      <section className="venta-seguros__section">
        <div className="venta-seguros__heading">
          <h1>Seguros de Vida</h1>
          <p>
            Protege el futuro de quienes amas con alternativas que se adaptan a cada etapa.
          </p>
        </div>
        <VidaCarousel />
      </section>
    </div>
  );
};

export default VentaSeguros;

