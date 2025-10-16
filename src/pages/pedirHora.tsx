import React, { useState, useEffect } from 'react';
import '../styles/estilo_pedirHora.css';

// --- ESTRUCTURA DE DATOS ---
// Mantenemos la lista de doctores como un objeto constante
const doctoresPorArea = {
  general: [ { nombre: "Dra. Ana Pérez" }, { nombre: "Dra. Juana Pérez" } /* ... */ ],
  cardiologia: [ { nombre: "Dr. Juan Torres" }, { nombre: "Dra. Marcela Ruiz" } /* ... */ ],
  dermatologia: [ { nombre: "Dra. Ana Pérez" }, { nombre: "Dr. Nicolás Díaz" } /* ... */ ],
  pediatria: [ { nombre: "Dr. Gabriel Molina" }, { nombre: "Dra. Fernanda Morales" } /* ... */ ],
  psicologia: [ { nombre: "Dr. Sebastián Flores" }, { nombre: "Dra. Catalina Reyes" } /* ... */ ],
  nutricion: [ { nombre: "Dra. Verónica Contreras" }, { nombre: "Dr. Felipe Lagos" } /* ... */ ]
};

const FormularioReserva = () => {
  // --- HOOKS: Para manejar el estado del formulario ---
  const [reserva, setReserva] = useState({
    area: '',
    doctor: '',
    fecha: '',
    hora: ''
  });

  const [doctoresDisponibles, setDoctoresDisponibles] = useState<{ nombre: string }[]>([]);

  // --- LÓGICA: Efecto que se ejecuta cuando el área cambia ---
  useEffect(() => {
    if (reserva.area) {
      // @ts-ignore - TypeScript no sabe que reserva.area es una clave válida
      const doctores = doctoresPorArea[reserva.area] || [];
      setDoctoresDisponibles(doctores);
    } else {
      setDoctoresDisponibles([]); // Si no hay área, no hay doctores
    }
    // Reiniciamos la selección de doctor al cambiar de área
    setReserva(prev => ({ ...prev, doctor: '' }));
  }, [reserva.area]); // Este efecto se ejecuta cada vez que 'reserva.area' cambia

  // --- MANEJADORES DE EVENTOS ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setReserva(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validamos que todos los campos estén llenos
    if (reserva.area && reserva.doctor && reserva.fecha && reserva.hora) {
      alert(`✅ Reserva confirmada para el día ${reserva.fecha} a las ${reserva.hora} con ${reserva.doctor} en el área de ${reserva.area}.`);
      // Aquí podrías reiniciar el formulario si lo deseas
    } else {
      alert("Por favor, complete todos los campos para confirmar la reserva.");
    }
  };

  // --- JSX: La estructura visual del componente ---
  return (
    <div className="reserva-container">
      <section>
        <h2 className="titulo">Reserva tu Hora Médica</h2>
        <div className="wrap">
          <div className="card text-center">
            <div className="card-body">
              <form id="form-reserva" className="formulario" onSubmit={handleSubmit}>
                {/* Selección de área */}
                <div className="campo">
                  <label htmlFor="area">Área de Atención</label>
                  <select id="area" value={reserva.area} onChange={handleChange} required>
                    <option value="" disabled>Seleccione un área</option>
                    <option value="general">Medicina General</option>
                    <option value="pediatria">Pediatría</option>
                    <option value="dermatologia">Dermatología</option>
                    <option value="cardiologia">Cardiología</option>
                    <option value="psicologia">Psicología</option>
                    <option value="nutricion">Nutrición</option>
                  </select>
                </div>

                {/* Selección de doctor (dinámica) */}
                <div className="campo">
                  <label htmlFor="doctor">Doctor(a)</label>
                  <select id="doctor" value={reserva.doctor} onChange={handleChange} required disabled={!reserva.area}>
                    <option value="" disabled>Seleccione un doctor</option>
                    {doctoresDisponibles.map((doc, index) => (
                      <option key={index} value={doc.nombre}>{doc.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Fecha */}
                <div className="campo">
                  <label htmlFor="fecha">Fecha</label>
                  <input type="date" id="fecha" value={reserva.fecha} onChange={handleChange} required />
                </div>

                {/* Hora */}
                <div className="campo">
                  <label htmlFor="hora">Hora</label>
                  <input type="time" id="hora" value={reserva.hora} onChange={handleChange} required />
                </div>

                {/* Botón */}
                <div className="boton">
                  <button type="submit" className="boton-reserva">Confirmar Reserva</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormularioReserva;