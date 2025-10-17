import React from "react";

const Historia: React.FC = () => {
  return (
    <section className="container my-5 pb-3 pt-1">
      <div className="row align-items-center">
        <div className="col-md-12">
          <h2 className="fw-bold">Nuestra Historia</h2>
          <br />
            <p>
              Desde 2010, <strong>Clínica a tu Lado</strong> ha trabajado con un solo propósito: poner la salud de calidad al alcance de cada persona. 
              Lo que comenzó como un pequeño centro en Santiago, con un equipo reducido pero apasionado, hoy se ha transformado en un espacio integral 
              de cuidado médico, con especialidades diversas, tecnología de vanguardia y profesionales comprometidos con tu bienestar.
            </p>
            <p>
              Cada paciente es el centro de nuestra atención. Nos esforzamos por ofrecer un servicio cercano, humano y confiable, porque creemos 
              que la salud no solo se trata de tratamientos, sino de estar verdaderamente a tu lado en cada paso de tu camino hacia el bienestar.
            </p>
        </div>
        <div className="col-md-12">
          <video
            src="/videos/Video_Cinematográfico_de_Clínica_Exterior.mp4"
            className="img-fluid rounded"
            autoPlay
            loop
            muted
          />
        </div>
      </div>
    </section>
  );
};

export default Historia;

