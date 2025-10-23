import React from "react";
import CombinedReservaForm from "../components/pedirHora/CombinedReservaForm";
import "../styles/pedirHora.css";
export default function PedirHora(): React.ReactElement {
  return (
    <div className="pedir-hora-page">
      <header className="ph-header">
        <span className="ph-kicker">Agenda en linea</span>
        <h1 className="ph-title">Reserva tu hora medica</h1>
        <p className="ph-subtitle">
          Selecciona especialidad, profesional y horario en un solo paso.
        </p>
      </header>
      <CombinedReservaForm />
    </div>
  );
}