import React from "react";
import CarouselHome from "./components/carouselHome";
import BotonReserva from "./components/botonReserva";
import CardsSeguros from "./components/cardSeguros";

const Main: React.FC = () => {
  return (
    <main>
      {/* Carrusel */}
      <CarouselHome />

      {/* Botón de reserva */}
      <BotonReserva />

      {/* Tarjetas de seguros */}
      <CardsSeguros />
    </main>
  );
};

export default Main;
