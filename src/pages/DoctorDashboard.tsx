import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/estiloPerfil.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

import PerfilForm, { PerfilData } from '../components/perfil/PerfilForm';
import { useDoctorStatsFront, DoctorStat } from '../hooks/useDoctorStatsFront';

type EstadoCita = 'PROGRAMADA' | 'REALIZADA' | 'CANCELADA' | string;

interface PacienteLite {
  id?: number;
  id_usuario?: number;
  idUsuario?: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  correo?: string;
}

interface CitaMedica {
  id: number;
  fechaCita: string;
  horaInicio: string;
  horaFin?: string;
  estado: EstadoCita;
  idUsuario: number | null;
  idDoctor: number;
  disponible?: boolean;
  observacionesHorario?: string | null;
  usuario?: { nombre: string; apellido: string; telefono?: string; correo?: string };
  pago?: number | null;
  idReceta?: number | null;
  idResena?: number | null;
  idResumen?: number | null;
  idConsulta?: number | null;
  duracionMinutos?: number;
}

interface CitaCompletada {
  idCita: number;
  fechaCita: string;
  horaInicio: string;
  horaFin?: string;
  idUsuario?: number;
  idDoctor?: number;
  diagnostico?: string;
  observaciones?: string;
  paciente?: { nombre?: string; apellido?: string; correo?: string };
}

const CITAS_API_URL = 'http://localhost:8080/api/v1/citas';
const DOCTORES_API_URL = 'http://localhost:8082/api/v1/doctores';
const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';

const DIAGS = [
  "Cefalea tensional. Reposo e hidratación.",
  "Faringitis viral. Analgésico y reposo.",
  "Lumbalgia aguda. Ejercicios suaves y AINE.",
  "Gastritis. Dieta blanda y antiácido.",
  "Contractura cervical. Calor local y estiramientos.",
  "Otitis media. Analgésico y control.",
  "Tendinitis. Reposo relativo y hielo.",
  "Insomnio. Higiene del sueño y control en 7 días."
];

const pickRandomDiag = () => DIAGS[Math.floor(Math.random() * DIAGS.length)];
const splitDiag = (txt: string | undefined) => {
  if (!txt) return { diag: '', obs: '' };
  const marker = ' | Obs: ';
  const idx = txt.indexOf(marker);
  if (idx === -1) return { diag: txt, obs: '' };
  return { diag: txt.slice(0, idx), obs: txt.slice(idx + marker.length) };
};

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'agenda' | 'completadas' | 'perfil'>('agenda');
  const [citas, setCitas] = useState<CitaMedica[]>([]);
  const [completadas, setCompletadas] = useState<CitaCompletada[]>([]);
  const [completadasLoading, setCompletadasLoading] = useState(false);
  const [filters, setFilters] = useState<{ month: string; search: string }>({ month: '', search: '' });
  const [editItem, setEditItem] = useState<CitaCompletada | null>(null);
  const [editDiag, setEditDiag] = useState<string>('');
  const [editObs, setEditObs] = useState<string>('');
  const [savingDiag, setSavingDiag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const [doctorEspecialidad, setDoctorEspecialidad] = useState<string>('Especialidad no disponible');
  const [avatarPreview, setAvatarPreview] = useState<string>("https://cdn-icons-png.flaticon.com/512/3774/3774299.png");

  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: ''
  });
  const [originalData, setOriginalData] = useState<PerfilData | null>(null);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [perfilErrors, setPerfilErrors] = useState<Record<string, string>>({});

  const [isEditing, setIsEditing] = useState(false);
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [tarifaConsulta, setTarifaConsulta] = useState<number>(0);
  const [agendaSearch, setAgendaSearch] = useState('');

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } =
    useDoctorStatsFront(doctorId, 6, tarifaConsulta);

  const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/;
  const correoRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  const telefonoRegex = /^569\d{8}$/; // validamos digitos y agregamos + al guardar

  const monthToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const esCancelada = (estado: string) => {
    const up = (estado || '').toUpperCase();
    return up === 'CANCELADA' || up === 'CANCELADO';
  };
  const formatFecha = (f: string) => f?.includes('T') ? f.split('T')[0] : f;
  const formatMoney = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n || 0);
  const formatMonthLabel = (ym: string) => {
    const [year, month] = ym.split('-');
    const names = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const idx = Number(month) - 1;
    const name = names[idx] || ym;
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return `${capitalized} ${year}`;
  };

  useEffect(() => {
    const init = async () => {
      const sesion = localStorage.getItem('usuario');
      if (!sesion) { navigate('/login'); return; }
      const usuario = JSON.parse(sesion);

      if (usuario.role?.toLowerCase() !== 'doctor') { navigate('/'); return; }

      setDoctorName(`${usuario.nombre} ${usuario.apellido}`);
      const uId = usuario.userId || usuario.id;
      const dId = usuario.doctorId;
      setMyUserId(uId);
      setDoctorId(dId);
      setFilters(prev => ({ ...prev, month: monthToday() }));

      const savedAvatar = localStorage.getItem(`avatar_doctor_${uId}`);
      if (savedAvatar) setAvatarPreview(savedAvatar);

      // Perfil
      try {
        const respUser = await axios.get(`${USUARIOS_API_URL}/${uId}`);
        const u = respUser.data;
        const datosCargados = {
          nombre: u.nombre,
          apellido: u.apellido,
          correo: u.correo,
          telefono: u.telefono,
          fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : ''
        };
        setPerfilData(datosCargados);
        setOriginalData(datosCargados);
      } catch (e) { console.error("Error perfil", e); }

      // Datos del doctor (tarifa/especialidad)
      if (dId) {
        try {
          const respDoctor = await axios.get(`${DOCTORES_API_URL}/${dId}`);
          const doc = respDoctor.data || {};
          const tarifa = doc.tarifaConsulta ?? doc.tarifa_consulta ?? 0;
          if (tarifa) setTarifaConsulta(Number(tarifa));
          const esp = doc.especialidad?.nombre || doc.especialidadNombre || doc.nombreEspecialidad;
          if (esp) setDoctorEspecialidad(esp);
        } catch (e) {
          console.warn("No se pudo obtener la tarifa/especialidad del doctor");
        }
      }

      // Agenda + completadas
      try {
        if (dId) {
          await cargarCitasYCompletadas(dId, monthToday());
        }
      } catch (e) {
        console.error("Error inicial", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const cargarCitasYCompletadas = async (dId: number, month: string) => {
    // carga todas las citas, separa agenda y completadas
    try {
      const respCitas = await axios.get(CITAS_API_URL);
      const todas: CitaMedica[] = respCitas.data || [];

      // mapa de pacientes para completadas
      let usuariosMap: Record<number, PacienteLite> = {};
      try {
        const respUsers = await axios.get(USUARIOS_API_URL);
        (respUsers.data || []).forEach((u: any) => {
          const uid = u.id ?? u.id_usuario ?? u.idUsuario;
          if (uid) usuariosMap[uid] = u;
        });
      } catch (_) { /* sin usuarios, seguimos */ }

      const agenda = todas
        .filter(c => c.idDoctor === dId && c.fechaCita && !esCancelada(c.estado) && (c.estado || '').toUpperCase() !== 'REALIZADA')
        .filter(c => {
          // fecha futura o hoy
          const hoy = new Date();
          const f = new Date(formatFecha(c.fechaCita));
          return f >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        })
        .map(c => {
          const pacRaw = (c as any).usuario || usuariosMap[c.idUsuario || -1] || {};
          const tienePaciente = !!(pacRaw.nombre || pacRaw.apellido || pacRaw.correo || pacRaw.id || pacRaw.id_usuario || pacRaw.idUsuario);
          return {
            ...c,
            usuario: tienePaciente ? {
              nombre: pacRaw.nombre,
              apellido: pacRaw.apellido,
              telefono: pacRaw.telefono,
              correo: pacRaw.correo
            } : undefined
          };
        })
        .sort((a, b) => new Date(`${a.fechaCita}T${a.horaInicio}`).getTime() - new Date(`${b.fechaCita}T${b.horaInicio}`).getTime());

      setCitas(agenda);

      // completadas desde la misma lista
      setCompletadasLoading(true);
      const comp = todas
        .filter(c =>
          c.idDoctor === dId &&
          (c.estado || '').toUpperCase() === 'REALIZADA' &&
          c.observacionesHorario &&
          c.observacionesHorario.trim().length > 0 &&
          (month ? (formatFecha(c.fechaCita) || '').startsWith(month) : true)
        )
        .map(c => {
          const pacRaw = (c as any).usuario || usuariosMap[c.idUsuario || -1] || {};
          const parsed = splitDiag(c.observacionesHorario || '');
          return {
            idCita: c.id,
            fechaCita: c.fechaCita,
            horaInicio: c.horaInicio,
            horaFin: c.horaFin,
            idUsuario: c.idUsuario || undefined,
            idDoctor: c.idDoctor,
            diagnostico: parsed.diag || '',
            observaciones: parsed.obs || '',
            paciente: pacRaw.id || pacRaw.nombre ? { nombre: pacRaw.nombre, apellido: pacRaw.apellido, correo: pacRaw.correo } : undefined,
          } as CitaCompletada;
        });
      setCompletadas(comp);
    } catch (e) {
      console.warn("No se pudieron cargar citas completadas", e);
      setCompletadas([]);
    } finally {
      setCompletadasLoading(false);
    }
  };

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

  const extractError = (err: any) => {
    const msg = err?.response?.data?.message || err?.message || "Error desconocido";
    return msg;
  };

  const validarNombreApellidoLive = (valor: string, campo: "nombre" | "apellido") => {
    const limpio = valor.trim();
    if (!limpio) return `El ${campo} es obligatorio.`;
    if (limpio.length > 40) return `El ${campo} admite hasta 40 caracteres.`;
    if (!nombreApellidoRegex.test(limpio)) return `El ${campo} solo puede tener letras y espacios.`;
    return '';
  };

  const validateField = (id: string, value: string) => {
    if (id === 'nombre' || id === 'apellido') return validarNombreApellidoLive(value, id as 'nombre' | 'apellido');
    if (id === 'correo') {
      const correo = value.trim();
      if (!correo) return "El correo es obligatorio.";
      if (correo.length > 60) return "El correo admite hasta 60 caracteres.";
      if (!correoRegex.test(correo)) return "Ingresa un correo valido (ej: usuario@mail.cl).";
      return '';
    }
    if (id === 'telefono') {
      const tel = value.trim();
      const soloDigitos = tel.replace(/\D/g, '');
      if (!tel) return "El telefono es obligatorio.";
      if (!soloDigitos.startsWith('569')) return "El telefono debe iniciar con +569.";
      if (!telefonoRegex.test(soloDigitos)) return "Luego de +569 deben ser 8 digitos (ej: +56920731865).";
      return '';
    }
    if (id === 'fechaNacimiento') {
      if (!value) return "La fecha de nacimiento es obligatoria.";
      const fechaNacimientoDate = new Date(value);
      if (Number.isNaN(fechaNacimientoDate.getTime())) return "La fecha de nacimiento es invalida.";
      const hoy = new Date();
      const fechaMayorEdad = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
      if (fechaNacimientoDate > fechaMayorEdad) return "Debes ser mayor de 18 años.";
      return '';
    }
    return '';
  };

  const handleCancelarCita = async (id: number) => {
    if (!confirm("¿Seguro que desea cancelar esta cita?")) return;
    try {
        await axios.patch(`${CITAS_API_URL}/${id}/cancelar`, { motivo: "Cancelado por medico" });
        setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: 'CANCELADA' } : c));
    } catch (e) {
        console.error("Error en API al cancelar:", e);
        alert(`Error en API al cancelar: ${extractError(e)}`);
    }
  };

  const buildPayloadFromCita = (cita: any, overrides: Partial<CitaMedica>) => {
    return {
      id: cita.id,
      fechaCita: cita.fechaCita,
      estado: overrides.estado ?? cita.estado,
      idUsuario: overrides.idUsuario ?? cita.idUsuario,
      idDoctor: overrides.idDoctor ?? cita.idDoctor,
      pago: cita.pago ?? null,
      idReceta: cita.idReceta ?? null,
      idResena: cita.idResena ?? null,
      idResumen: cita.idResumen ?? null,
      idConsulta: cita.idConsulta ?? null,
      horaInicio: overrides.horaInicio ?? cita.horaInicio,
      horaFin: overrides.horaFin ?? cita.horaFin,
      duracionMinutos: cita.duracionMinutos ?? cita.duracion_minutos ?? 45,
      disponible: overrides.disponible ?? cita.disponible ?? false,
      observacionesHorario: overrides.observacionesHorario ?? cita.observacionesHorario ?? cita.observaciones_horario ?? null
    };
  };

  const handleDiagnosticar = async (id: number) => {
    const diagnosticoUsuario = prompt("Diagnostico de la cita:");
    if (!diagnosticoUsuario || !diagnosticoUsuario.trim()) return;
    const observaciones = prompt("Observaciones (opcional):") || '';
    try {
      const respGet = await axios.get(`${CITAS_API_URL}/${id}`);
      const cita = respGet.data || {};
      const baseDiag = diagnosticoUsuario.trim();
      const obsFinal = observaciones ? `${baseDiag} | Obs: ${observaciones}` : baseDiag;
      const payload = buildPayloadFromCita(cita, {
        estado: 'REALIZADA',
        disponible: false,
        observacionesHorario: obsFinal
      });
      await axios.put(`${CITAS_API_URL}/${id}`, payload);
      setCitas(prev => prev.filter(c => c.id !== id)); // sacamos de agenda
      refetchStats();
      if (doctorId) await cargarCitasYCompletadas(doctorId, filters.month || monthToday());
      alert("Cita finalizada y marcada como REALIZADA.");
    } catch (e: any) {
      console.error("Error al diagnosticar la cita:", e);
      alert(`Error al diagnosticar la cita: ${extractError(e)}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prev => ({ ...prev, [id]: value }));

    const errorMsg = validateField(id, value);
    setPerfilErrors(prev => {
      const updated = { ...prev };
      if (errorMsg) updated[id] = errorMsg; else delete updated[id];
      return updated;
    });
  };

  const handleRestore = () => {
    if (originalData) {
        setPerfilData(originalData);
        alert("Datos restaurados.");
    }
    setNuevaPassword('');
    setConfirmPassword('');
    setPerfilErrors({});
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myUserId) return;
    await handleSaveProfileWithPassword(e);
  };

  const handleSaveProfileWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myUserId) return;
    const nombre = perfilData.nombre.trim();
    const apellido = perfilData.apellido.trim();
    const correo = perfilData.correo.trim();
    const telefono = perfilData.telefono.trim();
    const telefonoDigitos = telefono.replace(/\D/g, '');
    const fechaNac = perfilData.fechaNacimiento;

    const errs: Record<string, string> = {};
    ([
      ['nombre', nombre],
      ['apellido', apellido],
      ['correo', correo],
      ['telefono', telefono],
      ['fechaNacimiento', fechaNac],
    ] as const).forEach(([campo, valor]) => {
      const msg = validateField(campo, valor);
      if (msg) errs[campo] = msg;
    });
    if (nuevaPassword || confirmPassword) {
      if (nuevaPassword.length < 8) errs.contrasena = "La contrasena debe tener al menos 8 caracteres.";
      if (nuevaPassword !== confirmPassword) errs.confirmarContrasena = "Las contrasenas no coinciden.";
    }
    setPerfilErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
        const telefonoNormalizado = telefonoDigitos.startsWith('569') && telefonoDigitos.length === 11
          ? `+${telefonoDigitos}`
          : telefono;
        const payload: any = {
          ...perfilData,
          nombre,
          apellido,
          correo,
          telefono: telefonoNormalizado,
          fechaNacimiento: `${perfilData.fechaNacimiento}T00:00:00`
        };
        if (nuevaPassword) payload.contrasena = nuevaPassword;
        await axios.put(`${USUARIOS_API_URL}/${myUserId}`, payload);
        alert("Datos actualizados.");
        setIsEditing(false);
        setPerfilData(prev => ({ ...prev, ...payload, fechaNacimiento: perfilData.fechaNacimiento }));
        setOriginalData({ ...perfilData, nombre, apellido, correo, telefono: telefonoNormalizado });
        const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
        sesion.nombre = nombre; sesion.apellido = apellido;
        localStorage.setItem('usuario', JSON.stringify(sesion));
        setDoctorName(`${nombre} ${apellido}`);
        setNuevaPassword('');
        setConfirmPassword('');
        setPerfilErrors({});
    } catch (e) { alert("Error al guardar."); }
  };

  const filteredCompletadas = completadas.filter(item => {
    const matchesMonth = filters.month ? (formatFecha(item.fechaCita) || '').startsWith(filters.month) : true;
    const fullName = `${item.paciente?.nombre || ''} ${item.paciente?.apellido || ''}`.toLowerCase();
    const email = (item.paciente?.correo || '').toLowerCase();
    const matchesSearch = filters.search ? (fullName.includes(filters.search.toLowerCase()) || email.includes(filters.search.toLowerCase())) : true;
    return matchesMonth && matchesSearch;
  });

  const filteredAgenda = citas
    .filter(c => !esCancelada(c.estado) && c.usuario?.nombre && c.usuario?.correo && c.usuario?.telefono)
    .filter((c) => {
      if (!agendaSearch.trim()) return true;
      const term = agendaSearch.toLowerCase();
      const fullName = `${c.usuario?.nombre || ''} ${c.usuario?.apellido || ''}`.toLowerCase();
      const email = (c.usuario?.correo || '').toLowerCase();
      return fullName.includes(term) || email.includes(term);
    });

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="perfil-container bg-light" style={{minHeight: '100vh'}}>
      <div className="container-fluid px-lg-5 py-4">
        
        <div className="dashboard-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="avatar-container" onClick={handleAvatarClick}>
              <div 
                className="avatar-image" 
                style={{ backgroundImage: `url(${avatarPreview})` }}
              ></div>
              <div className="avatar-edit-icon"><i className="bi bi-camera-fill"></i></div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
            </div>
            <div><h2 className="fw-bold mb-0">Panel Medico</h2><p className="mb-0 opacity-75">Dr/a. {doctorName}</p></div>
          </div>
          <div className="d-flex gap-2">
            <button className={`btn ${activeTab === 'agenda' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab('agenda')}>Agenda</button>
            <button className={`btn ${activeTab === 'completadas' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab('completadas')}>Citas completadas</button>
            <button className={`btn ${activeTab === 'perfil' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab('perfil')}>Mis Datos</button>
            <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
          </div>
        </div>

        <div className="row g-4">
          {activeTab === 'agenda' && (
            <>
              <div className="col-lg-12">
                <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-3">
                  <h4 className="text-primary fw-bold mb-2 mb-lg-0">Proximos Pacientes</h4>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control"
                      style={{ minWidth: '260px' }}
                      placeholder="Buscar por nombre o correo"
                      value={agendaSearch}
                      onChange={(e) => setAgendaSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="agenda-list">
                    {filteredAgenda.length === 0 ? (
                        <div className="text-center p-5 bg-white rounded shadow-sm"><p className="text-muted">No hay citas programadas.</p></div>
                    ) : (
                        filteredAgenda
                          .map(cita => (
                            <div key={cita.id} className="card cita-card">
                                <div className="card-body cita-card-body">
                                    <div>
                                        <h5 className="cita-paciente-name">{cita.usuario?.nombre} {cita.usuario?.apellido}</h5>
                                        <div className="d-flex gap-3 flex-wrap">
                                            <span className="cita-info-item"><i className="bi bi-calendar-event"></i> {formatFecha(cita.fechaCita)}</span>
                                            <span className="cita-info-item"><i className="bi bi-clock-fill"></i> {cita.horaInicio}</span>
                                            {cita.usuario?.correo && (
                                              <span className="cita-info-item" title={cita.usuario.correo}>
                                                <i className="bi bi-envelope-fill"></i> {cita.usuario.correo}
                                              </span>
                                            )}
                                            {cita.usuario?.telefono && (
                                              <span className="cita-info-item" title={cita.usuario.telefono}>
                                                <i className="bi bi-telephone-fill"></i> {cita.usuario.telefono}
                                              </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelarCita(cita.id)}>Cancelar</button>
                                      <button className="btn btn-outline-success btn-sm" onClick={() => handleDiagnosticar(cita.id)}>Finalizar</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'completadas' && (
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex flex-column flex-lg-row gap-3 align-items-lg-end justify-content-between">
                    <div>
                      <h4 className="fw-bold text-primary mb-1">Citas completadas</h4>
                      <p className="text-muted mb-0">Realizadas por este doctor</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      <div className="d-flex flex-column">
                        <label className="form-label mb-1 small text-muted">Filtrar por mes (YYYY-MM)</label>
                        <input
                          type="month"
                          className="form-control"
                          value={filters.month}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFilters(prev => ({ ...prev, month: val }));
                            if (doctorId) cargarCitasYCompletadas(doctorId, val);
                          }}
                        />
                      </div>
                      <div className="d-flex flex-column flex-grow-1">
                        <label className="form-label mb-1 small text-muted">Buscar por paciente o correo</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ej: nombre, apellido o email"
                          value={filters.search}
                          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive mt-3">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Paciente</th>
                          <th>Diagnostico</th>
                          <th>Observaciones</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {completadasLoading && (
                          <tr><td colSpan={7} className="text-center text-muted">Cargando...</td></tr>
                        )}
                        {!completadasLoading && filteredCompletadas.length === 0 && (
                          <tr><td colSpan={7} className="text-center text-muted">Sin completadas para los filtros seleccionados.</td></tr>
                        )}
                        {!completadasLoading && filteredCompletadas.map(item => (
                          <tr key={item.idCita}>
                            <td>{formatFecha(item.fechaCita)}</td>
                            <td>{item.horaInicio || '—'}</td>
                            <td>
                              <div className="fw-semibold">{item.paciente?.nombre} {item.paciente?.apellido}</div>
                              <div className="text-muted small">{item.paciente?.correo}</div>
                            </td>
                            <td className="text-wrap" style={{maxWidth: '240px'}}>{item.diagnostico || '—'}</td>
                            <td className="text-wrap" style={{maxWidth: '200px'}}>{item.observaciones || '—'}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => { setEditItem(item); setEditDiag(item.diagnostico || ''); setEditObs(item.observaciones || ''); }}>Editar diagnostico</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {editItem && (
                <div className="modal d-block" tabIndex={-1} role="dialog" style={{background: 'rgba(0,0,0,0.4)'}}>
                  <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Editar diagnostico</h5>
                        <button type="button" className="btn-close" onClick={() => setEditItem(null)}></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">Diagnostico (requerido)</label>
                          <textarea className="form-control" rows={3} value={editDiag} onChange={e => setEditDiag(e.target.value)} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Observaciones</label>
                          <textarea className="form-control" rows={2} value={editObs} onChange={e => setEditObs(e.target.value)} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setEditItem(null)}>Cancelar</button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={savingDiag || editDiag.trim().length < 3}
                          onClick={async () => {
                            if (!editItem || !doctorId) return;
                            setSavingDiag(true);
                            try {
                              const respGet = await axios.get(`${CITAS_API_URL}/${editItem.idCita}`);
                              const cita = respGet.data || {};
                              const payload = buildPayloadFromCita(cita, {
                                estado: 'REALIZADA',
                                disponible: false,
                                observacionesHorario: editDiag.trim() + (editObs ? ` | Obs: ${editObs}` : '')
                              });
                              await axios.put(`${CITAS_API_URL}/${editItem.idCita}`, payload);
                              await cargarCitasYCompletadas(doctorId, filters.month || monthToday());
                              alert('Diagnostico actualizado.');
                            } catch (e: any) {
                              console.error('Error al actualizar diagnostico', e);
                              alert(`No se pudo actualizar: ${extractError(e)}`);
                            } finally {
                              setSavingDiag(false);
                              setEditItem(null);
                            }
                          }}
                        >
                          {savingDiag ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="col-12">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <PerfilForm 
                            perfilData={perfilData}
                            isEditing={isEditing}
                            onEnableEdition={() => setIsEditing(true)}
                            onClear={handleRestore}
                            onChange={handleChange}
                            onSubmit={handleSaveProfileWithPassword}
                            onLogout={() => {}}
                            showPasswordChange
                            password={nuevaPassword}
                            confirmPassword={confirmPassword}
                            onPasswordChange={(ev) => {
                              const { id, value } = ev.target;
                              if (id === 'contrasena') setNuevaPassword(value);
                              if (id === 'confirmarContrasena') setConfirmPassword(value);
                            }}
                            errors={perfilErrors}
                        />
                        <hr />
                        <h5 className="fw-bold text-primary mb-3">BONO</h5>
                        {statsError && <div className="text-danger small mb-2">{statsError}</div>}
                        {statsLoading ? (
                          <div className="d-flex align-items-center gap-2 text-muted"><div className="spinner-border spinner-border-sm text-primary"></div> Cargando estadísticas...</div>
                        ) : (
                          <div className="row g-3">
                            {stats.length === 0 && <div className="text-muted">Sin datos de los últimos meses.</div>}
                            {stats.map((s: DoctorStat) => (
                              <div className="col-md-4 col-12" key={s.month}>
                                <div className="border rounded p-3 bg-light">
                                  <div className="fw-bold">{formatMonthLabel(s.month)}</div>
                                  <div className="small text-muted">Realizadas: {s.realizadas} • Canceladas: {s.canceladas}</div>
                                  <div className="fw-semibold text-success mt-1">Ganancias totales: {formatMoney(s.total_revenue || 0)}</div>
                                  <div className="text-primary">Bono 10%: {formatMoney(s.bonus_10 || 0)}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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
