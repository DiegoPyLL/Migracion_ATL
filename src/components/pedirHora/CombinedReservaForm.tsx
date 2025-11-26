import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Interfaces actualizadas según tus DTOs
interface Doctor {
  id: number;
  especialidad?: string;
  usuario: {
    nombre: string;
    apellido: string;
  };
}

// Horarios disponibles (Bloques de 30 min)
const HORARIOS_DISPONIBLES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30" 
];

const CombinedReservaForm: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [userId, setUserId] = useState<number | null>(null);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loadingDoctores, setLoadingDoctores] = useState(true);

  // Formulario
  const [areaSeleccionada, setAreaSeleccionada] = useState("");
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [error, setError] = useState("");

  // URLs EXACTAS (Basadas en tus properties)
  const CITAS_API_URL = "http://localhost:8080/api/v1/citas"; 
  const DOCTORES_API_URL = "http://localhost:8082/api/v1/doctores";

  // Fecha mínima (Hoy + 3 días)
  const fechaMinima = useMemo(() => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 3); 
    return hoy.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    const usuarioSesion = localStorage.getItem("usuario");
    if (usuarioSesion) {
      const usuario = JSON.parse(usuarioSesion);
      setUserId(usuario.id || usuario.userId);
    } else {
      navigate("/login");
      return;
    }

    const cargarDoctores = async () => {
      try {
        const response = await axios.get(DOCTORES_API_URL);
        // Filtramos solo doctores activos si es necesario
        setDoctores(response.data);
      } catch (err) {
        console.error("Error cargando doctores", err);
        setError("No se pudo cargar la lista de médicos (API 8082).");
      } finally {
        setLoadingDoctores(false);
      }
    };

    cargarDoctores();
  }, [navigate]);

  const areasDisponibles = useMemo(() => {
    const especialidades = doctores
      .map(d => d.especialidad)
      .filter((esp): esp is string => !!esp); 
    return Array.from(new Set(especialidades)); 
  }, [doctores]);

  const doctoresFiltrados = useMemo(() => {
    if (!areaSeleccionada) return [];
    return doctores.filter(d => d.especialidad === areaSeleccionada);
  }, [doctores, areaSeleccionada]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!doctorSeleccionado || !fecha || !hora) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      // --- PREPARACIÓN DE DATOS PARA JAVA ---
      
      // 1. Hora Inicio (HH:mm:ss) -> Java LocalTime es estricto
      const horaInicioStr = `${hora}:00`; 
      
      // 2. Hora Fin (+45 min)
      const [h, m] = hora.split(':').map(Number);
      const finDate = new Date();
      finDate.setHours(h, m + 45);
      const horaFinStr = finDate.toTimeString().split(' ')[0]; // "HH:mm:ss"

      // 3. Payload Limpio (Solo lo necesario)
      // NO enviamos nulos explícitos para evitar problemas con el serializador
      const payload = {
        fechaCita: `${fecha}T00:00:00`, // Formato LocalDateTime
        horaInicio: horaInicioStr,
        horaFin: horaFinStr,
        duracionMinutos: 45,
        estado: "PROGRAMADA",
        disponible: false,
        idUsuario: userId,
        idDoctor: parseInt(doctorSeleccionado)
      };

      console.log("Enviando Payload:", payload);

      await axios.post(CITAS_API_URL, payload);
      
      alert("¡Cita reservada con éxito!");
      navigate("/perfil");

    } catch (err: any) {
      console.error("Error completo:", err);
      
      // DIAGNÓSTICO DE ERROR MEJORADO
      if (err.response) {
          console.log("Datos del error servidor:", err.response.data);
          if (err.response.status === 400) {
              setError("Error de datos (400). Revisa la consola para ver qué campo rechazó Java.");
          } else {
              setError(`Error del servidor: ${err.response.status}`);
          }
      } else if (err.code === "ERR_NETWORK") {
          setError("No se pudo conectar con CitasAPI (Puerto 8080).");
      } else {
          setError("Error desconocido al reservar.");
      }
    }
  };

  return (
    <form className="ph-form" onSubmit={onSubmit}>
      <div className="ph-card">
        <div className="ph-form-grid">
          <section className="ph-section">
            <header className="ph-section-header">
              <h2 className="ph-section-title">Reserva de Hora</h2>
              <p className="ph-section-subtitle">
                Selecciona especialidad, médico y horario.
              </p>
            </header>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="ph-field">
              <label>Especialidad</label>
              <select
                value={areaSeleccionada}
                onChange={(e) => {
                    setAreaSeleccionada(e.target.value);
                    setDoctorSeleccionado(""); 
                }}
                className="form-select"
                disabled={loadingDoctores}
              >
                <option value="" disabled>Selecciona especialidad</option>
                {areasDisponibles.map(area => (
                    <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="ph-field">
              <label>Doctor(a)</label>
              <select
                value={doctorSeleccionado}
                onChange={(e) => setDoctorSeleccionado(e.target.value)}
                className="form-select"
                disabled={!areaSeleccionada} 
              >
                <option value="" disabled>
                    {areaSeleccionada ? "Selecciona profesional" : "Primero elige especialidad"}
                </option>
                {doctoresFiltrados.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.usuario.nombre} {doc.usuario.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="ph-field">
              <label>Puedes tomar una cita a partir de 3 dias en adelante</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min={fechaMinima}
                required
              />
            </div>

            <div className="ph-field">
              <label>Hora</label>
              <select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="form-select"
                required
              >
                <option value="" disabled>Selecciona hora</option>
                {HORARIOS_DISPONIBLES.map((h) => (
                    <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </section>
        </div>
      </div>

      <div className="ph-actions">
        <button type="submit" className="ph-submit" disabled={loadingDoctores}>
          Confirmar Reserva
        </button>
      </div>
    </form>
  );
};

export default CombinedReservaForm;
