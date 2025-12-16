import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloPerfil.css';

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
  contrasena?: string;
}

// Interfaz auxiliar para Doctores
export interface DoctorMap {
  id: number;
  usuario: { nombre: string; apellido: string };
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
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/;
  const correoRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  const telefonoRegex = /^569\d{8}$/; // solo dígitos, validamos + aparte
  
  // Lista de doctores global para usar en Citas e Historial
  const [listaDoctores, setListaDoctores] = useState<DoctorMap[]>([]);

  // --- URLS ---
  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';
  const DOCTORES_API_URL = 'http://localhost:8082/api/v1/doctores';
  const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';
  const CONTRATOS_SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros/contratos';
  const CITAS_API_URL = 'http://localhost:8080/api/v1/citas';
  const HISTORIAL_API_URL =
    import.meta.env.VITE_HISTORIAL_API_URL ||
    'http://localhost:8081/api/v1/historial';

  // --- 1. CARGAR DATOS (OPTIMIZADO CON PROMISE.ALL) ---
  useEffect(() => {
    const cargarDatos = async () => {
      // 1. Verificar sesion
      const usuarioSesion = localStorage.getItem('usuario');
      if (!usuarioSesion) {
        navigate('/login');
        return;
      }

      const usuarioObj = JSON.parse(usuarioSesion);
      const userId = usuarioObj.userId || usuarioObj.id;

      setLoading(true);

      try {
        // PASO A: Disparar todas las peticiones en paralelo
        const reqDoctores = axios.get(DOCTORES_API_URL).catch(() => ({ data: [] }));
        const reqUsuario = axios.get(`${USUARIOS_API_URL}/${userId}`);
        const reqSegurosContratos = axios.get(`${CONTRATOS_SEGUROS_API_URL}/usuario/${userId}`).catch(() => ({ data: [] }));
        const reqCatalogoSeguros = axios.get(SEGUROS_API_URL).catch(() => ({ data: [] }));
        const reqHistorial = axios.get(`${HISTORIAL_API_URL}/usuario/${userId}`).catch(() => ({ data: [] }));
        const reqCitas = axios.get(`${CITAS_API_URL}/usuario/${userId}`).catch(() => ({ data: [] }));

        // PASO B: Esperar a que todas terminen
        const [respDoctores, respUsuario, respSegurosContratos, respCatalogo, respHistorial, respCitas] = await Promise.all([
            reqDoctores,
            reqUsuario,
            reqSegurosContratos,
            reqCatalogoSeguros,
            reqHistorial,
            reqCitas
        ]);

        // PASO C: Procesar la informacion recibida
        const doctoresReales: DoctorMap[] = respDoctores.data;
        setListaDoctores(doctoresReales);

        const u = respUsuario.data;
        const datosCargados = {
          id: u.id,
          nombre: u.nombre || '',
          apellido: u.apellido || '',
          correo: u.correo || '',
          telefono: u.telefono || '',
          fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : '',
        };
        setPerfilData(datosCargados);
        setOriginalData(datosCargados);

        const catalogo: any[] = respCatalogo.data || [];
        const contratosRaw: any[] = respSegurosContratos.data || [];
        const segurosMap = new Map<number, any>();
        catalogo.forEach((s: any) => {
          const id = s.id_seguro ?? s.id;
          if (id !== undefined) segurosMap.set(Number(id), s);
        });

        const parseList = (s?: string) => (s ? s.split(';').map((t: string) => t.trim()).filter(Boolean) : []);

        const segurosParseados: Seguro[] = contratosRaw.map((c) => {
          const idContrato = c.id_contrato ?? c.id;
          const idSeguro = c.id_seguro ?? c.idSeguro;
          const seguroInfo = idSeguro ? segurosMap.get(Number(idSeguro)) : null;
          const beneficiarios = parseList(c.nombre_beneficiarios ?? c.nombreBeneficiarios);
          const ruts = parseList(c.rut_beneficiarios ?? c.rutBeneficiarios);
          const nombreSeguro =
            seguroInfo?.nombre_seguro ||
            seguroInfo?.nombreSeguro ||
            c.nombre_seguro ||
            c.nombreSeguro ||
            (idSeguro ? `Seguro ${idSeguro}` : 'Seguro');
          return {
            id: idContrato ?? 0,
            idSeguro: idSeguro ? Number(idSeguro) : undefined,
            nombreSeguro,
            descripcion: seguroInfo?.descripcion || 'Contrato de seguro',
            estado: c.estado || 'ACTIVO',
            fechaCreacion: c.fecha_contratacion || c.fechaContratacion || '',
            beneficiarios,
            ruts,
            metodoPago: c.metodo_pago ?? c.metodoPago,
            telefonoContacto: c.telefono_contacto ?? c.telefonoContacto,
            correoContacto: c.correo_contacto ?? c.correoContacto
          };
        });
        setListaSeguros(segurosParseados);

        setListaFichas(respHistorial.data);

        const citasRaw = respCitas.data;
        if (citasRaw.length > 0) {
            const citasCompletas = citasRaw.map((cita: any) => {
                const doctorIdEnCita = cita.idDoctor || (cita.doctor ? cita.doctor.id : null);
                const doctorReal = doctoresReales.find(d => d.id === doctorIdEnCita);

                return {
                    id: cita.id,
                    fechaCita: cita.fechaCita,
                    horaInicio: cita.horaInicio,
                    estado: cita.estado,
                    doctor: {
                        id: doctorIdEnCita,
                        usuario: {
                            nombre: doctorReal ? doctorReal.usuario.nombre : "Doctor",
                            apellido: doctorReal ? doctorReal.usuario.apellido : "No encontrado"
                        }
                    }
                };
            });
            setListaCitas(citasCompletas);
        } else {
            setListaCitas([]);
        }

      } catch (error) {
        console.error("Error critico cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  // --- ACCIONES ---
  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/login'); };

  const handleCancelSeguro = async (idContrato: number) => {
    if (!confirm("Cancelar seguro?")) return;
    try {
      const payload = { motivo: "Web", estado: "CANCELADO" };
      const intentos = [
        { metodo: "post", url: `${CONTRATOS_SEGUROS_API_URL}/${idContrato}/cancelar`, data: payload, label: "POST cancelar" },
        { metodo: "put", url: `${CONTRATOS_SEGUROS_API_URL}/${idContrato}/cancelar`, data: payload, label: "PUT cancelar" },
        { metodo: "delete", url: `${CONTRATOS_SEGUROS_API_URL}/${idContrato}`, data: undefined, label: "DELETE contrato" },
      ];

      let ultimaRespuesta: any = null;
      let ultimoError: any = null;

      for (const intento of intentos) {
        try {
          const resp = await axios({
            method: intento.metodo as any,
            url: intento.url,
            data: intento.data,
          });
          ultimaRespuesta = resp;
          break;
        } catch (err: any) {
          ultimoError = err;
          console.warn(`Falló ${intento.label}`, err?.response?.status, err?.response?.data || err);
          // Si es 401/403 mejor no seguir intentando
          if (err?.response?.status === 401 || err?.response?.status === 403) break;
        }
      }

      if (!ultimaRespuesta) throw ultimoError;

      const estadoApi = (ultimaRespuesta?.data as any)?.estado;
      setListaSeguros(prev => prev.map(s => s.id === idContrato ? { ...s, estado: estadoApi || "CANCELADO" } : s));
      alert("Seguro cancelado.");
    } catch (error: any) {
      console.error("Error cancelando seguro:", error?.response?.data || error);
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Error al cancelar seguro.";
      alert(msg);
    }
  };

  const handleCancelCita = async (idCita: number) => {
    if (!confirm("Cancelar cita?")) return;
    try {
        await axios.delete(`${CITAS_API_URL}/${idCita}`);
        setListaCitas(prev => prev.filter(c => c.id !== idCita));
        alert("Cita cancelada.");
    } catch (error) { alert("Error al cancelar cita."); }
  };

  const validarNombreApellidoLive = (valor: string, campo: "nombre" | "apellido") => {
    const limpio = valor.trim();
    if (!limpio) return `El ${campo} es obligatorio.`;
    if (limpio.length > 40) return `El ${campo} admite hasta 40 caracteres.`;
    if (!nombreApellidoRegex.test(limpio)) return `El ${campo} solo puede tener letras y espacios.`;
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prev => ({ ...prev, [id]: value }));

    const errorMsg = validateField(id, value);
    setFormErrors(prev => {
      const updated = { ...prev };
      if (errorMsg) updated[id] = errorMsg; else delete updated[id];
      return updated;
    });
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

  const handleRestore = () => {
    if (originalData) { setPerfilData(originalData); alert("Datos restaurados."); }
    setNuevaPassword('');
    setConfirmPassword('');
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!perfilData.id) return;

    const nombre = perfilData.nombre.trim();
    const apellido = perfilData.apellido.trim();
    const correo = perfilData.correo.trim();
    const telefono = perfilData.telefono.trim();
    const telefonoDigitos = telefono.replace(/\D/g, '');
    const fechaNac = perfilData.fechaNacimiento;

    const errors: Record<string, string> = {};
    ([
      ['nombre', nombre],
      ['apellido', apellido],
      ['correo', correo],
      ['telefono', telefono],
      ['fechaNacimiento', fechaNac],
    ] as const).forEach(([campo, valor]) => {
      const msg = validateField(campo, valor);
      if (msg) errors[campo] = msg;
    });

    if (nuevaPassword || confirmPassword) {
      if (nuevaPassword.length < 8) errors.contrasena = "La contrasena debe tener al menos 8 caracteres.";
      if (nuevaPassword !== confirmPassword) errors.confirmarContrasena = "Las contrasenas no coinciden.";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const { rol, ...rest } = perfilData;
      const telefonoNormalizado = telefonoDigitos.startsWith('569') && telefonoDigitos.length === 11
        ? `+${telefonoDigitos}`
        : telefono;
      const perfilNormalizado = { ...rest, nombre, apellido, correo, telefono: telefonoNormalizado };
      const payload: any = { ...perfilNormalizado, fechaNacimiento: `${perfilData.fechaNacimiento}T00:00:00` };
      if (nuevaPassword) payload.contrasena = nuevaPassword;
      await axios.put(`${USUARIOS_API_URL}/${perfilData.id}`, payload);
      alert('Perfil actualizado.');
      setIsEditing(false);
      setPerfilData(perfilNormalizado);
      setOriginalData(perfilNormalizado);
      const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
      sesion.nombre = nombre; sesion.apellido = apellido;
      localStorage.setItem('usuario', JSON.stringify(sesion));
      setNuevaPassword('');
      setConfirmPassword('');
      setFormErrors({});
    } catch (error: any) {
      console.error("Error guardando perfil:", error);
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Error al guardar.";
      alert(msg);
    }
  };

  if (loading) return <div className="text-center mt-5 p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="perfil-container bg-light" style={{minHeight: '100vh'}}>
      <div className="container-fluid px-lg-5 py-5">
        
        <h2 className="mb-4 fw-bold text-primary"><i className="bi bi-person-circle me-2"></i>Mi Portal Paciente</h2>

        <div className="row g-4 mb-5 align-items-stretch">
            <div className="col-lg-5 col-xl-4 mb-4 mb-lg-0 d-flex align-items-center justify-content-center">
                <div className="perfil-carousel-container-wrapper">
                    <div className="perfil-carousel-circle">
                        <PerfilCarousel />
                    </div>
                </div>
            </div>
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
                          showPasswordChange
                          password={nuevaPassword}
                          confirmPassword={confirmPassword}
                          onPasswordChange={(e) => {
                            const { id, value } = e.target;
                            if (id === 'contrasena') setNuevaPassword(value);
                            if (id === 'confirmarContrasena') setConfirmPassword(value);
                          }}
                          errors={formErrors}
                        />
                    </div>
                </div>
            </div>
        </div>

        <h4 className="mb-4 fw-bold text-secondary"><i className="bi bi-activity me-2"></i>Resumen de Actividad</h4>
        <div className="row g-4">
          
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

          <div className="col-md-6 col-xl-4">
             <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h5 className="text-info fw-bold mb-0"><i className="bi bi-file-medical me-2"></i>Historial</h5>
                </div>
                <div className="card-body p-4">
                    <MisFichas fichas={listaFichas} doctores={listaDoctores} />
                </div>
             </div>
          </div>

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
