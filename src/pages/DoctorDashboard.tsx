import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/estiloPerfil.css"; // Reusamos estilos para que se vea bien

// Interfaces
interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}

interface CitaMedica {
  id: number;
  fechaCita: string;
  estado: string;
  idUsuario: number; // ID del paciente
  usuario?: Paciente; // Datos cruzados
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<CitaMedica[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<{nombre: string, id: number} | null>(null);

  // URLs
  const CITAS_API_URL = 'http://localhost:8080/api/v1/citas';
  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const cargarAgenda = async () => {
      const sesion = localStorage.getItem('usuario');
      if (!sesion) { navigate('/login'); return; }

      const usuario = JSON.parse(sesion);
      
      // Verificar que sea doctor
      if (usuario.role?.toLowerCase() !== 'doctor') {
        alert("Acceso denegado. Zona exclusiva para médicos.");
        navigate('/');
        return;
      }

      // Guardamos info básica para el saludo
      setDoctorInfo({ nombre: `${usuario.nombre} ${usuario.apellido}`, id: usuario.doctorId });

      try {
        // 1. Obtener Citas del Doctor (Puerto 8080)
        // Usamos el doctorId que viene en el login (gracias a LoginResponse.java)
        const respCitas = await axios.get(`${CITAS_API_URL}/doctor/${usuario.doctorId}`);
        const listaCitas = respCitas.data || [];

        if (listaCitas.length > 0) {
            // 2. Obtener Nombres de Pacientes (Puerto 8082)
            // Traemos todos los usuarios para buscar los nombres (Match por ID)
            const respUsuarios = await axios.get(USUARIOS_API_URL);
            const pacientes = respUsuarios.data;

            // 3. Cruzar datos (Unir Cita con Nombre de Paciente)
            const agendaCompleta = listaCitas.map((cita: any) => {
                // CitasAPI puede devolver el paciente como objeto "usuario" o como "idUsuario"
                const idPac = cita.idUsuario || (cita.usuario ? cita.usuario.id : null);
                const datosPaciente = pacientes.find((p: any) => p.id === idPac);

                return {
                    id: cita.id,
                    fechaCita: cita.fechaCita,
                    estado: cita.estado,
                    idUsuario: idPac,
                    usuario: datosPaciente ? {
                        id: datosPaciente.id,
                        nombre: datosPaciente.nombre,
                        apellido: datosPaciente.apellido,
                        correo: datosPaciente.correo,
                        telefono: datosPaciente.telefono
                    } : { nombre: "Desconocido", apellido: "", correo: "", telefono: "", id: 0 }
                };
            });
            
            // Ordenar por fecha
            agendaCompleta.sort((a: any, b: any) => new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime());
            setCitas(agendaCompleta);
        } else {
            setCitas([]);
        }

      } catch (error) {
        console.error("Error cargando agenda:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarAgenda();
  }, [navigate]);

  // --- ACCIONES ---
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleCancelarCita = async (id: number) => {
    if (!window.confirm("¿Desea cancelar esta cita con el paciente?")) return;

    try {
        await axios.delete(`${CITAS_API_URL}/${id}`);
        setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: 'CANCELADO' } : c));
        alert("Cita cancelada.");
    } catch (error) {
        alert("Error al cancelar.");
    }
  };

  if (loading) return <div className="text-center mt-5 p-5">Cargando agenda médica...</div>;

  return (
    <div className="perfil-container">
      <div className="container mt-4">
        
        {/* Encabezado Doctor */}
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-white rounded shadow-sm">
          <div>
            <h2 className="text-primary fw-bold">Panel Médico</h2>
            <p className="text-muted mb-0">Bienvenido, Dr/a. {doctorInfo?.nombre}</p>
          </div>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>

        {/* Tablero de Citas */}
        <div className="row">
            {/* Columna Pendientes */}
            <div className="col-lg-8">
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Agenda de Pacientes</h5>
                    </div>
                    <div className="card-body p-0">
                        {citas.filter(c => c.estado !== 'CANCELADO').length === 0 ? (
                            <div className="p-5 text-center text-muted">
                                <h4>No hay citas programadas.</h4>
                                <p>Disfrute su tiempo libre, doctor.</p>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush">
                                {citas.filter(c => c.estado !== 'CANCELADO').map(cita => (
                                    <div key={cita.id} className="list-group-item p-4 d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="mb-1 text-dark">
                                                {cita.usuario?.nombre} {cita.usuario?.apellido}
                                            </h5>
                                            <p className="mb-1 text-muted">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                {new Date(cita.fechaCita).toLocaleDateString()} - {new Date(cita.fechaCita).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                            <small className="text-secondary">
                                                Contacto: {cita.usuario?.telefono || cita.usuario?.correo}
                                            </small>
                                        </div>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleCancelarCita(cita.id)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Columna Historial / Canceladas */}
            <div className="col-lg-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-secondary text-white">
                        <h6 className="mb-0">Historial / Canceladas</h6>
                    </div>
                    <div className="card-body">
                        {citas.filter(c => c.estado === 'CANCELADO').length === 0 ? (
                            <p className="text-muted small">No hay citas canceladas.</p>
                        ) : (
                            <ul className="list-unstyled">
                                {citas.filter(c => c.estado === 'CANCELADO').map(cita => (
                                    <li key={cita.id} className="mb-3 border-bottom pb-2">
                                        <strong>{new Date(cita.fechaCita).toLocaleDateString()}</strong>
                                        <div className="small text-muted">
                                            {cita.usuario?.nombre} {cita.usuario?.apellido}
                                        </div>
                                        <span className="badge bg-danger mt-1">Cancelada</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;