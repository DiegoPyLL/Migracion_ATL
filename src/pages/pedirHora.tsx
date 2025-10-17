import React from "react";
import DatosReservaForm from "../components/pedirHora/DatosReservaForm";
import ReservaForm from "../components/pedirHora/ReservaForm";
import CombinedReservaForm from "../components/pedirHora/CombinedReservaForm";
import "../styles/pedirHora.css";
export default function PedirHora(): React.ReactElement {
  return (
    <div className="pedir-hora-page">

      {/* Paso 2: Selección de área/doctor/fecha/hora */}
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