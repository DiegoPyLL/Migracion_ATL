import React from 'react';

export type PerfilData = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  correo: string;
};

type PerfilFormProps = {
  perfilData: PerfilData;
  isEditing: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEnableEdition: () => void;
  onClear: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
};

const PerfilForm = ({
  perfilData,
  isEditing,
  onChange,
  onEnableEdition,
  onClear,
  onSubmit,
  onLogout,
}: PerfilFormProps) => (
  <div className="col-lg-7 perfil-info">
    <form onSubmit={onSubmit}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Perfil de Usuario</h1>
        <div className="d-flex gap-2">
            {!isEditing && (
                <button type="button" className="btn btn-danger" onClick={onLogout} title="Salir">
                    Cerrar Sesión
                </button>
            )}
            <button type="button" className="btn btn-primary" onClick={onEnableEdition} disabled={isEditing}>
            Modificar perfil
            </button>
        </div>
      </div>
    
      <h3>Información Personal</h3>
      
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          value={perfilData.nombre}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>

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

      <div className="mb-3">
        <label htmlFor="telefono" className="form-label">Número de Contacto:</label>
        <input
          type="tel"
          className="form-control"
          id="telefono" // [IMPORTANTE] Este ID conecta con handleChange
          value={perfilData.telefono}
          onChange={onChange}
          disabled={!isEditing}
          placeholder="+569..."
        />
      </div>

      {isEditing && (
        <div className="d-flex flex-column flex-md-row gap-3 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClear}
          >
            Restaurar Originales
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