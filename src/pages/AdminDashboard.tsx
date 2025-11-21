import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/estiloPerfil.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

import PerfilForm, { PerfilData } from '../components/perfil/PerfilForm';

const USUARIOS_API_URL = 'http://localhost:8082/api/v1';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'crear' | 'perfil'>('crear');
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("https://cdn-icons-png.flaticon.com/512/2206/2206368.png");

  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: ''
  });
  const [originalData, setOriginalData] = useState<PerfilData | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [listaEspecialidades, setListaEspecialidades] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: '',
    contrasena: '', tarifaConsulta: '', sueldo: '', bono: '0', especialidad: ''
  });

  // --- CARGA INICIAL ---
  useEffect(() => {
    const init = async () => {
      const usuarioSesion = localStorage.getItem('usuario');
      if (!usuarioSesion) { navigate('/login'); return; }
      
      const usuario = JSON.parse(usuarioSesion);
      const rol = usuario.role ? usuario.role.toLowerCase() : '';
      if (!rol.includes('admin') && !rol.includes('administrativo')) { navigate('/'); return; }

      setAdminName(`${usuario.nombre} ${usuario.apellido}`);
      const uId = usuario.userId || usuario.id;
      setMyUserId(uId);

      const savedAvatar = localStorage.getItem(`avatar_admin_${uId}`);
      if (savedAvatar) setAvatarPreview(savedAvatar);

      try {
        const respUser = await axios.get(`${USUARIOS_API_URL}/usuarios/${uId}`);
        const u = respUser.data;
        const datosCargados = {
            nombre: u.nombre, apellido: u.apellido, correo: u.correo,
            telefono: u.telefono, 
            fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : ''
        };
        setPerfilData(datosCargados);
        setOriginalData(datosCargados);
      } catch (e) { console.error("Error perfil admin", e); }

      try {
        const respEsp = await axios.get(`${USUARIOS_API_URL}/especialidades`);
        const especialidadesRaw = respEsp.data || [];
        const nombresUnicos = Array.from(new Set(especialidadesRaw.map((e: any) => e.nombre)));
        setListaEspecialidades(nombresUnicos as string[]);
      } catch (e) { console.warn("No especialidades"); }
    };

    init();
  }, [navigate]);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 2097152) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setAvatarPreview(base64);
            if (myUserId) localStorage.setItem(`avatar_admin_${myUserId}`, base64);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/login'); };

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRestore = () => {
    if (originalData) {
        setPerfilData(originalData);
        alert("Datos restaurados.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myUserId) return;
    if (!perfilData.nombre.trim() || !perfilData.apellido.trim()) { alert("No deje campos vacíos."); return; }
    
    try {
        const payload = { ...perfilData, fechaNacimiento: `${perfilData.fechaNacimiento}T00:00:00` };
        await axios.put(`${USUARIOS_API_URL}/usuarios/${myUserId}`, payload);
        alert("Datos actualizados.");
        setIsEditing(false);
        setOriginalData(perfilData);
        const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
        sesion.nombre = perfilData.nombre; sesion.apellido = perfilData.apellido;
        localStorage.setItem('usuario', JSON.stringify(sesion));
        setAdminName(`${perfilData.nombre} ${perfilData.apellido}`);
    } catch (e) { alert("Error al guardar."); }
  };

  // --- 🛡️ FUNCIÓN DE VALIDACIÓN AVANZADA ---
  const validarNuevoDoctor = () => {
    const { nombre, apellido, telefono, fechaNacimiento, contrasena, tarifaConsulta, sueldo, bono, especialidad } = formData;

    // 1. Nombre y Apellido (3-30 caracteres)
    if (nombre.length < 3 || nombre.length > 30) return "El nombre debe tener entre 3 y 30 caracteres.";
    if (apellido.length < 3 || apellido.length > 30) return "El apellido debe tener entre 3 y 30 caracteres.";

    // 2. Especialidad (Máximo 30 caracteres)
    if (especialidad.length > 30) return "La especialidad no puede superar los 30 caracteres.";

    // 3. Teléfono Chileno (+569XXXXXXXX)
    const fonoRegex = /^\+569\d{8}$/;
    if (!fonoRegex.test(telefono)) return "El teléfono debe ser formato +569 seguido de 8 dígitos.";

    // 4. Edad (Mayor de 18)
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    if (edad < 18) return "El doctor debe ser mayor de 18 años.";

    // 5. Contraseña (Mayúscula, 3 números, signo, min 8)
    // Regex: Al menos 1 Mayus, 3 Digitos, 1 Caracter especial, Min 8 largo
    // (?=.*[A-Z]) -> Mayúscula
    // (?=(?:.*\d){3,}) -> 3 Números
    // (?=.*[\W_]) -> Símbolo
    // .{8,} -> Largo 8
    const passRegex = /^(?=.*[A-Z])(?=(?:.*\d){3,})(?=.*[\W_]).{8,}$/;
    if (!passRegex.test(contrasena)) {
        return "La contraseña debe tener al menos: 8 caracteres, 1 mayúscula, 3 números y 1 símbolo (ej: Duoc123@).";
    }

    // 6. Valores Numéricos (No negativos)
    if (parseInt(tarifaConsulta) < 0) return "La tarifa no puede ser negativa.";
    if (parseInt(sueldo) < 0) return "El sueldo no puede ser negativo.";
    if (parseInt(bono) < 0) return "El bono no puede ser negativo.";

    return null; // Todo OK
  };


  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- VALIDACIÓN PREVIA ---
    const errorValidacion = validarNuevoDoctor();
    if (errorValidacion) {
        alert(`Error de Validación:\n${errorValidacion}`);
        return;
    }
    // ------------------------

    setLoading(true);
    try {
        const usuarioPayload = {
            nombre: formData.nombre, apellido: formData.apellido, correo: formData.correo,
            telefono: formData.telefono, contrasena: formData.contrasena,
            fechaNacimiento: `${formData.fechaNacimiento}T00:00:00`, rol: { id: 2 }
        };
        const respUsuario = await axios.post(`${USUARIOS_API_URL}/usuarios`, usuarioPayload);
        
        const doctorPayload = {
            tarifaConsulta: parseInt(formData.tarifaConsulta), sueldo: parseInt(formData.sueldo),
            bono: parseInt(formData.bono), activo: true, usuario: { id: respUsuario.data.id }
        };
        const respDoctor = await axios.post(`${USUARIOS_API_URL}/doctores`, doctorPayload);
        
        await axios.post(`${USUARIOS_API_URL}/doctores/${respDoctor.data.id}/especialidades`, {
            nombre: formData.especialidad, doctorId: respDoctor.data.id
        });
        
        alert(`¡Dr. ${formData.apellido} registrado correctamente!`);
        
        // Actualizamos lista si es nueva especialidad
        if (!listaEspecialidades.includes(formData.especialidad)) {
            setListaEspecialidades([...listaEspecialidades, formData.especialidad]);
        }

        setFormData({ nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: '', contrasena: '', tarifaConsulta: '', sueldo: '', bono: '0', especialidad: '' });
    } catch (error: any) {
        console.error("Error creando doctor:", error);
        const msg = error.response?.data?.message || "Error al registrar. Verifique correo duplicado.";
        alert(`Error del Servidor: ${msg}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="perfil-container bg-light" style={{minHeight: '100vh'}}>
      <div className="container-fluid px-lg-5 py-4">
        
        <div className="dashboard-header d-flex justify-content-between align-items-center"
             style={{ background: 'linear-gradient(135deg, #dc3545 0%, #8a1c27 100%)' }}>
          <div className="d-flex align-items-center">
            <div className="avatar-container" onClick={handleAvatarClick}>
                <img src={avatarPreview} alt="Perfil" className="avatar-image" />
                <div className="avatar-edit-icon text-danger"><i className="bi bi-camera-fill"></i></div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
            </div>
            <div><h2 className="fw-bold mb-0">Administración</h2><p className="mb-0 opacity-75">Hola, {adminName}</p></div>
          </div>
          <div className="d-flex gap-2">
            <button className={`btn ${activeTab === 'crear' ? 'btn-light text-danger' : 'btn-outline-light'}`} onClick={() => setActiveTab('crear')}>Gestión Médica</button>
            <button className={`btn ${activeTab === 'perfil' ? 'btn-light text-danger' : 'btn-outline-light'}`} onClick={() => setActiveTab('perfil')}>Mis Datos</button>
            <button className="btn btn-dark" onClick={handleLogout}>Salir</button>
          </div>
        </div>

        <div className="row mt-4 justify-content-center">
            {activeTab === 'crear' && (
                <div className="col-lg-9">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom py-3"><h5 className="mb-0 text-danger fw-bold">Registrar Nuevo Profesional</h5></div>
                        <div className="card-body p-4">
                            <form onSubmit={handleCreateDoctor}>
                                <h6 className="text-muted mb-3 text-uppercase small fw-bold">Información Personal</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label>Nombre (3-30 caracteres)</label>
                                        <input id="nombre" className="form-control" value={formData.nombre} onChange={handleChangeForm} required minLength={3} maxLength={30} />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Apellido (3-30 caracteres)</label>
                                        <input id="apellido" className="form-control" value={formData.apellido} onChange={handleChangeForm} required minLength={3} maxLength={30} />
                                    </div>
                                    <div className="col-md-6"><label>Correo (Login)</label><input id="correo" type="email" className="form-control" value={formData.correo} onChange={handleChangeForm} required placeholder="doctor@clinica.com" /></div>
                                    <div className="col-md-6">
                                        <label>Contraseña (Ej: Duoc123@)</label>
                                        <input id="contrasena" type="password" className="form-control" value={formData.contrasena} onChange={handleChangeForm} required placeholder="1 Mayus, 3 Num, 1 Signo" />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Teléfono (+569...)</label>
                                        <input id="telefono" className="form-control" value={formData.telefono} onChange={handleChangeForm} placeholder="+56912345678" />
                                    </div>
                                    <div className="col-md-6"><label>Fecha Nacimiento (+18 años)</label><input id="fechaNacimiento" type="date" className="form-control" value={formData.fechaNacimiento} onChange={handleChangeForm} required /></div>
                                </div>
                                <h6 className="text-muted mb-3">Datos Profesionales</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label>Especialidad (Max 30 chars)</label>
                                        <input list="esp-list" id="especialidad" className="form-control" value={formData.especialidad} onChange={handleChangeForm} required maxLength={30} />
                                        <datalist id="esp-list">{listaEspecialidades.map((e, i) => <option key={i} value={e} />)}</datalist>
                                    </div>
                                    <div className="col-md-6"><label>Tarifa ($)</label><input id="tarifaConsulta" type="number" min="0" className="form-control" value={formData.tarifaConsulta} onChange={handleChangeForm} required /></div>
                                    <div className="col-md-6"><label>Sueldo ($)</label><input id="sueldo" type="number" min="0" className="form-control" value={formData.sueldo} onChange={handleChangeForm} required /></div>
                                    <div className="col-md-6"><label>Bono ($)</label><input id="bono" type="number" min="0" className="form-control" value={formData.bono} onChange={handleChangeForm} /></div>
                                </div>
                                <div className="d-grid"><button type="submit" className="btn btn-danger btn-lg" disabled={loading}>{loading ? "..." : "Crear Doctor"}</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'perfil' && (
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <PerfilForm 
                                perfilData={perfilData}
                                isEditing={isEditing}
                                onEnableEdition={() => setIsEditing(true)}
                                onClear={handleRestore}
                                onChange={(e) => setPerfilData(prev => ({ ...prev, [e.target.id]: e.target.value }))}
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

export default AdminDashboard;