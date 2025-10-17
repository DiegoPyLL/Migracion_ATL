import React from 'react';
import CardsSeguros from '../components/home/cardSeguros';
import SaludCarousel from '../components/seguros/SaludCarousel';
import VidaCarousel from '../components/seguros/VidaCarousel';

const VentaSeguros: React.FC = () => {
  return (
    <div>
      <h1 className="card-main-title">Seguros de Salud</h1>
      <SaludCarousel />

      <h1 className="card-main-title" style={{ paddingTop: 24 }}>Seguros de Vida</h1>
      <VidaCarousel />

      {/* Sección de tarjetas (opcional) */}
      <CardsSeguros />
    </div>
  );
};

export default VentaSeguros;

