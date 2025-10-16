import React from "react";
import { Link } from "react-router-dom";
import "../styles/botonReserva.css"; // asegúrate que tu CSS tenga .boton-reserva

const BotonReserva: React.FC = () => {
  return (
    <div className="text-center my-4">
      <Link to="/reserva" className="boton-reserva">
        Reservar hora Atención Médica
      </Link>
    </div>
  );
};

export default BotonReserva;
