import React from "react";

export type Doc = { nombre: string; cargo: string; desde: string; img: string };

const DoctorCard: React.FC<Doc> = ({ nombre, cargo, desde, img }) => (
  <div className="col-md-3">
    <div className="card h-100 text-center shadow-sm">
      <img src={img} className="card-img-top rounded-circle p-3" alt={nombre} />
      <div className="card-body">
        <h5 className="card-title">{nombre}</h5>
        <p className="card-text">{cargo}</p>
        <p className="card-text">
          <small className="text-muted">En la clínica desde el {desde}</small>
        </p>
      </div>
    </div>
  </div>
);

export default DoctorCard;

