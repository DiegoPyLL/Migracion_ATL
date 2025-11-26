import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloAdmin.css';

interface DoctorDetail {
  id: number;
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  tarifaConsulta: number;
  sueldo: number;
  bono: number;
  activo: boolean;
  idEspecialidad?: number;
}

interface Especialidad {
  id: number | string;
  nombre: string;
}

const USUARIOS_API_URL = 'http://localhost:8082/api/v1';

const AdminDoctorDetail = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<DoctorDetail | null>(null);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const validar = (d: DoctorDetail) => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{1,60}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{8,}$/;
    if (!nameRegex.test(d.nombre.trim())) return 'Nombre inválido.';
    if (!nameRegex.test(d.apellido.trim())) return 'Apellido inválido.';
    if (!emailRegex.test(d.correo.trim())) return 'Correo inválido.';
    if (!phoneRegex.test(d.telefono.trim())) return 'Teléfono inválido.';
    if (!d.fechaNacimiento) return 'Fecha de nacimiento requerida.';
    if (d.tarifaConsulta < 0 || d.sueldo < 0 || d.bono < 0) return 'Valores numéricos deben ser positivos.';
    return null;
  };

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const [respDoc, respEsp] = await Promise.all([
          axios.get(`${USUARIOS_API_URL}/doctores/${doctorId}`),
          axios.get(`${USUARIOS_API_URL}/especialidades`)
        ]);
        const doc = respDoc.data;
        const especialidadesRaw = respEsp.data || [];
        const espList: Especialidad[] = especialidadesRaw.map((e: any) => ({
          id: e.id ?? e.idEspecialidad ?? e.codigo ?? e.nombre,
          nombre: e.nombre
        }));

        // Detectar especialidad actual del doctor aunque no venga en el catálogo
        const espActual =
          doc.especialidad ||
          (Array.isArray(doc.especialidades) && doc.especialidades.length > 0 ? doc.especialidades[0] : null) ||
          doc.especialidadPrincipal;
        if (espActual) {
          const espId = espActual.id ?? espActual.idEspecialidad ?? espActual.codigo ?? espActual.nombre;
          const espNombre = espActual.nombre;
          if (espId !== undefined && espNombre) {
            const existe = espList.some((e) => String(e.id) === String(espId));
            if (!existe) espList.push({ id: espId, nombre: espNombre });
          }
        }

        setEspecialidades(espList);
        const detalle: DoctorDetail = {
          id: doc.id ?? doc.idDoctor ?? Number(doctorId),
          idUsuario: doc.usuario?.id ?? doc.id_usuario ?? doc.idUsuario,
          nombre: doc.usuario?.nombre ?? doc.nombre ?? '',
          apellido: doc.usuario?.apellido ?? doc.apellido ?? '',
          correo: doc.usuario?.correo ?? doc.correo ?? '',
          telefono: doc.usuario?.telefono ?? doc.telefono ?? '',
          fechaNacimiento: doc.usuario?.fechaNacimiento
            ? doc.usuario.fechaNacimiento.split('T')[0]
            : doc.fechaNacimiento
              ? doc.fechaNacimiento.split('T')[0]
              : '',
          tarifaConsulta: doc.tarifaConsulta ?? doc.tarifa_consulta ?? 0,
          sueldo: doc.sueldo ?? 0,
          bono: doc.bono ?? 0,
          activo: doc.activo ?? true,
          idEspecialidad:
            (espActual && Number(espActual.id ?? espActual.idEspecialidad ?? espActual.codigo)) ??
            doc.idEspecialidad ??
            undefined
        };
        setData(detalle);
        setError('');
      } catch (err: any) {
        console.error(err);
        const status = err?.response?.status;
        if (status === 404) setError('Doctor no encontrado.');
        else setError('Error al cargar información del doctor.');
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) cargar();
  }, [doctorId]);

  const nombreEspecialidadActual = useMemo(() => {
    if (!data || !especialidades.length || data.idEspecialidad === undefined) return '';
    const esp = especialidades.find((e) => String(e.id) === String(data.idEspecialidad));
    return esp?.nombre || '';
  }, [data, especialidades]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!data) return;
    const { id, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setData({ ...data, [id]: type === 'number' ? Number(val) : val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    const err = validar(data);
    if (err) { alert(err); return; }
    setSaving(true);
    try {
      // Intento actualizar con /doctores/{id}
      await axios.put(`${USUARIOS_API_URL}/doctores/${data.id}`, {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono,
        fechaNacimiento: `${data.fechaNacimiento}T00:00:00`,
        tarifaConsulta: data.tarifaConsulta,
        sueldo: data.sueldo,
        bono: data.bono,
        activo: data.activo,
        idEspecialidad: data.idEspecialidad
      });
      alert('Doctor actualizado.');
      navigate('/admin/doctores');
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar el doctor.');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center mt-5">Cargando doctor...</div>;
  if (error) return (
    <div className="container py-4">
      <div className="alert alert-danger">{error}</div>
      <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/doctores')}>Volver</button>
    </div>
  );
  if (!data) return null;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold text-danger mb-0">Editar Doctor</h2>
          <small className="text-muted">ID Doctor: {data.id} • ID Usuario: {data.idUsuario}</small>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/doctores')}>Volver</button>
      </div>

      <form className="card shadow-sm border-0 p-4" onSubmit={handleSubmit}>
        <h5 className="text-muted mb-3">Datos de Usuario</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-6 col-12">
            <label className="form-label">Nombre</label>
            <input id="nombre" className="form-control" value={data.nombre} onChange={handleChange} maxLength={60} required />
          </div>
          <div className="col-md-6 col-12">
            <label className="form-label">Apellido</label>
            <input id="apellido" className="form-control" value={data.apellido} onChange={handleChange} maxLength={60} required />
          </div>
          <div className="col-md-6 col-12">
            <label className="form-label">Fecha nacimiento</label>
            <input id="fechaNacimiento" type="date" className="form-control" value={data.fechaNacimiento} onChange={handleChange} required />
          </div>
          <div className="col-md-6 col-12">
            <label className="form-label">Correo</label>
            <input id="correo" type="email" className="form-control" value={data.correo} onChange={handleChange} required />
          </div>
          <div className="col-md-6 col-12">
            <label className="form-label">Teléfono</label>
            <input id="telefono" className="form-control" value={data.telefono} onChange={handleChange} required />
          </div>
        </div>

        <h5 className="text-muted mb-3">Datos Profesionales</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-4 col-12">
            <label className="form-label">Tarifa Consulta</label>
            <input id="tarifaConsulta" type="number" min="0" className="form-control" value={data.tarifaConsulta} onChange={handleChange} required />
          </div>
          <div className="col-md-4 col-12">
            <label className="form-label">Sueldo</label>
            <input id="sueldo" type="number" min="0" className="form-control" value={data.sueldo} onChange={handleChange} required />
          </div>
          <div className="col-md-4 col-12">
            <label className="form-label">Bono</label>
            <input id="bono" type="number" min="0" className="form-control" value={data.bono} onChange={handleChange} />
          </div>
          <div className="col-md-6 col-12">
            <label className="form-label">Especialidad {nombreEspecialidadActual ? `(actual: ${nombreEspecialidadActual})` : ''}</label>
            <select
              id="idEspecialidad"
              className="form-select"
              value={data.idEspecialidad !== undefined ? String(data.idEspecialidad) : ''}
              onChange={(e) => setData({ ...data, idEspecialidad: e.target.value ? Number(e.target.value) : undefined })}
              required
            >
              <option value="" disabled>Seleccione...</option>
              {especialidades.map((esp) => (
                <option key={esp.id} value={String(esp.id)}>{esp.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-12 d-flex align-items-center mt-4">
            <div className="form-check form-switch">
              <input
                id="activo"
                className="form-check-input"
                type="checkbox"
                checked={data.activo}
                onChange={(e) => setData({ ...data, activo: e.target.checked })}
              />
              <label className="form-check-label ms-2" htmlFor="activo">Activo</label>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/doctores')}>Cancelar</button>
          <button type="submit" className="btn btn-danger" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminDoctorDetail;
