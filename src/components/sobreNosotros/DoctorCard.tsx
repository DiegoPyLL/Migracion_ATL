import React from "react";

export type Doc = { nombre: string; cargo: string; desde: string; img: string };

const DoctorCard: React.FC<Doc> = ({ nombre, cargo, desde, img }) => (
  <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
    <div
      className="position-relative mx-auto mt-4 mb-3 rounded-circle overflow-hidden shadow-sm"
      
    >
      <img src={img} className="w-100 h-100 object-fit-cover" alt={nombre} />
    </div>
    <div className="card-body text-center px-4 pb-4">
      <h5 className="card-title mb-1">{nombre}</h5>
      <p className="text-primary fw-semibold mb-1">{cargo}</p>
      <p className="text-muted small mb-0">En la clínica desde el {desde}</p>
    </div>
  </article>
);

export default DoctorCard;