import React from 'react';

import SaludCarousel from '../components/seguros/SaludCarousel';
import VidaCarousel from '../components/seguros/VidaCarousel';

const VentaSeguros: React.FC = () => {
  return (
    <div>
      <h1 className="card-main-title">Seguros de Salud</h1>
      <SaludCarousel />

      <h1 className="card-main-title">Seguros de Vida</h1>
      <VidaCarousel />

    </div>
  );
};

export default VentaSeguros;

