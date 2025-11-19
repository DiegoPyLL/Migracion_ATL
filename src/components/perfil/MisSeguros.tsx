import React from 'react';

// Definimos la estructura del Seguro tal como viene de tu API Java
export interface Seguro {
  id: number;
  nombreSeguro: string;
  descripcion: string; // Aquí guardamos el método de pago y contacto
  estado: "ACTIVO" | "CANCELADO";
  fechaCreacion: string;
}

interface MisSegurosProps {
  seguros: Seguro[];
  onCancel: (id: number) => void;
}

const MisSeguros = ({ seguros, onCancel }: MisSegurosProps) => {
  
  if (seguros.length === 0) {
    return (
      <div className="mt-4 p-4 bg-light rounded text-center text-muted border">
        <h4>Aún no tienes seguros contratados.</h4>
        <p>Visita nuestra sección de Venta de Seguros para proteger a tu familia.</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="mb-4 border-bottom pb-2">Mis Seguros Contratados</h3>
      <div className="row g-3">
        {seguros.map((seguro) => (
          <div key={seguro.id} className="col-md-6 col-xl-4">
            <div className={`card h-100 shadow-sm ${seguro.estado === 'CANCELADO' ? 'bg-light border-danger' : 'border-primary'}`}>
              <div className="card-body d-flex flex-column">
                
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title text-primary fw-bold mb-0">{seguro.nombreSeguro}</h5>
                  <span className={`badge ${seguro.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'}`}>
                    {seguro.estado}
                  </span>
                </div>

                <p className="card-text small text-muted flex-grow-1">
                  {seguro.descripcion}
                </p>

                <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Fecha: {new Date(seguro.fechaCreacion).toLocaleDateString()}
                  </small>
                  
                  {seguro.estado === 'ACTIVO' && (
                    <button 
                      onClick={() => {
                        if(window.confirm("¿Estás seguro de cancelar este plan?")) {
                          onCancel(seguro.id);
                        }
                      }}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Cancelar
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisSeguros;