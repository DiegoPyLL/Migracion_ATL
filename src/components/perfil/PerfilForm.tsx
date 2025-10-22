import React from 'react';
import { FaUpload } from 'react-icons/fa';

export type PerfilData = {
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  comunicacion: string;
  historial: string;
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
      <h1>Perfil de Usuario</h1>

      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onEnableEdition}
          disabled={isEditing}
        >
          Modificar perfil
        </button>
      </div>

      <h3>Informacion Personal</h3>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre Completo:</label>
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
        <label htmlFor="direccion" className="form-label">Dirección de Domicilio:</label>
        <input
          type="text"
          className="form-control"
          id="direccion"
          value={perfilData.direccion}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="correo" className="form-label">Correo Electronico:</label>
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
        <label htmlFor="telefono" className="form-label">Numero de Contacto:</label>
        <input
          type="tel"
          className="form-control"
          id="telefono"
          value={perfilData.telefono}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>

      <h3>Preferencias de Comunicacion</h3>
      <div className="mb-3">
        <label htmlFor="comunicacion" className="form-label">Metodo Preferido:</label>
        <select
          className="form-select"
          id="comunicacion"
          value={perfilData.comunicacion}
          onChange={onChange}
          disabled={!isEditing}
        >
          <option>Mensajes</option>
          <option>Correo Electronico</option>
          <option>Mensaje de Texto</option>
          <option>Llamada Telefonica</option>
          <option>Mensajes misticos via commit</option>
        </select>
      </div>

      <h3>Historial Medico</h3>
      <div className="mb-3 d-flex align-items-center gap-2">
        <label htmlFor="historial" className="form-label mb-0">Ultima actualizacion:</label>
        <FaUpload size={24} color="#007bff" title="Subida mistica completada" />
      </div>

      {isEditing && (
        <div className="d-flex flex-column flex-md-row gap-3 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClear}
          >
            Limpiar Datos
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

