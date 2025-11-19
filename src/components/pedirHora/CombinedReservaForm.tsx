import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Doctor {
  id: number;
  especialidad?: string;
  usuario: {
    nombre: string;
    apellido: string;
  };
}

// --- LÓGICA DE HORARIOS ---
// Definimos manualmente los bloques para saltarnos el almuerzo (12:30 - 14:00)
const HORARIOS_DISPONIBLES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  // -- ALMUERZO (12:30 a 14:00 bloqueado) --
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30" 
  // La última cita es 16:30 para terminar a las 17:00
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

  // URLs
  const CITAS_API_URL = "http://localhost:8080/api/v1/citas"; 
  const DOCTORES_API_URL = "http://localhost:8082/api/v1/doctores";

  // --- CÁLCULO DE FECHA MÍNIMA (+3 DÍAS) ---
  const fechaMinima = useMemo(() => {
    const hoy = new Date();
    // Sumamos 3 días a la fecha actual
    hoy.setDate(hoy.getDate() + 3); 
    // Formateamos a YYYY-MM-DD para el input HTML
    return hoy.toISOString().split("T")[0];
  }, []);

  // 1. Carga Inicial
  useEffect(() => {
    const usuarioSesion = localStorage.getItem("usuario");
    if (usuarioSesion) {
      const usuario = JSON.parse(usuarioSesion);
      setUserId(usuario.id || usuario.userId);
    } else {
      alert("Inicia sesión para reservar.");
      navigate("/login");
      return;
    }

    const cargarDoctores = async () => {
      try {
        const response = await axios.get(DOCTORES_API_URL);
        setDoctores(response.data);
      } catch (err) {
        console.error("Error cargando doctores", err);
        setError("No se pudo cargar la lista de médicos.");
      } finally {
        setLoadingDoctores(false);
      }
    };

    cargarDoctores();
  }, [navigate]);

  // 2. Lógica Dinámica de Áreas
  const areasDisponibles = useMemo(() => {
    const especialidades = doctores
      .map(d => d.especialidad)
      .filter((esp): esp is string => !!esp); 
    return Array.from(new Set(especialidades)); 
  }, [doctores]);

  // 3. Filtrar Doctores
  const doctoresFiltrados = useMemo(() => {
    if (!areaSeleccionada) return [];
    return doctores.filter(d => d.especialidad === areaSeleccionada);
  }, [doctores, areaSeleccionada]);

  // 4. Envío
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!doctorSeleccionado || !fecha || !hora) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      const fechaCitaISO = `${fecha}T${hora}:00`;
      const payload = {
        fechaCita: fechaCitaISO,
        estado: "PROGRAMADA",
        idUsuario: userId,
        idDoctor: parseInt(doctorSeleccionado),
      };

      await axios.post(CITAS_API_URL, payload);
      alert("¡Cita reservada con éxito!");
      navigate("/perfil");

    } catch (err) {
      setError("Error al reservar. Verifica la conexión.");
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
                Recuerda que las horas se deben tomar con al menos 3 días de anticipación.
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
                <option value="" disabled>Selecciona una especialidad</option>
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
                    {areaSeleccionada ? "Selecciona un profesional" : "Primero elige especialidad"}
                </option>
                {doctoresFiltrados.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.usuario.nombre} {doc.usuario.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="ph-field">
              <label>Fecha (Mínimo {fechaMinima})</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                // AQUÍ APLICAMOS LA REGLA DE LOS 3 DÍAS
                min={fechaMinima}
              />
            </div>

            <div className="ph-field">
              <label>Hora (09:00 - 17:00)</label>
              {/* CAMBIAMOS INPUT POR SELECT PARA CONTROLAR BLOQUES */}
              <select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="form-select"
              >
                <option value="" disabled>Selecciona una hora</option>
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