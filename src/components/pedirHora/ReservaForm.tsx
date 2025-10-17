import React, { useMemo, useState } from "react";

type AreaKey = "general" | "pediatria" | "dermatologia" | "cardiologia" | "psicologia" | "nutricion";

const DOCTORES_POR_AREA: Record<AreaKey, string[]> = {
  general: ["Dra. Marta Rojas", "Dr. Jorge Pérez"],
  pediatria: ["Dra. Camila Soto", "Dr. Esteban Díaz"],
  dermatologia: ["Dra. Paula Fuentes", "Dr. Nicolás Vidal"],
  cardiologia: ["Dra. Andrea Silva", "Dr. Felipe Correa"],
  psicologia: ["Ps. Daniela Muñoz", "Ps. Tomás Herrera"],
  nutricion: ["Nut. Valentina Ortiz", "Nut. Diego Ramírez"],
};

export default function ReservaForm(): React.ReactElement {
  const [area, setArea] = useState<"" | AreaKey>("");
  const [doctor, setDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const doctores = useMemo(() => {
    return area ? DOCTORES_POR_AREA[area] : [];
  }, [area]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area || !doctor || !fecha || !hora) return;
    console.log("Reserva enviada:", { area, doctor, fecha, hora });
    alert("Reserva confirmada. ¡Gracias!");
  };

  return (
    <form className="ph-form" onSubmit={onSubmit} noValidate>
      <div className="ph-field">
        <label htmlFor="area">Área de Atención</label>
        <select
          id="area"
          value={area}
          onChange={(e) => {
            const val = e.target.value as AreaKey | "";
            setArea(val);
            setDoctor("");
          }}
          required
        >
          <option value="" disabled>
            Seleccione un área
          </option>
          <option value="general">Medicina General</option>
          <option value="pediatria">Pediatría</option>
          <option value="dermatologia">Dermatología</option>
          <option value="cardiologia">Cardiología</option>
          <option value="psicologia">Psicología</option>
          <option value="nutricion">Nutrición</option>
        </select>
      </div>

      <div className="ph-field">
        <label htmlFor="doctor">Doctor(a)</label>
        <select
          id="doctor"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          required
          disabled={!area}
        >
          <option value="" disabled>
            {area ? "Seleccione un doctor" : "Primero seleccione un área"}
          </option>
          {doctores.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="ph-field">
        <label htmlFor="fecha">Fecha</label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>

      <div className="ph-field">
        <label htmlFor="hora">Hora</label>
        <input
          type="time"
          id="hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />
      </div>

      <div className="ph-actions">
        <button type="submit" className="ph-submit">
          Confirmar Reserva
        </button>
      </div>
    </form>
  );
}

