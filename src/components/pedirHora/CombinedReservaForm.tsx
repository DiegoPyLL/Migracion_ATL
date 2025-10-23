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

// --- función validadora de teléfono ---
function validaTelefono(tel: string): boolean {
  const s = tel.trim();
  if (!/^[+]?[\d\s()-]+$/.test(s)) return false;
  const digits = s.replace(/\D/g, "").length;
  return digits >= 8 && digits <= 15;
}

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
    if (password.trim().length < 6)
      e.password = "La contraseña debe tener al menos 6 caracteres";

    // --- Validación de teléfono implementada ---
    if (!validaTelefono(telefono)) {
      e.telefono = "Ingresa un teléfono válido (mín. 8 dígitos)";
    }

    if (!area) e.area = "Selecciona un área";
    if (!doctor) e.doctor = "Selecciona un doctor";
    if (!fecha) e.fecha = "Selecciona una fecha";
    if (!hora) e.hora = "Selecciona una hora";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validar()) return;
    console.log("Reserva confirmada", {
      nombre,
      telefono,
      area,
      doctor,
      fecha,
      hora,
    });
    alert("Reserva confirmada. ¡Gracias!");
  };

  const renderError = (value?: string) => (
    <p className="ph-error">{value || "\u00A0"}</p>
  );

  return (
    <form className="ph-form" onSubmit={onSubmit} noValidate>
      <div className="ph-card">
        <div className="ph-form-grid">
          {/* DATOS PERSONALES */}
          <section className="ph-section">
            <header className="ph-section-header">
              <h2 className="ph-section-title">Datos personales</h2>
              <p className="ph-section-subtitle">
                Completa tu información de contacto.
              </p>
            </header>

            <div className="ph-field">
              <label htmlFor="ph-nombre">Nombre y apellido</label>
              <input
                id="ph-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Alicia Torres"
              />
              {renderError(errors.nombre)}
            </div>

            <div className="ph-field">
              <label htmlFor="ph-password">Contraseña de paciente</label>
              <input
                id="ph-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
              {renderError(errors.password)}
            </div>

            <div className="ph-field">
              <label htmlFor="ph-telefono">Teléfono</label>
              <input
                id="ph-telefono"
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9 1234 5678"
              />
              {renderError(errors.telefono)}
            </div>
          </section>

          {/* HORA MÉDICA */}
          <section className="ph-section">
            <header className="ph-section-header">
              <h2 className="ph-section-title">Hora médica</h2>
              <p className="ph-section-subtitle">
                Selecciona especialidad, profesional y horario disponible.
              </p>
            </header>

            <div className="ph-field">
              <label htmlFor="ph-area">Área de atención</label>
              <select
                id="ph-area"
                value={area}
                onChange={(e) => {
                  const value = e.target.value as AreaKey | "";
                  setArea(value);
                  setDoctor("");
                }}
              >
                <option value="" disabled>
                  Selecciona un área
                </option>
                <option value="general">Medicina general</option>
                <option value="pediatria">Pediatría</option>
                <option value="dermatologia">Dermatología</option>
                <option value="cardiologia">Cardiología</option>
                <option value="psicologia">Psicología</option>
                <option value="nutricion">Nutrición</option>
              </select>
              {renderError(errors.area)}
            </div>

            <div className="ph-field">
              <label htmlFor="ph-doctor">Doctor(a)</label>
              <select
                id="ph-doctor"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                disabled={!area}
              >
                <option value="" disabled>
                  {area ? "Selecciona un doctor" : "Primero elige un área"}
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
                onChange={(e) => setFecha(e.target.value)}
              />
              {renderError(errors.fecha)}
            </div>

            <div className="ph-field">
              <label htmlFor="ph-hora">Hora</label>
              <input
                id="ph-hora"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
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
          Te enviaremos una confirmación al correo registrado y un recordatorio
          24 horas antes de tu cita.
        </p>
      </div>
    </form>
  );
};

export default CombinedReservaForm;
