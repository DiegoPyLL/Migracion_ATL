import React from 'react';

export interface Ficha {
  id: number;
  fechaConsulta: string;
  diagnostico: string;
  observaciones: string;
}

interface Props {
  fichas: Ficha[];
}

const MisFichas = ({ fichas }: Props) => {
  if (fichas.length === 0) {
    return (
      <div className="text-center p-4 bg-white rounded shadow-sm mt-4">
        <p className="text-muted mb-0">No hay historial médico registrado.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="mb-3 text-secondary fw-bold">
        <i className="bi bi-file-medical me-2"></i>Historial Clínico
      </h4>
      <div className="row g-3">
        {fichas.map((ficha) => (
          <div key={ficha.id} className="col-md-6">
            <div className="card shadow-sm h-100 border-0 border-start border-4 border-info">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span className="badge bg-info text-dark">Consulta</span>
                  <small className="text-muted">{ficha.fechaConsulta}</small>
                </div>
                <h5 className="card-title text-dark">{ficha.diagnostico}</h5>
                <p className="card-text text-muted small mt-2">
                  {ficha.observaciones}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisFichas;