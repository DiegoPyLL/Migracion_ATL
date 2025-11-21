import React from 'react';

export interface Ficha {
  id: number;
  fechaConsulta: string;
  diagnostico: string;
  observaciones: string;
  idDoctor: number; // Campo nuevo de tu API
}

// Interfaz para mapear nombres
interface DoctorMap {
  id: number;
  usuario: { nombre: string; apellido: string };
}

interface Props {
  fichas: Ficha[];
  doctores: DoctorMap[]; // [NUEVO] Recibimos la lista
}

const MisFichas = ({ fichas, doctores }: Props) => {
  if (fichas.length === 0) {
    return (
      <div className="text-center p-4 bg-white rounded shadow-sm border-0">
        <i className="bi bi-clipboard2-pulse text-muted" style={{fontSize: '2rem'}}></i>
        <p className="text-muted mt-2 mb-0">No tienes historial médico registrado.</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="row g-3">
        {fichas.map((ficha) => {
            // Buscamos el nombre del doctor
            const doctorInfo = doctores.find(d => d.id === ficha.idDoctor);
            const nombreDoctor = doctorInfo 
                ? `Dr/a. ${doctorInfo.usuario.nombre} ${doctorInfo.usuario.apellido}`
                : "Doctor Desconocido";

            return (
              <div key={ficha.id} className="col-12">
                <div className="card h-100 shadow-sm border-0 border-start border-4 border-info mb-2">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="badge bg-info text-dark">Consulta</span>
                      <small className="text-muted">{ficha.fechaConsulta}</small>
                    </div>
                    
                    <h6 className="card-title text-dark fw-bold mb-1">{ficha.diagnostico}</h6>
                    <div className="text-primary small mb-2 fw-semibold">
                        <i className="bi bi-person-lines-fill me-1"></i> {nombreDoctor}
                    </div>
                    
                    <p className="card-text text-muted small fst-italic border-top pt-2 mt-2">
                      "{ficha.observaciones}"
                    </p>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default MisFichas;