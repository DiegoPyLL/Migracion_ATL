import React from "react";
import Historia from "../components/sobreNosotros/Historia";
import Collage from "../components/sobreNosotros/Collage";
import EquipoMedico from "../components/sobreNosotros/EquipoMedico";

const SobreNosotros: React.FC = () => {
  return (
    <>
      <section className="container-fluid my-12 pb-7">
        <Historia />
      </section>    

      <section className="py-4">
        <Collage />
      </section>

      <section className="container-fluid my-12 pb-7">
        <EquipoMedico />
      </section>
    </>
  );
};

export default SobreNosotros;
