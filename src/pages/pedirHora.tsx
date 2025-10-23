import React from "react";
import CombinedReservaForm from "../components/pedirHora/CombinedReservaForm";
import "../styles/pedirHora.css";
export default function PedirHora(): React.ReactElement {
  return (
    <div className="pedir-hora-page">
      <header className="ph-header">
        <h1 className="ph-title">Reserva tu hora médica</h1>

      </header>
      <CombinedReservaForm />
    </div>
  );
}