import React from 'react';

export interface Ficha {
  id: number;
  fechaConsulta: string;
  diagnostico: string;
  observaciones: string;
  idDoctor: number;
  estado: string;
}

interface DoctorMap {
  id: number;
  usuario: { nombre: string; apellido: string };
}

interface Props {
  fichas: Ficha[];
  doctores: DoctorMap[];
}

const MisFichas = ({ fichas, doctores }: Props) => {
  const fichasConDiagnostico = (fichas || []).filter(
    (f) => f.diagnostico && f.diagnostico.trim() !== ''
  );

  if (fichasConDiagnostico.length === 0) {
    return (
      <div className="text-center p-5 bg-white rounded shadow-sm">
        <i className="bi bi-file-medical text-muted" style={{ fontSize: '2rem' }}></i>
        <p className="text-muted mt-2 mb-0">No tienes historial médico con diagnóstico registrado.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {fichasConDiagnostico.map((ficha) => {
        const doc = doctores.find((d) => d.id === ficha.idDoctor);
        const nombreDoc = doc
          ? `Dr. ${doc.usuario.nombre} ${doc.usuario.apellido}`
          : 'Doctor no identificado';

        return (
          <div key={ficha.id} className="card border-0 shadow-sm border-start border-4 border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="card-title fw-bold text-primary mb-0">
                  {ficha.diagnostico}
                </h6>
                <span className="badge bg-light text-dark border">
                  {ficha.fechaConsulta}
                </span>
              </div>

              <p className="card-text text-muted small mb-2">
                {ficha.observaciones}
              </p>

              <div className="d-flex align-items-center mt-3 pt-2 border-top">
                <i className="bi bi-person-lines-fill text-info me-2"></i>
                <small className="fw-semibold text-secondary">{nombreDoc}</small>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MisFichas;
