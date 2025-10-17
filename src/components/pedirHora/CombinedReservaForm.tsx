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

type Errors = Partial<{
  nombre: string;
  password: string;
  telefono: string;
  area: string;
  doctor: string;
  fecha: string;
  hora: string;
}>;

export default function CombinedReservaForm(): React.ReactElement {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [area, setArea] = useState<"" | AreaKey>("");
  const [doctor, setDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const doctores = useMemo(() => (area ? DOCTORES_POR_AREA[area] : []), [area]);

  const validar = (): boolean => {
    const e: Errors = {};
    if (!nombre.trim()) e.nombre = "Ingresa tu nombre";
    if (password.length < 6) e.password = "La contraseña debe tener al menos 6 caracteres";
    const tel = telefono.trim();
    if (!/^[\d+()\-\s]{7,}$/.test(tel)) e.telefono = "Ingresa un teléfono válido";
    if (!area) e.area = "Selecciona un área";
    if (!doctor) e.doctor = "Selecciona un doctor";
    if (!fecha) e.fecha = "Selecciona una fecha";
    if (!hora) e.hora = "Selecciona una hora";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validar()) return;
    console.log("Reserva confirmada", { nombre, telefono, area, doctor, fecha, hora });
    alert("Reserva confirmada. ¡Gracias!");
  };

  return (
    <form className="ph-form" onSubmit={onSubmit} noValidate>
      {/* Datos para la reserva */}
      <h2 className="dr-title">Datos Personales</h2>

      <div className="dr-field">
        <label htmlFor="dr-nombre">Nombre</label>
        <input
          id="dr-nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <p className="dr-error">{errors.nombre || "\u00A0"}</p>
      </div>

      <div className="dr-field">
        <label htmlFor="dr-password">Contraseña</label>
        <input
          id="dr-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="dr-error">{errors.password || "\u00A0"}</p>
      </div>

      <div className="dr-field">
        <label htmlFor="dr-telefono">Teléfono</label>
        <input
          id="dr-telefono"
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <p className="dr-error">{errors.telefono || "\u00A0"}</p>
      </div>




      {/* Selección de atención */}
      <h2 className="ph-title">Hora Médica</h2>

      <div className="ph-field">
        <label htmlFor="area">Área de Atención</label>
        <select
          id="area"
          value={area}
          onChange={(e) => {
            const v = e.target.value as AreaKey | "";
            setArea(v);
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
        <p className="dr-error">{errors.area || "\u00A0"}</p>
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
        <p className="dr-error">{errors.doctor || "\u00A0"}</p>
      </div>

      <div className="ph-field">
        <label htmlFor="fecha">Fecha</label>
        <input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        <p className="dr-error">{errors.fecha || "\u00A0"}</p>
      </div>

      <div className="ph-field">
        <label htmlFor="hora">Hora</label>
        <input id="hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
        <p className="dr-error">{errors.hora || "\u00A0"}</p>
      </div>

      <div className="ph-actions">
        <button type="submit" className="ph-submit">Confirmar Reserva</button>
      </div>
    </form>
  );
}