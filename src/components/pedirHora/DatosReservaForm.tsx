import React, { useState } from "react";

type Errors = {
  nombre?: string;
  password?: string;
  telefono?: string;
};

export default function DatosReservaForm(): React.ReactElement {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const validar = (): boolean => {
    const errs: Errors = {};

    if (!nombre.trim()) {
      errs.nombre = "Ingresa tu nombre";
    }

    if (password.length < 6) {
      errs.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Permite dígitos, espacios y + - ()
    const telLimpio = telefono.trim();
    if (!/^[\d+()\-\s]{7,}$/.test(telLimpio)) {
      errs.telefono = "Ingresa un teléfono válido";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    console.log("Datos para la reserva:", { nombre, telefono });
    alert("Datos validados. Continúa con la reserva.");
  };

  return (
    <form className="dr-form" onSubmit={onSubmit} noValidate>
      <h2 className="dr-title">DATOS PARA LA RESERVA</h2>

      <div className="dr-field">
        <label htmlFor="dr-nombre">Nombre</label>
        <input
          type="text"
          id="dr-nombre"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <p className="dr-error">{errors.nombre || "\u00A0"}</p>
      </div>

      <div className="dr-field">
        <label htmlFor="dr-password">Contraseña</label>
        <input
          type="password"
          id="dr-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="dr-error">{errors.password || "\u00A0"}</p>
      </div>

      <div className="dr-field">
        <label htmlFor="dr-telefono">Teléfono</label>
        <input
          type="text"
          id="dr-telefono"
          name="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <p className="dr-error">{errors.telefono || "\u00A0"}</p>
      </div>

      <button type="submit" className="dr-submit">Ingresar</button>
    </form>
  );
}

