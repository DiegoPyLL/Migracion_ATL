import React from "react";
import CarouselHome from "../components/carouselHome";
import BotonReserva from "../components/botonReserva";
import CardsSeguros from "../components/cardSeguros";

const Main: React.FC = () => (
  <>
    <CarouselHome />
    <BotonReserva />
    <CardsSeguros />
  </>
);

export default Main; // ← obligatorio
