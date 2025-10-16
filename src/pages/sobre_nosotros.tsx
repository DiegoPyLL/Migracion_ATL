import React from "react";
import Historia from "../components/sobreNosotros/Historia";
import Collage from "../components/sobreNosotros/Collage";
import EquipoMedico from "../components/sobreNosotros/EquipoMedico";

const SobreNosotros: React.FC = () => {
  return (
    <>
      <div className="top-bar">
        <div className="container">
          <p className="info-text">Abiertos desde las 8:00am hasta las 23:00pm todos los días</p>
        </div>
      </div>
      <Historia />
      <hr className="container" />
      <Collage />
      <EquipoMedico />
    </>
  );
};

export default SobreNosotros;
