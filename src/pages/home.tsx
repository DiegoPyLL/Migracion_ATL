import React from "react";
import CarouselHome from "../components/home/carouselHome";
import BotonReserva from "../components/home/botonReserva";
import CardsSeguros from "../components/home/cardSeguros";
import DoctorsShowcase from "../components/home/doctorsShowcase";

const Main: React.FC = () => (
  <>
    <CarouselHome />
    <BotonReserva />
    <CardsSeguros />
    <DoctorsShowcase />
  </>
);

export default Main; 
