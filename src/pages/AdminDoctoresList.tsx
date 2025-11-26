import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloAdmin.css';

interface DoctorListItem {
  id: number;
  idUsuario?: number;
  nombre: string;
  apellido: string;
  correo?: string;
  telefono?: string;
  especialidad?: string;
  activo?: boolean;
}

const USUARIOS_API_URL = 'http://localhost:8082/api/v1';

const AdminDoctoresList = () => {
  const navigate = useNavigate();
  const [doctores, setDoctores] = useState<DoctorListItem[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${USUARIOS_API_URL}/doctores`);
        const data = resp.data || [];
        const items: DoctorListItem[] = data.map((d: any) => ({
          id: d.id ?? d.idDoctor ?? d.doctorId,
          idUsuario: d.usuario?.id ?? d.id_usuario ?? d.idUsuario,
          nombre: d.usuario?.nombre ?? d.nombre ?? '',
          apellido: d.usuario?.apellido ?? d.apellido ?? '',
          correo: d.usuario?.correo ?? d.correo,
          telefono: d.usuario?.telefono ?? d.telefono,
          especialidad: d.especialidad ?? d.especialidadPrincipal ?? d.nombreEspecialidad,
          activo: d.activo ?? true,
        }));
        setDoctores(items);
        setError('');
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los doctores.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const filtrados = useMemo(() => {
    const term = busqueda.toLowerCase().trim();
    if (!term) return doctores;
    return doctores.filter((d) => {
      const full = `${d.nombre} ${d.apellido}`.toLowerCase();
      return (
        full.includes(term) ||
        (d.correo || '').toLowerCase().includes(term) ||
        String(d.id).includes(term) ||
        (d.idUsuario ? String(d.idUsuario).includes(term) : false)
      );
    });
  }, [busqueda, doctores]);

  if (loading) return <div className="text-center mt-5">Cargando doctores...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold text-danger mb-0">Lista de Doctores</h2>
          <p className="text-muted mb-0">Busca y administra doctores.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/admin-dashboard')}>Volver</button>
      </div>

      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              className="form-control"
              placeholder="Buscar (Nombre, Apellido, Email, ID)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
        </div>
      </div>

      <div className="row g-3">
        {filtrados.map((doc) => (
          <div className="col-12 col-md-6 col-xl-4" key={doc.id}>
            <div
              className="card shadow-sm border-0 h-100 seguro-card"
              role="button"
              onClick={() => navigate(`/admin/doctores/${doc.id}`)}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold mb-0">{doc.nombre} {doc.apellido}</h5>
                  <span className={`badge ${doc.activo ? 'bg-success' : 'bg-secondary'}`}>
                    {doc.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="text-muted mb-1">{doc.correo || 'Sin correo'}</p>
                <p className="mb-0"><i className="bi bi-briefcase me-1"></i>{doc.especialidad || 'Sin especialidad'}</p>
                <small className="text-muted">ID Doc: {doc.id} {doc.idUsuario ? ` • ID Usuario: ${doc.idUsuario}` : ''}</small>
              </div>
            </div>
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="col-12">
            <div className="alert alert-warning text-center mb-0">No se encontraron doctores con ese criterio.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDoctoresList;
