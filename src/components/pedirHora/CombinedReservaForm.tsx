import React, { useMemo, useState } from "react";
type AreaKey =
  | "general"
  | "pediatria"
  | "dermatologia"
  | "cardiologia"
  | "psicologia"
  | "nutricion";
const DOCTORES_POR_AREA: Record<AreaKey, string[]> = {
  general: ["Dra. Marta Rojas", "Dr. Jorge Perez"],
  pediatria: ["Dra. Camila Soto", "Dr. Esteban Diaz"],
  dermatologia: ["Dra. Paula Fuentes", "Dr. Nicolas Vidal"],
  cardiologia: ["Dra. Andrea Silva", "Dr. Felipe Correa"],
  psicologia: ["Ps. Daniela Munoz", "Ps. Tomas Herrera"],
  nutricion: ["Nut. Valentina Ortiz", "Nut. Diego Ramirez"],
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
const CombinedReservaForm: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [area, setArea] = useState<AreaKey | "">("");
  const [doctor, setDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const doctores = useMemo(() => (area ? DOCTORES_POR_AREA[area] : []), [area]);
  const validar = () => {
    const e: Errors = {};
    if (!nombre.trim()) e.nombre = "Ingresa tu nombre";
    if (password.trim().length < 6) {
      e.password = "La contrasena debe tener al menos 6 caracteres";
    }
    const tel = telefono.trim();
    if (!/^[\\d+()\\-\\s]{7,}$/.test(tel)) {
      e.telefono = "Ingresa un telefono valido";
    }
    if (!area) e.area = "Selecciona un area";
    if (!doctor) e.doctor = "Selecciona un doctor";
    if (!fecha) e.fecha = "Selecciona una fecha";
    if (!hora) e.hora = "Selecciona una hora";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validar()) return;
    console.log("Reserva confirmada", { nombre, telefono, area, doctor, fecha, hora });
    alert("Reserva confirmada. Gracias!");
  };
  const renderError = (value?: string) => (
    <p className="ph-error">{value || "\u00A0"}</p>
  );
  return (
    <form className="ph-form" onSubmit={onSubmit} noValidate>
      <div className="ph-card">
        <div className="ph-form-grid">
          <section className="ph-section">
            <header className="ph-section-header">
              <h2 className="ph-section-title">Datos personales</h2>
              <p className="ph-section-subtitle">
                Completa la informacion de contacto para tu reserva.
              </p>
            </header>
            <div className="ph-field">
              <label htmlFor="ph-nombre">Nombre y apellido</label>
              <input
                id="ph-nombre"
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej: Alicia Torres"
              />
              {renderError(errors.nombre)}
            </div>
            <div className="ph-field">
              <label htmlFor="ph-password">Contrasena de paciente</label>
              <input
                id="ph-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimo 6 caracteres"
              />
              {renderError(errors.password)}
            </div>
            <div className="ph-field">
              <label htmlFor="ph-telefono">Telefono</label>
              <input
                id="ph-telefono"
                type="text"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                placeholder="+56 9 1234 5678"
              />
              {renderError(errors.telefono)}
            </div>
          </section>
          <section className="ph-section">
            <header className="ph-section-header">
              <h2 className="ph-section-title">Hora medica</h2>
              <p className="ph-section-subtitle">
                Selecciona especialidad, profesional y horario disponible.
              </p>
            </header>
            <div className="ph-field">
              <label htmlFor="ph-area">Area de atencion</label>
              <select
                id="ph-area"
                value={area}
                onChange={(event) => {
                  const value = event.target.value as AreaKey | "";
                  setArea(value);
                  setDoctor("");
                }}
              >
                <option value="" disabled>
                  Selecciona un area
                </option>
                <option value="general">Medicina general</option>
                <option value="pediatria">Pediatria</option>
                <option value="dermatologia">Dermatologia</option>
                <option value="cardiologia">Cardiologia</option>
                <option value="psicologia">Psicologia</option>
                <option value="nutricion">Nutricion</option>
              </select>
              {renderError(errors.area)}
            </div>
            <div className="ph-field">
              <label htmlFor="ph-doctor">Doctor(a)</label>
              <select
                id="ph-doctor"
                value={doctor}
                onChange={(event) => setDoctor(event.target.value)}
                disabled={!area}
              >
                <option value="" disabled>
                  {area ? "Selecciona un doctor" : "Primero elige un area"}
                </option>
                {doctores.map((nombreDoctor) => (
                  <option key={nombreDoctor} value={nombreDoctor}>
                    {nombreDoctor}
                  </option>
                ))}
              </select>
              {renderError(errors.doctor)}
            </div>
            <div className="ph-field">
              <label htmlFor="ph-fecha">Fecha</label>
              <input
                id="ph-fecha"
                type="date"
                value={fecha}
                onChange={(event) => setFecha(event.target.value)}
              />
              {renderError(errors.fecha)}
            </div>
            <div className="ph-field">
              <label htmlFor="ph-hora">Hora</label>
              <input
                id="ph-hora"
                type="time"
                value={hora}
                onChange={(event) => setHora(event.target.value)}
              />
              {renderError(errors.hora)}
            </div>
          </section>
        </div>
      </div>
      <div className="ph-actions">
        <button type="submit" className="ph-submit">
          Confirmar reserva
        </button>
        <p className="ph-legal">
          Te enviaremos una confirmacion al correo registrado y recordatorio 24 horas antes.
        </p>
      </div>
    </form>
  );
};
export default CombinedReservaForm;