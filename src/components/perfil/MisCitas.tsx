import React from 'react';

// Estructura basada en tu Cita.java
export interface Cita {
  id: number;
  fechaCita: string; // Viene como "2025-11-20T10:00:00"
  estado: string;
  doctor: {
    id: number;
    usuario: {
      nombre: string;
      apellido: string;
    };
  };
}

interface MisCitasProps {
  citas: Cita[];
  onCancel: (id: number) => void;
}

const MisCitas = ({ citas, onCancel }: MisCitasProps) => {

  // Filtramos para no mostrar citas canceladas antiguas (opcional)
  // O las mostramos todas pero con estilo diferente.
  // Por ahora, mostramos todas ordenadas por fecha.
  const citasOrdenadas = [...citas].sort((a, b) => 
    new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime()
  );

  if (citas.length === 0) {
    return (
      <div className="mt-4 p-4 bg-light rounded text-center text-muted border">
        <h4>No tienes citas agendadas.</h4>
        <p>Reserva una hora con nuestros especialistas.</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="mb-4 border-bottom pb-2">Mis Próximas Citas</h3>
      <div className="row g-3">
        {citasOrdenadas.map((cita) => {
          const fecha = new Date(cita.fechaCita);
          const esPasada = fecha < new Date();
          const estaCancelada = cita.estado === "CANCELADO";

          return (
            <div key={cita.id} className="col-md-6 col-xl-4">
              <div className={`card h-100 shadow-sm ${estaCancelada ? 'bg-light border-danger' : 'border-info'}`}>
                <div className="card-body">
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="badge bg-info text-dark">Consulta Médica</span>
                    <span className={`badge ${estaCancelada ? 'bg-danger' : (esPasada ? 'bg-secondary' : 'bg-success')}`}>
                      {estaCancelada ? 'CANCELADA' : (esPasada ? 'REALIZADA' : 'PROGRAMADA')}
                    </span>
                  </div>

                  <h5 className="card-title">
                    Dr/a. {cita.doctor.usuario.nombre} {cita.doctor.usuario.apellido}
                  </h5>
                  
                  <p className="card-text mt-3">
                    <strong>Fecha:</strong> {fecha.toLocaleDateString()}<br/>
                    <strong>Hora:</strong> {fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>

                  {/* Solo permitimos cancelar si es futura y no está cancelada */}
                  {!estaCancelada && !esPasada && (
                    <button 
                      onClick={() => {
                        if(window.confirm("¿Seguro que deseas cancelar esta cita? Esta acción no se puede deshacer.")) {
                          onCancel(cita.id);
                        }
                      }}
                      className="btn btn-sm btn-outline-danger w-100 mt-2"
                    >
                      Cancelar Cita
                    </button>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MisCitas;