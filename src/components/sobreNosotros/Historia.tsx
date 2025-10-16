import React from "react";

const Historia: React.FC = () => {
  return (
    <section className="container my-5 pb-3 pt-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h2 className="fw-bold">Nuestra Historia</h2>
          <br />
          <p>
            Desde 2010, <strong>Clínica a tu Lado</strong> ha trabajado con un solo propósito:
            poner la salud de calidad al alcance de cada persona…
          </p>
          <p>
            Cada paciente es el centro de nuestra atención. Nos esforzamos por ofrecer un servicio
            cercano, humano y confiable…
          </p>
        </div>
        <div className="col-md-6">
          <img
            src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/clinica_3.png?raw=true"
            className="img-fluid rounded"
            alt="Imagen de la clínica"
          />
        </div>
      </div>
    </section>
  );
};

export default Historia;

