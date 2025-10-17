import React from "react";
import Historia from "../components/sobreNosotros/Historia";
import Collage from "../components/sobreNosotros/Collage";
import EquipoMedico from "../components/sobreNosotros/EquipoMedico";

const SobreNosotros: React.FC = () => {
  return (
    <>


      <section className="bg-light py-12">
        <Historia />
      </section>    

      <section className="py-4">
        <Collage />
      </section>

      <section className="bg-light py-5">
        <EquipoMedico />
      </section>
    </>
  );
};

export default SobreNosotros;
