import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/estiloAdmin.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

import PerfilForm, { PerfilData } from '../components/perfil/PerfilForm';

const USUARIOS_API_URL = 'http://localhost:8082/api/v1';
const DOCTOR_CREACION_URL = `${USUARIOS_API_URL}/usuarios/doctores`;

interface Especialidad {
  id: number | string;
  nombre: string;
}

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
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [perfilErrors, setPerfilErrors] = useState<Record<string, string>>({});
  
  const [isEditing, setIsEditing] = useState(false);
  const [listaEspecialidades, setListaEspecialidades] = useState<Especialidad[]>([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('');
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [creandoEspecialidad, setCreandoEspecialidad] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    salario: ''
  });

  const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/;
  const correoRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  const telefonoRegex = /^569\d{8}$/; // validamos digitos y agregamos + al guardar

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
        const especialidadesRaw = (respEsp.data || []) as any[];
        const especialidades: Especialidad[] = especialidadesRaw
          .map((e: any) => ({
            id: e.id ?? e.idEspecialidad ?? e.codigo ?? e.nombre,
            nombre: e.nombre as string
          }))
          .filter((e) => e.id !== undefined && !!e.nombre);
        // Deduplicamos por nombre (case-insensitive) para mostrar una sola vez
        const unicasPorNombre: Especialidad[] = Array.from(
          new Map<string, Especialidad>(especialidades.map((e) => [e.nombre.toLowerCase(), e])).values()
        );
        setListaEspecialidades(unicasPorNombre);
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

  const handleCrearEspecialidad = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nombre = nuevaEspecialidad.trim();
    if (!nombre) { alert("Ingrese un nombre de especialidad."); return; }
    const existente = listaEspecialidades.find((esp) => esp.nombre.toLowerCase() === nombre.toLowerCase());
    if (existente) {
        setSelectedSpecialtyId(String(existente.id));
        setNuevaEspecialidad('');
        alert("Esa especialidad ya existe, la he seleccionado.");
        return;
    }
    // No creamos en API aquí para evitar 400: marcamos como nueva y la enviaremos luego junto al doctor.
    const tempId = `new-${Date.now()}`;
    const nueva = { id: tempId, nombre };
    setListaEspecialidades(prev => [...prev, nueva]);
    setNuevaEspecialidad('');
    setSelectedSpecialtyId(String(nueva.id));
  };

  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/login'); };

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setPerfilErrors({});
    setNuevaPassword('');
    setConfirmPassword('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
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
        await axios.put(`${USUARIOS_API_URL}/usuarios/${myUserId}`, payload);
        alert("Datos actualizados.");
        setIsEditing(false);
        setPerfilData(prev => ({ ...prev, ...payload, fechaNacimiento: perfilData.fechaNacimiento }));
        setOriginalData({ ...perfilData, nombre, apellido, correo, telefono: telefonoNormalizado });
        const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
        sesion.nombre = nombre; sesion.apellido = apellido;
        localStorage.setItem('usuario', JSON.stringify(sesion));
        setAdminName(`${nombre} ${apellido}`);
        setNuevaPassword('');
        setConfirmPassword('');
        setPerfilErrors({});
    } catch (e) { alert("Error al guardar."); }
  };

  const generarPassword = (apellido: string) => {
    const clean = apellido
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z]/g, '')
      .toLowerCase();
    const base = (clean || 'doc').slice(0, 4).padEnd(4, 'x');
    const digits = Math.floor(100 + Math.random() * 900); // 3 dígitos aleatorios
    return `${base}${digits}@`;
  };

  const validarNuevoDoctor = () => {
    const { nombre, apellido, telefono, fechaNacimiento, correo, salario } = formData;
    const nameRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ'\s]{1,60}$/;
    if (!nameRegex.test(nombre.trim())) return "El nombre solo admite letras y espacios (máximo 60).";
    if (!nameRegex.test(apellido.trim())) return "El apellido solo admite letras y espacios (máximo 60).";

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fechaNacimiento)) return "La fecha de nacimiento debe tener formato aaaa-mm-dd.";
    const fecha = new Date(fechaNacimiento);
    if (Number.isNaN(fecha.getTime())) return "La fecha de nacimiento no es válida.";
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const diffMes = hoy.getMonth() - fecha.getMonth();
    if (diffMes < 0 || (diffMes === 0 && hoy.getDate() < fecha.getDate())) edad--;
    if (edad < 25) return "El doctor debe tener al menos 25 años.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) return "El correo no tiene un formato válido.";

    const phoneRegex = /^\+?\d{8,}$/;
    if (!phoneRegex.test(telefono.trim())) return "El teléfono debe tener mínimo 8 dígitos, solo números y puede iniciar con +.";

    const salarioVal = Number(salario);
    if (!Number.isFinite(salarioVal) || salarioVal <= 0) return "El salario debe ser un número positivo.";

    if (!selectedSpecialtyId) return "Seleccione una especialidad.";

    return null;
  };


  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errorValidacion = validarNuevoDoctor();
    if (errorValidacion) {
        alert(`Error de validación:\n${errorValidacion}`);
        return;
    }

    setLoading(true);
    try {
        const rolId = 2;
        const especialidadSeleccionada = listaEspecialidades.find(e => String(e.id) === selectedSpecialtyId);
        const esNuevaEspecialidad = selectedSpecialtyId.startsWith('new-') && especialidadSeleccionada;

        // Payload principal (titular usuario doctor)
        const usuarioPayload = {
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          correo: formData.correo.trim(),
          telefono: formData.telefono.trim(),
          fechaNacimiento: `${formData.fechaNacimiento}T00:00:00`,
          contrasena: generarPassword(formData.apellido),
          rol: { id: rolId },
          idRol: rolId
        };

        const doctorPayloadBase = {
          salario: Number(formData.salario),
          // Tarifa/bono obligatorios en la tabla Doctor: usamos 0 como placeholder si no se pide en UI
          tarifaConsulta: 0,
          bono: 0,
          activo: true
        };

        let doctorId: number | null = null;
        let usuarioId: number | null = null;

        // Intentamos endpoint combinado primero
        try {
          const respCombined = await axios.post(DOCTOR_CREACION_URL, {
            ...usuarioPayload,
            ...doctorPayloadBase,
            idEspecialidad: esNuevaEspecialidad ? undefined : Number(selectedSpecialtyId),
            nombreEspecialidad: esNuevaEspecialidad ? especialidadSeleccionada?.nombre : undefined
          });
          doctorId = respCombined.data?.doctor?.id ?? respCombined.data?.idDoctor ?? respCombined.data?.id ?? null;
          usuarioId = respCombined.data?.usuario?.id ?? respCombined.data?.idUsuario ?? null;
        } catch (err: any) {
          const status = err?.response?.status;
          if (status !== 404 && status !== 405) {
            throw err;
          }
        }

        // Si combinado falló o no devolvió ids, hacemos flujo en dos pasos
        if (!doctorId) {
          const respUser = await axios.post(`${USUARIOS_API_URL}/usuarios`, usuarioPayload);
          usuarioId = respUser.data?.id ?? respUser.data?.userId ?? respUser.data?.id_usuario ?? null;

          const respDoctor = await axios.post(`${USUARIOS_API_URL}/doctores`, {
            ...doctorPayloadBase,
            sueldo: Number(formData.salario),
            usuario: { id: usuarioId },
            idEspecialidad: esNuevaEspecialidad ? undefined : Number(selectedSpecialtyId)
          });
          doctorId = respDoctor.data?.id ?? respDoctor.data?.idDoctor ?? null;
        }

        // Asociar especialidad si es nueva o si el backend requiere endpoint separado
        if (doctorId) {
          try {
            if (esNuevaEspecialidad) {
              await axios.post(`${USUARIOS_API_URL}/doctores/${doctorId}/especialidades`, {
                nombre: especialidadSeleccionada?.nombre,
                doctorId
              });
            } else if (selectedSpecialtyId) {
              await axios.post(`${USUARIOS_API_URL}/doctores/${doctorId}/especialidades`, {
                idEspecialidad: Number(selectedSpecialtyId),
                doctorId
              });
            }
          } catch (err) {
            console.warn("No se pudo asociar especialidad al doctor", err);
          }
        }
        
        alert(`Dr. ${formData.apellido} registrado correctamente. La contraseña es auto generada y será enviada al correo del doctor.`);

        setFormData({ nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: '', salario: '' });
        setSelectedSpecialtyId('');
    } catch (error: any) {
        console.error("Error creando doctor:", error);
        const msg = error.response?.data?.message || "Error al registrar. Verifique correo duplicado.";
        alert(`Error del servidor: ${msg}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="perfil-container bg-light" style={{minHeight: '100vh'}}>
      <div className="container-fluid px-lg-5 py-4">
        
        <div className="dashboard-header d-flex justify-content-between align-items-center"
             style={{ background: 'linear-gradient(135deg, #dc3545 0%, #8a1c27 100%)' }}>
          <div className="d-flex align-items-center">
            <div className="avatar-container" onClick={handleAvatarClick}>
              <div 
                className="avatar-image" 
                style={{ backgroundImage: `url(${avatarPreview})` }}
              ></div>
              <div className="avatar-edit-icon text-danger"><i className="bi bi-camera-fill"></i></div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
            </div>
            <div><h2 className="fw-bold mb-0">Administración</h2><p className="mb-0 opacity-75">Hola, {adminName}</p></div>
          </div>
          <div className="d-flex gap-2">
            <button className={`btn ${activeTab === 'crear' ? 'btn-light text-danger' : 'btn-outline-light'}`} onClick={() => setActiveTab('crear')}>Gestión Médica</button>
            <button className={`btn ${activeTab === 'perfil' ? 'btn-light text-danger' : 'btn-outline-light'}`} onClick={() => setActiveTab('perfil')}>Mis Datos</button>
            <button className="btn btn-outline-light" onClick={() => navigate('/admin/doctores')}>Lista de Doctores</button>
            <button className="btn btn-outline-light" onClick={() => navigate('/admin/seguros')}>Seguros</button>
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
                                        <label>Nombre</label>
                                        <input
                                          id="nombre"
                                          className="form-control"
                                          value={formData.nombre}
                                          onChange={handleChangeForm}
                                          maxLength={60}
                                          placeholder="Solo letras y espacios"
                                          required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Apellido</label>
                                        <input
                                          id="apellido"
                                          className="form-control"
                                          value={formData.apellido}
                                          onChange={handleChangeForm}
                                          maxLength={60}
                                          placeholder="Solo letras y espacios"
                                          required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                      <label>Fecha de nacimiento</label>
                                      <input
                                        id="fechaNacimiento"
                                        type="date"
                                        className="form-control"
                                        value={formData.fechaNacimiento}
                                        onChange={handleChangeForm}
                                        required
                                      />
                                    </div>
                                    <div className="col-md-6">
                                      <label>Correo</label>
                                      <input
                                        id="correo"
                                        type="email"
                                        className="form-control"
                                        value={formData.correo}
                                        onChange={handleChangeForm}
                                        placeholder="doctor@clinica.com"
                                        required
                                      />
                                    </div>
                                    <div className="col-md-6">
                                      <label>Teléfono</label>
                                      <input
                                        id="telefono"
                                        className="form-control"
                                        value={formData.telefono}
                                        onChange={handleChangeForm}
                                        placeholder="+56912345678"
                                        required
                                      />
                                    </div>
                                    <div className="col-md-6">
                                      <label>Salario</label>
                                      <input
                                        id="salario"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="form-control"
                                        value={formData.salario}
                                        onChange={handleChangeForm}
                                        placeholder="Monto en pesos"
                                        required
                                      />
                                    </div>
                                </div>
                                <h6 className="text-muted mb-3">Especialidad (elige solo una)</h6>
                                <div className="row g-3 mb-4">
                                  <div className="col-12">
                                    {listaEspecialidades.length === 0 && (
                                      <p className="text-muted small mb-1">No hay especialidades disponibles.</p>
                                    )}
                                    <div className="d-flex gap-2 mb-3">
                                      <input
                                        className="form-control"
                                        placeholder="Nueva especialidad"
                                        value={nuevaEspecialidad}
                                        onChange={(e) => setNuevaEspecialidad(e.target.value)}
                                        maxLength={60}
                                      />
                                      <button
                                        className="btn btn-outline-danger"
                                        type="button"
                                        disabled={creandoEspecialidad}
                                        onClick={() => handleCrearEspecialidad()}
                                      >
                                        {creandoEspecialidad ? '...' : 'Agregar'}
                                      </button>
                                    </div>
                                    <div className="row row-cols-1 row-cols-md-2 g-2">
                                      {listaEspecialidades.map((esp) => (
                                        <div className="col" key={esp.id}>
                                          <div
                                            className={`especialidad-card ${selectedSpecialtyId === String(esp.id) ? 'selected' : ''}`}
                                            onClick={() => setSelectedSpecialtyId(String(esp.id))}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') setSelectedSpecialtyId(String(esp.id)); }}
                                          >
                                            <input
                                              className="form-check-input especialidad-radio"
                                              type="radio"
                                              name="especialidad"
                                              id={`esp-${esp.id}`}
                                              value={esp.id}
                                              checked={selectedSpecialtyId === String(esp.id)}
                                              onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                                            />
                                            <label className="form-check-label especialidad-label" htmlFor={`esp-${esp.id}`}>
                                              {esp.nombre}
                                            </label>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
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
                            onChange={handlePerfilChange}
                            onSubmit={handleSaveProfile}
                            showPasswordChange
                            password={nuevaPassword}
                            confirmPassword={confirmPassword}
                            onPasswordChange={(e) => {
                              const { id, value } = e.target;
                              if (id === 'contrasena') setNuevaPassword(value);
                              if (id === 'confirmarContrasena') setConfirmPassword(value);
                            }}
                            errors={perfilErrors}
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
