import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloPerfil.css';

// Componentes
import PerfilCarousel from '../components/perfil/PerfilCarousel';
import PerfilForm from '../components/perfil/PerfilForm';
import MisSeguros, { Seguro } from '../components/perfil/MisSeguros';
import MisCitas, { Cita } from '../components/perfil/MisCitas';
import MisFichas, { Ficha } from '../components/perfil/MisFichas';

export interface PerfilData {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  rol?: any;
}

const Perfil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS ---
  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: ''
  });
  const [originalData, setOriginalData] = useState<PerfilData | null>(null);
  
  const [listaSeguros, setListaSeguros] = useState<Seguro[]>([]);
  const [listaCitas, setListaCitas] = useState<Cita[]>([]);
  const [listaFichas, setListaFichas] = useState<Ficha[]>([]);

  // --- URLS DE APIS ---
  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';
  const DOCTORES_API_URL = 'http://localhost:8082/api/v1/doctores';
  const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';
  const CITAS_API_URL = 'http://localhost:8080/api/v1/citas';
  const HISTORIAL_API_URL = 'http://localhost:8083/api/v1/historial';

  // --- CARGA DATOS (useEffect) ---
  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioSesion = localStorage.getItem('usuario');
      if (!usuarioSesion) { navigate('/login'); return; }

      const usuarioObj = JSON.parse(usuarioSesion);
      const userId = usuarioObj.userId || usuarioObj.id;

      try {
        // A) Datos Personales
        const respUsuario = await axios.get(`${USUARIOS_API_URL}/${userId}`);
        const u = respUsuario.data;
        const datosCargados = {
          id: u.id,
          nombre: u.nombre || '', apellido: u.apellido || '', correo: u.correo || '',
          telefono: u.telefono || '',
          fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : '',
          rol: u.rol
        };
        setPerfilData(datosCargados);
        setOriginalData(datosCargados);

        // B) Seguros
        try {
            const respSeguros = await axios.get(`${SEGUROS_API_URL}/usuario/${userId}`);
            setListaSeguros(respSeguros.data || []);
        } catch (e) { console.warn("Sin seguros"); }

        // C) Citas
        try {
            const respCitas = await axios.get(`${CITAS_API_URL}/usuario/${userId}`);
            const citasRaw = respCitas.data || [];
            if (citasRaw.length > 0) {
                const respDoctores = await axios.get(DOCTORES_API_URL);
                const doctoresReales = respDoctores.data;
                const citasCompletas = citasRaw.map((cita: any) => {
                    const doctorIdEnCita = cita.idDoctor || (cita.doctor ? cita.doctor.id : null);
                    const doctorReal = doctoresReales.find((d: any) => d.id === doctorIdEnCita);
                    return {
                        id: cita.id, fechaCita: cita.fechaCita, horaInicio: cita.horaInicio, estado: cita.estado,
                        doctor: { id: doctorIdEnCita, usuario: { nombre: doctorReal ? doctorReal.usuario.nombre : "Doctor", apellido: doctorReal ? doctorReal.usuario.apellido : "No encontrado" } }
                    };
                });
                setListaCitas(citasCompletas);
            } else { setListaCitas([]); }
        } catch (e) { setListaCitas([]); }

        // D) Historial Médico
        try {
            const respHistorial = await axios.get(`${HISTORIAL_API_URL}/usuario/${userId}`);
            setListaFichas(respHistorial.data || []);
        } catch (e) { 
            console.warn("Sin historial médico"); 
            setListaFichas([]);
        }

      } catch (error) { console.error("Error general:", error); } finally { setLoading(false); }
    };
    cargarDatos();
  }, [navigate]);

  // --- ACCIONES (Handlers) ---
  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/login'); };

  const handleCancelSeguro = async (idSeguro: number) => {
    if (!confirm("¿Cancelar seguro?")) return;
    try {
        await axios.patch(`${SEGUROS_API_URL}/${idSeguro}/cancelacion`, { motivo: "Web" });
        setListaSeguros(prev => prev.map(s => s.id === idSeguro ? { ...s, estado: "CANCELADO" } : s));
    } catch (error) { alert("Error al cancelar seguro."); }
  };

  const handleCancelCita = async (idCita: number) => {
    if (!confirm("¿Cancelar cita?")) return;
    try {
        await axios.delete(`${CITAS_API_URL}/${idCita}`);
        setListaCitas(prev => prev.filter(c => c.id !== idCita));
        alert("Cita cancelada.");
    } catch (error) { alert("Error al cancelar cita."); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prev => ({ ...prev, [id]: value }));
  };

  const handleRestore = () => {
    if (originalData) {
        setPerfilData(originalData);
        alert("Datos restaurados.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!perfilData.id) return;
    if (!perfilData.nombre.trim() || !perfilData.apellido.trim() || !perfilData.correo.trim()) {
      alert("Por favor completa los campos obligatorios."); return;
    }
    try {
      const payload = { ...perfilData, fechaNacimiento: `${perfilData.fechaNacimiento}T00:00:00` };
      await axios.put(`${USUARIOS_API_URL}/${perfilData.id}`, payload);
      alert('Perfil actualizado.');
      setIsEditing(false);
      setOriginalData(perfilData);
      const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
      sesion.nombre = perfilData.nombre; sesion.apellido = perfilData.apellido;
      localStorage.setItem('usuario', JSON.stringify(sesion));
    } catch (error) { alert("Error al guardar."); }
  };

  if (loading) return <div className="text-center mt-5 p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="perfil-container bg-light" style={{minHeight: '100vh'}}>
      <div className="container-fluid px-lg-5 py-5">
        
        <h2 className="mb-4 fw-bold text-primary"><i className="bi bi-person-circle me-2"></i>Mi Portal Paciente</h2>

        {/* --- SECCIÓN SUPERIOR: IDENTIDAD (Carrusel + Formulario lado a lado) --- */}
        <div className="row g-4 mb-5 align-items-stretch">
            {/* Columna Visual (Izquierda) - AHORA CIRCULAR */}
            <div className="col-lg-5 col-xl-4 mb-4 mb-lg-0 d-flex justify-content-center align-items-center">
              <div className="perfil-carousel-container-wrapper">
                <div className="perfil-carousel-circle">
                  <PerfilCarousel />
                </div>
              </div>
            </div>

            {/* Columna de Datos (Derecha) */}
            <div className="col-lg-7 col-xl-8">
                <div className="card shadow-sm border-0 h-100">
                    <div className="card-body p-4 p-lg-5 bg-white rounded">
                        <PerfilForm
                          perfilData={perfilData}
                          isEditing={isEditing}
                          onChange={handleChange}
                          onEnableEdition={() => setIsEditing(true)}
                          onClear={handleRestore}
                          onSubmit={handleSubmit}
                          onLogout={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* --- SECCIÓN INFERIOR: ACTIVIDAD CLÍNICA (3 Columnas) --- */}
        <h4 className="mb-4 fw-bold text-secondary"><i className="bi bi-activity me-2"></i>Resumen de Actividad</h4>
        <div className="row g-4">
          
          {/* Columna 1: Próximas Citas */}
          <div className="col-md-6 col-xl-4">
             <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h5 className="text-primary fw-bold mb-0"><i className="bi bi-calendar-check me-2"></i>Mis Citas</h5>
                </div>
                <div className="card-body p-4">
                    <MisCitas citas={listaCitas} onCancel={handleCancelCita} />
                </div>
             </div>
          </div>

          {/* Columna 2: Historial Médico */}
          <div className="col-md-6 col-xl-4">
             <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h5 className="text-info fw-bold mb-0"><i className="bi bi-file-medical me-2"></i>Historial</h5>
                </div>
                <div className="card-body p-4">
                    <MisFichas fichas={listaFichas} />
                </div>
             </div>
          </div>

          {/* Columna 3: Seguros */}
          {/* En pantallas medianas ocupa todo el ancho, en grandes 1/3 */}
          <div className="col-md-12 col-xl-4">
             <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h5 className="text-success fw-bold mb-0"><i className="bi bi-shield-check me-2"></i>Mis Seguros</h5>
                </div>
                <div className="card-body p-4">
                    <MisSeguros seguros={listaSeguros} onCancel={handleCancelSeguro} />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Perfil;