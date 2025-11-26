import React, { useState } from 'react';

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
}: PerfilFormProps) => {
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  return (
    <div className="col-lg-7 perfil-info">
      <form onSubmit={onSubmit}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Perfil de Usuario</h1>
          <div className="d-flex gap-2">
              {!isEditing && (
                  <button type="button" className="btn btn-danger" onClick={onLogout} title="Salir">
                      Cerrar Sesion
                  </button>
              )}
              <button type="button" className="btn btn-primary" onClick={onEnableEdition} disabled={isEditing}>
              Modificar perfil
              </button>
          </div>
        </div>
      
        <h3>Informacion Personal</h3>
        
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre"
            value={perfilData.nombre}
            onChange={onChange}
            disabled={!isEditing}
            maxLength={40}
            aria-invalid={!!errors.nombre}
          />
          {errors.nombre && <div className="invalid-feedback d-block text-danger small" style={{ display: 'block' }}>{errors.nombre}</div>}
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
            maxLength={40}
            aria-invalid={!!errors.apellido}
          />
          {errors.apellido && <div className="invalid-feedback d-block text-danger small" style={{ display: 'block' }}>{errors.apellido}</div>}
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
            aria-invalid={!!errors.fechaNacimiento}
          />
          {errors.fechaNacimiento && <div className="invalid-feedback d-block text-danger small" style={{ display: 'block' }}>{errors.fechaNacimiento}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo Electronico:</label>
          <input
            type="email"
            className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
            id="correo"
            value={perfilData.correo}
            onChange={onChange}
            disabled={!isEditing}
            maxLength={60}
            aria-invalid={!!errors.correo}
          />
          {errors.correo && <div className="invalid-feedback d-block text-danger small" style={{ display: 'block' }}>{errors.correo}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Numero de Contacto:</label>
          <input
            type="tel"
            className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
            id="telefono"
            value={perfilData.telefono}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="+569..."
            maxLength={16}
            aria-invalid={!!errors.telefono}
          />
          {errors.telefono && <div className="invalid-feedback d-block text-danger small" style={{ display: 'block' }}>{errors.telefono}</div>}
        </div>

        {isEditing && showPasswordChange && (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="contrasena" className="form-label">Nueva contrasena</label>
              <div className="input-group">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`}
                  id="contrasena"
                  value={password || ''}
                  onChange={onPasswordChange}
                  placeholder="Minimo 8 caracteres"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
              {errors.contrasena && <div className="invalid-feedback d-block">{errors.contrasena}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="confirmarContrasena" className="form-label">Confirmar contrasena</label>
              <div className="input-group">
                <input
                  type={showPassConfirm ? 'text' : 'password'}
                  className={`form-control ${errors.confirmarContrasena ? 'is-invalid' : ''}`}
                  id="confirmarContrasena"
                  value={confirmPassword || ''}
                  onChange={onPasswordChange}
                  placeholder="Repite la nueva contrasena"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassConfirm(!showPassConfirm)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassConfirm ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
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
};

export default PerfilForm;
