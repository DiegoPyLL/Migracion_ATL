import React from "react";
import CarouselHome from "../components/home/carouselHome";
import BotonReserva from "../components/home/botonReserva";
import CardsSeguros from "../components/home/cardSeguros";

const Main: React.FC = () => (
  <>
    <CarouselHome />
    <BotonReserva />
    <CardsSeguros />
  </>
);

export default Main; 
