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
  const [avatarPreview, setAvatarPreview] = useState<string>("https://cdn-icons-png.flaticon.com/512/3774/3774299.png");

  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: ''
  });
  // [NUEVO] Copia de seguridad para restaurar
  const [originalData, setOriginalData] = useState<PerfilData | null>(null);

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

      const savedAvatar = localStorage.getItem(`avatar_doctor_${uId}`);
      if (savedAvatar) setAvatarPreview(savedAvatar);

      // 1. Cargar Perfil
      try {
        const respUser = await axios.get(`${USUARIOS_API_URL}/${uId}`);
        const u = respUser.data;
        const datosCargados = {
            nombre: u.nombre, apellido: u.apellido, correo: u.correo,
            telefono: u.telefono, 
            fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : ''
        };
        setPerfilData(datosCargados);
        setOriginalData(datosCargados); // [IMPORTANTE] Guardar backup
      } catch (e) { console.error("Error perfil", e); }

      // 2. Cargar Agenda
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

  // --- ACCIONES ---
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setAvatarPreview(base64String);
            if (myUserId) localStorage.setItem(`avatar_doctor_${myUserId}`, base64String);
        };
        reader.readAsDataURL(file);
    } else if (file) { alert("Imagen muy pesada (Max 2MB)"); }
  };

  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/login'); };

  const handleCancelarCita = async (id: number) => {
    if (!confirm("¿Seguro que desea cancelar esta cita?")) return;
    try {
        await axios.patch(`${CITAS_API_URL}/${id}/cancelacion`, { motivo: "Cancelado por médico" });
        setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: 'CANCELADO' } : c));
    } catch (e) { alert("Error en API al cancelar."); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prev => ({ ...prev, [id]: value }));
  };

  // [NUEVO] Función Restaurar
  const handleRestore = () => {
    if (originalData) {
        setPerfilData(originalData);
        alert("Datos restaurados.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myUserId) return;
    
    if (!perfilData.nombre.trim() || !perfilData.apellido.trim() || !perfilData.correo.trim()) {
        alert("No puedes dejar campos vacíos.");
        return;
    }

    try {
        const payload = { ...perfilData, fechaNacimiento: `${perfilData.fechaNacimiento}T00:00:00` };
        await axios.put(`${USUARIOS_API_URL}/${myUserId}`, payload);
        alert("Datos actualizados.");
        setIsEditing(false);
        setOriginalData(perfilData); // Actualizamos el backup
        
        const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
        sesion.nombre = perfilData.nombre; sesion.apellido = perfilData.apellido;
        localStorage.setItem('usuario', JSON.stringify(sesion));
        setDoctorName(`${perfilData.nombre} ${perfilData.apellido}`);
    } catch (e) { alert("Error al guardar."); }
  };

  const esCancelada = (estado: string) => estado.toUpperCase() === 'CANCELADO' || estado.toUpperCase() === 'CANCELADA';

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="perfil-container bg-light" style={{minHeight: '100vh'}}>
      <div className="container-fluid px-lg-5 py-4">
        
        <div className="dashboard-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="avatar-container" onClick={handleAvatarClick}>
              {/* CAMBIO: Usamos un div con imagen de fondo en lugar de img */}
              <div 
                className="avatar-image" 
                style={{ backgroundImage: `url(${avatarPreview})` }}
              ></div>
              <div className="avatar-edit-icon"><i className="bi bi-camera-fill"></i></div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
            </div>
            <div><h2 className="fw-bold mb-0">Panel Médico</h2><p className="mb-0 opacity-75">Dr/a. {doctorName}</p></div>
          </div>
          <div className="d-flex gap-2">
            <button className={`btn ${activeTab === 'agenda' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab('agenda')}>Agenda</button>
            <button className={`btn ${activeTab === 'perfil' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab('perfil')}>Mis Datos</button>
            <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
          </div>
        </div>

        <div className="row g-4">
          {activeTab === 'agenda' && (
            <>
              <div className="col-lg-8">
                <h4 className="mb-3 text-primary fw-bold">Próximos Pacientes</h4>
                <div className="agenda-list">
                    {citas.filter(c => !esCancelada(c.estado)).length === 0 ? (
                        <div className="text-center p-5 bg-white rounded shadow-sm"><p className="text-muted">No hay citas programadas.</p></div>
                    ) : (
                        citas.filter(c => !esCancelada(c.estado)).map(cita => (
                            <div key={cita.id} className="card cita-card">
                                <div className="card-body cita-card-body">
                                    <div>
                                        <h5 className="cita-paciente-name">{cita.usuario?.nombre} {cita.usuario?.apellido}</h5>
                                        <div className="d-flex gap-3 flex-wrap">
                                            <span className="cita-info-item"><i className="bi bi-calendar-event"></i> {cita.fechaCita}</span>
                                            <span className="cita-info-item"><i className="bi bi-clock-fill"></i> {cita.horaInicio}</span>
                                            <span className="cita-info-item" title={cita.usuario?.correo}><i className="bi bi-envelope-fill"></i> {cita.usuario?.correo}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelarCita(cita.id)}>Cancelar</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
              </div>
              <div className="col-lg-4">
                <h5 className="mb-3 text-secondary">Historial Canceladas</h5>
                <div className="bg-white rounded shadow-sm p-3" style={{maxHeight: '500px', overflowY: 'auto'}}>
                    {citas.filter(c => esCancelada(c.estado)).map(cita => (
                        <li key={cita.id} className="historial-card-item list-unstyled">
                            <div className="d-flex justify-content-between mb-1"><strong className="text-dark">{cita.fechaCita}</strong><span className="badge bg-danger-subtle text-danger-emphasis">Cancelada</span></div>
                            <div className="small text-muted">{cita.usuario?.nombre} {cita.usuario?.apellido}</div>
                        </li>
                    ))}
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
                            onClear={handleRestore} // [CORREGIDO] Conectamos la función
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