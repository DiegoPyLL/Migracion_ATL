import React from "react";
import CombinedReservaForm from "../components/pedirHora/CombinedReservaForm";
import "../styles/pedirHora.css";

export default function PedirHora(): React.ReactElement {
  return (
    <div className="pedir-hora-page">
      <h2 className="ph-title">Reserva tu Hora Médica</h2>
      <div className="ph-wrap">
        <div className="ph-card">
          <div className="ph-card-body">
            <CombinedReservaForm />
          </div>
        </div>
      </div>
    </div>
  );
}
