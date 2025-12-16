import React from 'react';

// Estructura basada en tu Cita.java
export interface Cita {
  id: number;
  fechaCita: string; // Viene como "2025-11-20T10:00:00" o "2025-11-20"
  horaInicio: string; // Viene como "10:00:00"
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
  citas?: Cita[]; // Hacemos opcional para evitar error si llega undefined
  onCancel: (id: number) => void;
}

const MisCitas = ({ citas = [], onCancel }: MisCitasProps) => {

  // Validación de seguridad: Si citas no es un array (ej. null), usamos array vacío
  const listaSegura = Array.isArray(citas) ? citas : [];

  // Ordenamos por fecha (las más próximas primero)
  const citasOrdenadas = [...listaSegura].sort((a, b) => {
    const fechaA = a.fechaCita ? new Date(a.fechaCita).getTime() : 0;
    const fechaB = b.fechaCita ? new Date(b.fechaCita).getTime() : 0;
    return fechaA - fechaB;
  });

  if (listaSegura.length === 0) {
    return (
      <div className="mt-4 p-5 bg-white rounded-3 text-center text-muted shadow-sm border border-light">
        <div className="mb-3">
            <i className="bi bi-calendar-x text-secondary" style={{fontSize: '2.5rem'}}></i>
        </div>
        <h5 className="fw-bold">No tienes citas agendadas</h5>
        <p className="small">Reserva una hora con nuestros especialistas para cuidar tu salud.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center mb-4">
        <h5 className="fw-bold text-primary mb-0">
            <i className="bi bi-calendar-check me-2"></i>Próximas Citas
        </h5>
        <span className="badge bg-primary bg-opacity-10 text-primary ms-3 rounded-pill px-3">
            {listaSegura.length} agendada{listaSegura.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="row g-3">
        {citasOrdenadas.map((cita) => {
          // Manejo seguro de fecha
          const fechaObj = cita.fechaCita ? new Date(cita.fechaCita) : new Date();
          const fechaStr = fechaObj.toLocaleDateString('es-CL', { 
              year: 'numeric', month: 'long', day: 'numeric' 
          });
          
          const esPasada = fechaObj < new Date();
          const estadoUpper = (cita.estado || '').toUpperCase();
          const isRealizada = estadoUpper === 'REALIZADA';
          const isCancelada = estadoUpper === 'CANCELADA' || estadoUpper === 'CANCELADO';
          
          // Manejo seguro de hora (evita el error de substring en null)
          const horaMostrar = (cita.horaInicio && typeof cita.horaInicio === 'string') 
              ? cita.horaInicio.substring(0, 5) 
              : '--:--';

          // Manejo seguro de nombre doctor
          const nombreDoctor = cita.doctor?.usuario?.nombre || "Doctor";
          const apellidoDoctor = cita.doctor?.usuario?.apellido || "";

          return (
            <div key={cita.id} className="col-12">
              <div
                className={`card border-0 shadow-sm border-start border-4 ${isCancelada ? 'border-danger bg-light' : 'border-primary'} rounded-3 transition-hover ${isRealizada ? 'proxima-cita-realizada' : ''} ${isCancelada ? 'proxima-cita-cancelada' : ''}`.trim()}
              >
                <div className="card-body p-3">
                  
                  {/* Encabezado: Doctor y Estado */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className={`card-title fw-bold mb-0 ${isCancelada ? 'text-muted' : 'text-primary'}`}>
                      <i className="bi bi-person-medical me-2"></i>
                      Dr/a. {nombreDoctor} {apellidoDoctor}
                    </h6>
                    <span
                      className={`badge rounded-pill px-3 ${
                        isRealizada
                          ? 'bg-success'
                          : isCancelada
                          ? 'bg-danger'
                          : 'bg-primary'
                      }`}
                    >
                      {estadoUpper || 'PROGRAMADA'}
                    </span>
                  </div>

                  {/* Detalles de Fecha y Hora */}
                  <div className="row g-0 mt-3">
                    <div className="col-6 col-md-4">
                        <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '0.65rem'}}>Fecha</small>
                        <span className="fw-medium text-dark small">
                            <i className="bi bi-calendar-event me-1 text-secondary"></i>
                            {fechaStr}
                        </span>
                    </div>
                    <div className="col-6 col-md-4">
                        <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '0.65rem'}}>Hora</small>
                        <span className="fw-medium text-dark small">
                            <i className="bi bi-clock me-1 text-secondary"></i>
                            {horaMostrar} hrs
                        </span>
                    </div>
                    
                    {/* Botón de Acción */}
                    <div className="col-12 col-md-4 d-flex justify-content-md-end align-items-center mt-3 mt-md-0">
                        <button 
                          onClick={() => {
                            if(window.confirm("¿Seguro que deseas cancelar esta cita? Esta acción no se puede deshacer.")) {
                              onCancel(cita.id);
                            }
                          }}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3 w-100 w-md-auto"
                          disabled={isRealizada || isCancelada}
                        >
                          <i className="bi bi-x-circle me-1"></i>Cancelar
                        </button>
                    </div>
                  </div>

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
