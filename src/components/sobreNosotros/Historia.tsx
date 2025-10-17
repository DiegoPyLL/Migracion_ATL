import React from "react";

const videoSrc = "/videos/Video_Cinematogr\u00E1fico_de_Cl\u00EDnica_Exterior.mp4";

const Historia: React.FC = () => {
  return (
    <section className="container-fluid py-5 bg-white">
      <div className="row justify-content-center align-items-center g-5 px-3 px-lg-5">
        <div className="col-12 col-lg-6">
          <h2 className="fw-bold mb-4">Nuestra Historia</h2>
          
            <p>
              Desde 2010, <strong>Clínica a tu Lado</strong> ha trabajado con un solo propósito: poner la salud de calidad al alcance de cada persona. 
              Lo que comenzó como un pequeño centro en Santiago, con un equipo reducido pero apasionado, hoy se ha transformado en un espacio integral 
              de cuidado médico, con especialidades diversas, tecnología de vanguardia y profesionales comprometidos con tu bienestar.
            </p>
            <p className="mb-0">
              Cada paciente es el centro de nuestra atención. Nos esforzamos por ofrecer un servicio cercano, humano y confiable, porque creemos 
              que la salud no solo se trata de tratamientos, sino de estar verdaderamente a tu lado en cada paso de tu camino hacia el bienestar.
            </p>

        </div>
        <div className="col-12 col-lg-5 d-flex justify-content-center">
          <div className="ratio ratio-16x9 w-100 shadow rounded overflow-hidden">
            <video
              src={videoSrc}
              className="w-100 h-100 object-fit-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Historia;