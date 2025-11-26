import React from 'react';

// Definimos la estructura del Seguro tal como viene de tu API Java
export interface Seguro {
  id: number;
  idSeguro?: number;
  nombreSeguro: string;
  descripcion: string;
  estado: "ACTIVO" | "CANCELADO";
  fechaCreacion: string;
  beneficiarios?: string[];
  ruts?: string[];
  metodoPago?: string;
  telefonoContacto?: string;
  correoContacto?: string;
}

interface MisSegurosProps {
  seguros: Seguro[];
  onCancel: (id: number) => void;
}

const MisSeguros = ({ seguros, onCancel }: MisSegurosProps) => {
  
  if (seguros.length === 0) {
    return (
      <div className="mt-4 p-5 bg-white rounded-3 text-center text-muted shadow-sm border border-light">
        <div className="mb-3">
            <i className="bi bi-shield-x text-secondary" style={{fontSize: '2.5rem'}}></i>
        </div>
        <h5 className="fw-bold">Aún no tienes seguros contratados</h5>
        <p className="small">Visita nuestra sección de planes para proteger a tu familia.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center mb-4">
        <h5 className="fw-bold text-success mb-0">
            <i className="bi bi-shield-check me-2"></i>Mis Planes
        </h5>
        <span className="badge bg-success bg-opacity-10 text-success ms-3 rounded-pill px-3">
            {seguros.filter(s => s.estado === 'ACTIVO').length} activos
        </span>
      </div>

      <div className="row g-3">
        {seguros.map((seguro) => {
            const estaCancelado = seguro.estado === 'CANCELADO';
            
            return (
              <div key={seguro.id} className="col-12">
                <div className={`card border-0 shadow-sm border-start border-4 ${estaCancelado ? 'border-danger bg-light' : 'border-success'} rounded-3`}>
                  <div className="card-body p-3">
                    
                    {/* Encabezado */}
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className={`card-title fw-bold mb-1 ${estaCancelado ? 'text-muted' : 'text-success'}`}>
                          {seguro.nombreSeguro}
                        </h6>
                        <span className="text-muted small d-block">
                            <i className="bi bi-hash me-1"></i>
                            Contrato {seguro.id + 5000}
                        </span>
                      </div>
                      <span className={`badge rounded-pill px-3 ${
                          estaCancelado ? 'bg-danger bg-opacity-10 text-danger border border-danger' : 
                          'bg-success bg-opacity-10 text-success border border-success'
                      }`}>
                        {seguro.estado}
                      </span>
                    </div>

                    {/* Descripción */}
                    <div className="mt-3 p-2 bg-light bg-opacity-50 rounded border border-light">
                        <p className="card-text small text-secondary mb-0 fst-italic">
                          "{seguro.descripcion}"
                        </p>
                        {seguro.beneficiarios && seguro.beneficiarios.length > 0 && (
                          <div className="mt-2">
                            <small className="text-muted fw-semibold d-block">Beneficiarios</small>
                            <div className="d-flex flex-wrap gap-2 mt-1">
                              {seguro.beneficiarios.map((b, idx) => (
                                <span key={idx} className="badge bg-info-subtle text-info-emphasis border">
                                  {b}{seguro.ruts && seguro.ruts[idx] ? ` • ${seguro.ruts[idx]}` : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {seguro.metodoPago && (
                          <div className="mt-2">
                            <small className="text-muted fw-semibold d-block">Método de pago</small>
                            <span className="badge bg-light text-dark border">{seguro.metodoPago}</span>
                          </div>
                        )}
                        {(seguro.correoContacto || seguro.telefonoContacto) && (
                          <div className="mt-2">
                            <small className="text-muted fw-semibold d-block">Contacto</small>
                            <div className="small text-secondary">
                              {seguro.correoContacto && <div><i className="bi bi-envelope me-1"></i>{seguro.correoContacto}</div>}
                              {seguro.telefonoContacto && <div><i className="bi bi-telephone me-1"></i>{seguro.telefonoContacto}</div>}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Pie: Fecha y Acción */}
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                      <div>
                        <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '0.65rem'}}>Día del contrato</small>
                        <small className="fw-bold text-dark">
                            {seguro.fechaCreacion ? new Date(seguro.fechaCreacion).toLocaleDateString() : 'N/A'}
                        </small>
                      </div>
                      
                      {!estaCancelado && (
                        <button 
                          onClick={() => {
                            if(window.confirm("¿Estás seguro de cancelar este plan? Perderás la cobertura inmediatamente.")) {
                              onCancel(seguro.id);
                            }
                          }}
                          className="btn btn-sm btn-link text-danger text-decoration-none px-0 fw-bold"
                          style={{fontSize: '0.85rem'}}
                        >
                          Cancelar Plan <i className="bi bi-chevron-right small"></i>
                        </button>
                      )}
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

export default MisSeguros;
