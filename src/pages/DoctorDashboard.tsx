import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/estiloPerfil.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

import PerfilForm, { PerfilData } from '../components/perfil/PerfilForm';

interface CitaMedica {
  id: number;
  fechaCita: string;
  horaInicio: string;
  estado: string;
  idUsuario: number;
  idDoctor: number;
  usuario?: { nombre: string; apellido: string; telefono: string; correo: string };
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<'agenda' | 'perfil'>('agenda');
  const [citas, setCitas] = useState<CitaMedica[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  
  // Estado para la imagen (Por defecto usamos un ícono genérico)
  const [avatarPreview, setAvatarPreview] = useState<string>("https://cdn-icons-png.flaticon.com/512/3774/3774299.png");

  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  const CITAS_API_URL = 'http://localhost:8080/api/v1/citas';
  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';

  // --- CARGA INICIAL ---
  useEffect(() => {
    const init = async () => {
      const sesion = localStorage.getItem('usuario');
      if (!sesion) { navigate('/login'); return; }
      const usuario = JSON.parse(sesion);

      if (usuario.role?.toLowerCase() !== 'doctor') {
        navigate('/'); return;
      }

      setDoctorName(`${usuario.nombre} ${usuario.apellido}`);
      const uId = usuario.userId || usuario.id;
      setMyUserId(uId);
      const dId = usuario.doctorId;

      // [NUEVO] 1. RECUPERAR FOTO GUARDADA
      // Buscamos si hay una foto guardada para ESTE usuario específico
      const savedAvatar = localStorage.getItem(`avatar_doctor_${uId}`);
      if (savedAvatar) {
          setAvatarPreview(savedAvatar);
      }

      // 2. Cargar Perfil
      try {
        const respUser = await axios.get(`${USUARIOS_API_URL}/${uId}`);
        const u = respUser.data;
        setPerfilData({
            nombre: u.nombre, apellido: u.apellido, correo: u.correo,
            telefono: u.telefono, 
            fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : ''
        });
      } catch (e) { console.error("Error perfil", e); }

      // 3. Cargar Agenda
      try {
        const respCitas = await axios.get(CITAS_API_URL);
        const todas = respCitas.data || [];
        const misCitas = todas.filter((c: any) => c.idDoctor === dId && c.idUsuario !== null);
        
        if (misCitas.length > 0) {
            const respPacientes = await axios.get(USUARIOS_API_URL);
            const pacientes = respPacientes.data;
            
            const agenda = misCitas.map((cita: any) => {
                const pac = pacientes.find((p: any) => p.id === cita.idUsuario);
                return {
                    id: cita.id,
                    fechaCita: cita.fechaCita,
                    horaInicio: cita.horaInicio,
                    estado: cita.estado,
                    idUsuario: cita.idUsuario,
                    idDoctor: cita.idDoctor,
                    usuario: pac ? { 
                        nombre: pac.nombre, apellido: pac.apellido, 
                        telefono: pac.telefono, correo: pac.correo 
                    } : undefined
                };
            });
            agenda.sort((a: any, b: any) => new Date(`${a.fechaCita}T${a.horaInicio}`).getTime() - new Date(`${b.fechaCita}T${b.horaInicio}`).getTime());
            setCitas(agenda);
        }
      } catch (e) { console.error("Error agenda", e); } finally { setLoading(false); }
    };
    init();
  }, [navigate]);

  // --- MANEJO DE IMAGEN CON PERSISTENCIA ---
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        // Validar tamaño (Máximo 2MB para no saturar localStorage)
        if (file.size > 2 * 1024 * 1024) {
            alert("La imagen es muy pesada. Por favor usa una imagen de menos de 2MB.");
            return;
        }

        // Usamos FileReader para convertir la imagen a texto Base64
        const reader = new FileReader();
        
        reader.onloadend = () => {
            const base64String = reader.result as string;
            
            // 1. Actualizamos la vista
            setAvatarPreview(base64String);
            
            // 2. Guardamos en localStorage asociado al ID del usuario
            if (myUserId) {
                try {
                    localStorage.setItem(`avatar_doctor_${myUserId}`, base64String);
                } catch (err) {
                    console.error("Error guardando imagen (quizás es muy grande)", err);
                    alert("No se pudo guardar la imagen permanentemente (es muy grande), pero la verás mientras no recargues.");
                }
            }
        };

        reader.readAsDataURL(file); // Inicia la lectura
    }
  };


  // --- ACCIONES ---
  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/login'); };

  const handleCancelarCita = async (id: number) => {
    if (!confirm("¿Seguro que desea cancelar esta cita?")) return;
    try {
        await axios.patch(`${CITAS_API_URL}/${id}/cancelacion`, { motivo: "Cancelado por médico" });
        setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: 'CANCELADO' } : c));
    } catch (e) { alert("Error en API al cancelar."); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPerfilData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myUserId) return;
    try {
        const payload = { ...perfilData, fechaNacimiento: `${perfilData.fechaNacimiento}T00:00:00` };
        await axios.put(`${USUARIOS_API_URL}/${myUserId}`, payload);
        alert("Datos actualizados.");
        setIsEditing(false);
        const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
        sesion.nombre = perfilData.nombre; sesion.apellido = perfilData.apellido;
        localStorage.setItem('usuario', JSON.stringify(sesion));
        setDoctorName(`${perfilData.nombre} ${perfilData.apellido}`);
    } catch (e) { alert("Error al guardar."); }
  };

  const esCancelada = (estado: string) => estado.toUpperCase() === 'CANCELADO' || estado.toUpperCase() === 'CANCELADA';

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="perfil-container bg-light" style={{minHeight: '100vh'}}>
      <div className="container py-4">
        
        {/* HEADER */}
        <div className="dashboard-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {/* Avatar Inteligente */}
            <div className="avatar-container" onClick={handleAvatarClick} title="Cambiar foto (Se guardará en este navegador)">
                <img src={avatarPreview} alt="Perfil" className="avatar-image" />
                <div className="avatar-edit-icon">
                    <i className="bi bi-camera-fill"></i>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/png, image/jpeg, image/jpg" 
                    style={{ display: 'none' }} 
                />
            </div>
            
            <div>
              <h2 className="fw-bold mb-0">Panel Médico</h2>
              <p className="mb-0 opacity-75">Dr/a. {doctorName}</p>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className={`btn ${activeTab === 'agenda' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`} onClick={() => setActiveTab('agenda')}>
                <i className="bi bi-calendar2-week-fill me-2"></i>Agenda
            </button>
            <button className={`btn ${activeTab === 'perfil' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`} onClick={() => setActiveTab('perfil')}>
                <i className="bi bi-person-fill-gear me-2"></i>Mis Datos
            </button>
            <button className="btn btn-danger d-flex align-items-center" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Salir
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="row g-4">
          {activeTab === 'agenda' && (
            <>
              <div className="col-lg-8">
                <h4 className="mb-3 text-primary fw-bold"><i className="bi bi-calendar-check me-2"></i>Próximos Pacientes</h4>
                <div className="agenda-list">
                    {citas.filter(c => !esCancelada(c.estado)).length === 0 ? (
                        <div className="text-center p-5 bg-white rounded shadow-sm">
                            <i className="bi bi-calendar-x text-muted" style={{fontSize: '3rem'}}></i>
                            <p className="text-muted mt-3 mb-0">No hay citas programadas.</p>
                        </div>
                    ) : (
                        citas.filter(c => !esCancelada(c.estado)).map(cita => (
                            <div key={cita.id} className="card cita-card">
                                <div className="card-body cita-card-body">
                                    <div>
                                        <h5 className="cita-paciente-name">
                                            {cita.usuario?.nombre} {cita.usuario?.apellido}
                                        </h5>
                                        <div className="d-flex gap-3 flex-wrap">
                                            <span className="cita-info-item"><i className="bi bi-calendar-event"></i> {cita.fechaCita}</span>
                                            <span className="cita-info-item"><i className="bi bi-clock-fill"></i> {cita.horaInicio}</span>
                                            <span className="cita-info-item text-truncate" title={cita.usuario?.correo}><i className="bi bi-envelope-fill"></i> {cita.usuario?.correo}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline-danger btn-sm d-flex align-items-center" onClick={() => handleCancelarCita(cita.id)}>
                                        <i className="bi bi-x-circle-fill me-1"></i> Cancelar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
              </div>

              <div className="col-lg-4">
                <h5 className="mb-3 text-secondary"><i className="bi bi-clock-history me-2"></i>Historial de Cancelaciones</h5>
                <div className="bg-white rounded shadow-sm p-3" style={{maxHeight: '500px', overflowY: 'auto'}}>
                    {citas.filter(c => esCancelada(c.estado)).length === 0 ? (
                        <p className="text-muted small text-center py-3 mb-0">Sin cancelaciones recientes.</p>
                    ) : (
                        <ul className="list-unstyled mb-0">
                            {citas.filter(c => esCancelada(c.estado)).map(cita => (
                                <li key={cita.id} className="historial-card-item">
                                    <div className="d-flex justify-content-between mb-1">
                                        <strong className="text-dark">{cita.fechaCita}</strong>
                                        <span className="badge bg-danger-subtle text-danger-emphasis">Cancelada</span>
                                    </div>
                                    <div className="small text-muted d-flex align-items-center">
                                        <i className="bi bi-person me-2"></i>
                                        {cita.usuario?.nombre} {cita.usuario?.apellido}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'perfil' && (
            <div className="col-12">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <PerfilForm 
                            perfilData={perfilData}
                            isEditing={isEditing}
                            onEnableEdition={() => setIsEditing(true)}
                            onClear={() => {}}
                            onChange={handleChange}
                            onSubmit={handleSaveProfile}
                            onLogout={() => {}}
                        />
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;