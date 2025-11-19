import React from 'react';

// Definimos la estructura REAL que viene desde el padre (Perfil.tsx)
export type PerfilData = {
  nombre: string;
  apellido: string;        // [NUEVO] Vital para tu BD
  fechaNacimiento: string; // [NUEVO] Vital para tu BD
  telefono: string;
  correo: string;
  // Eliminados: direccion, comunicacion, historial
};

type PerfilFormProps = {
  perfilData: PerfilData;
  isEditing: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEnableEdition: () => void;
  onClear: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const PerfilForm = ({
  perfilData,
  isEditing,
  onChange,
  onEnableEdition,
  onClear,
  onSubmit,
}: PerfilFormProps) => (
  <div className="col-lg-7 perfil-info">
    <form onSubmit={onSubmit}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Perfil de Usuario</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onEnableEdition}
          disabled={isEditing}
        >
          Modificar perfil
        </button>
      </div>
    
      <h3>Información Personal</h3>
      
      {/* NOMBRE */}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="nombre" // Debe coincidir con la key en PerfilData
          value={perfilData.nombre}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>

      {/* APELLIDO (Agregado para cumplir con tu BD) */}
      <div className="mb-3">
        <label htmlFor="apellido" className="form-label">Apellido:</label>
        <input
          type="text"
          className="form-control"
          id="apellido"
          value={perfilData.apellido}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>

      {/* FECHA NACIMIENTO (Agregado para cumplir con tu BD) */}
      <div className="mb-3">
        <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento:</label>
        <input
          type="date"
          className="form-control"
          id="fechaNacimiento"
          value={perfilData.fechaNacimiento}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>

      {/* CORREO */}
      <div className="mb-3">
        <label htmlFor="correo" className="form-label">Correo Electrónico:</label>
        <input
          type="email"
          className="form-control"
          id="correo"
          value={perfilData.correo}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>

      {/* TELÉFONO */}
      <div className="mb-3">
        <label htmlFor="telefono" className="form-label">Número de Contacto:</label>
        <input
          type="tel"
          className="form-control"
          id="telefono"
          value={perfilData.telefono}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>

      {/* BOTONES DE ACCIÓN (Solo visibles al editar) */}
      {isEditing && (
        <div className="d-flex flex-column flex-md-row gap-3 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClear}
          >
            Restaurar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar Cambios
          </button>
        </div>
      )}
    </form>
  </div>
);

export default PerfilForm;