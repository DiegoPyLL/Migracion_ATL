import React from 'react';

const PerfilCarousel = () => (
  <div className="col-lg-5 perfil-avatar-container">
    <div id="carouselPerfil" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="/images/perfil_1.png" className="d-block w-100" alt="Foto de perfil 1" />
        </div>
        <div className="carousel-item">
          <img src="/images/perfil_2.png" className="d-block w-100" alt="Foto de perfil 2" />
        </div>
        <div className="carousel-item">
          <img src="/images/perfil_3.png" className="d-block w-100" alt="Foto de perfil 3" />
        </div>
        <div className="carousel-item">
          <img src="/images/perfil_4.png" className="d-block w-100" alt="Foto de perfil 4" />
        </div>
        <div className="carousel-item">
          <img src="/images/perfil_5.png" className="d-block w-100" alt="Foto de perfil 5" />
        </div>
        <div className="carousel-item">
          <img src="/images/perfil_6.png" className="d-block w-100" alt="Foto de perfil 6" />
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
);

export default PerfilCarousel;

