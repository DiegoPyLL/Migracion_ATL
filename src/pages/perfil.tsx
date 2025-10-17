import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import "../styles/estiloPerfil.css";

const Perfil = () => {
  const navigate = useNavigate();

  const [perfilData, setPerfilData] = useState({
    nombre: 'Rasputín El Místico',
    direccion: 'Palacio de Gitovia, San Petersburgo',
    telefono: '+7 999 1917 1917',
    comunicacion: 'Mensajes místicos vía commit',
    historial: 'upload' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPerfilData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Guardando cambios del perfil:', perfilData);
    alert('¡Perfil actualizado con éxito!');
    navigate('/');
  };

  return (
    <div className="perfil-container">
      <div className="container">
        <div className="row align-items-start bg-white p-4 rounded-4 shadow-lg">
          
          {/* Columna Izquierda: Carrusel de Imágenes */}
          <div className="col-lg-5">
            <div id="carouselPerfil" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="/images/mega_hombre.png" className="d-block w-100" alt="Foto de perfil 1" />
                </div>
                <div className="carousel-item">
                  <img src="/images/naruto_perfil.png" className="d-block w-100" alt="Foto de perfil 2" />
                </div>
                <div className="carousel-item">
                  <img src="/images/goku_perfil.png" className="d-block w-100" alt="Foto de perfil 3" />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselPerfil" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselPerfil" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Perfil */}
          <div className="col-lg-7">
            <form onSubmit={handleSubmit}>
              <h1>Perfil de Usuario</h1>
              
              <h3>Información Personal</h3>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre Completo:</label>
                <input type="text" className="form-control" id="nombre" value={perfilData.nombre} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección:</label>
                <input type="text" className="form-control" id="direccion" value={perfilData.direccion} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Número de Contacto:</label>
                <input type="tel" className="form-control" id="telefono" value={perfilData.telefono} onChange={handleChange} />
              </div>
              
              <h3>Preferencias de Comunicación</h3>
              <div className="mb-3">
                <label htmlFor="comunicacion" className="form-label">Método Preferido:</label>
                <select className="form-select" id="comunicacion" value={perfilData.comunicacion} onChange={handleChange}>
                  <option>Mensajes</option>
                  <option>Correo Electrónico</option>
                  <option>Mensaje de Texto</option>
                  <option>Llamada Telefónica</option>
                </select>
              </div>

              <h3>Historial Místico</h3>
              <div className="mb-3 d-flex align-items-center gap-2">
                <label htmlFor="historial" className="form-label mb-0">Última actualización:</label>
                {/* Ícono en lugar de texto */}
                <FaUpload size={24} color="#007bff" title="Subida mística completada" />
              </div>

              <button type="submit" className="btn btn-primary mt-3">Guardar Cambios</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
