import React from 'react';

export type SeguroContratado = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
};

type SegurosContratadosListProps = {
  seguros: SeguroContratado[];
  total: number;
};

const SegurosContratadosList = ({ seguros, total }: SegurosContratadosListProps) => (
  <div className="bg-white p-4 rounded-4 shadow-lg">
    <h2>Seguros Contratados</h2>
    <p className="text-muted mb-4">
      Estos son los productos activos en tu cuenta. Funcionan como un carrito, puedes revisarlos antes de confirmar nuevas contrataciones.
    </p>
    {seguros.map(seguro => (
      <div key={seguro.id} className="card mb-3 border-0 shadow-sm">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div>
            <h5 className="card-title mb-1">{seguro.nombre}</h5>
            <p className="card-text text-muted mb-2">{seguro.descripcion}</p>
          </div>
          <span className="fw-semibold text-primary fs-5">
            ${seguro.precio.toLocaleString('es-CL')}
          </span>
        </div>
      </div>
    ))}
    <div className="d-flex justify-content-between align-items-center mt-4">
      <span className="fw-semibold">Total</span>
      <span className="fw-bold text-primary fs-5">
        ${total.toLocaleString('es-CL')}
      </span>
    </div>
  </div>
);

export default SegurosContratadosList;

