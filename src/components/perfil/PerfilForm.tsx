import React from 'react';

export type PerfilData = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  correo: string;
  contrasena?: string;
  confirmarContrasena?: string;
};

type PerfilFormProps = {
  perfilData: PerfilData;
  isEditing: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEnableEdition: () => void;
  onClear: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
  showPasswordChange?: boolean;
  password?: string;
  confirmPassword?: string;
  onPasswordChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
  disableSubmit?: boolean;
};

const PerfilForm = ({
  perfilData,
  isEditing,
  onChange,
  onEnableEdition,
  onClear,
  onSubmit,
  onLogout,
  showPasswordChange = false,
  password,
  confirmPassword,
  onPasswordChange,
  errors = {},
  disableSubmit = false,
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
          className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
          id="nombre"
          value={perfilData.nombre}
          onChange={onChange}
          disabled={!isEditing}
        />
        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="apellido" className="form-label">Apellido:</label>
        <input
          type="text"
          className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
          id="apellido"
          value={perfilData.apellido}
          onChange={onChange}
          disabled={!isEditing}
        />
        {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento:</label>
        <input
          type="date"
          className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
          id="fechaNacimiento"
          value={perfilData.fechaNacimiento}
          onChange={onChange}
          disabled={!isEditing}
        />
        {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="correo" className="form-label">Correo Electrónico:</label>
        <input
          type="email"
          className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
          id="correo"
          value={perfilData.correo}
          onChange={onChange}
          disabled={!isEditing}
        />
        {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="telefono" className="form-label">Número de Contacto:</label>
        <input
          type="tel"
          className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
          id="telefono" // [IMPORTANTE] Este ID conecta con handleChange
          value={perfilData.telefono}
          onChange={onChange}
          disabled={!isEditing}
          placeholder="+569..."
        />
        {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
      </div>

      {isEditing && showPasswordChange && (
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="contrasena" className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`}
              id="contrasena"
              value={password || ''}
              onChange={onPasswordChange}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.contrasena && <div className="invalid-feedback d-block">{errors.contrasena}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmarContrasena" className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.confirmarContrasena ? 'is-invalid' : ''}`}
              id="confirmarContrasena"
              value={confirmPassword || ''}
              onChange={onPasswordChange}
              placeholder="Repite la nueva contraseña"
            />
            {errors.confirmarContrasena && <div className="invalid-feedback d-block">{errors.confirmarContrasena}</div>}
          </div>
        </div>
      )}

      {isEditing && (
        <div className="d-flex flex-column flex-md-row gap-3 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClear}
          >
            Restaurar Originales
          </button>
          <button type="submit" className="btn btn-primary" disabled={disableSubmit}>
            Guardar Cambios
          </button>
        </div>
      )}
    </form>
  </div>
);

export default PerfilForm;
