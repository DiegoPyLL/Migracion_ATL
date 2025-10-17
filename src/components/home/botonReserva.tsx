import React from "react";
import { Link } from "react-router-dom";
import "../../styles/botonReserva.css"; 
const BotonReserva: React.FC = () => {
  return (
    <div className="text-center my-4">
      <Link to="../pedir-hora" className="boton-reserva">
        Reservar hora Atención Médica
      </Link>
    </div>
  );
};

export default BotonReserva;
