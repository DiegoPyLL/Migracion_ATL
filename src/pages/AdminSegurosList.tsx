import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/segurosNuevo.css';

interface Seguro {
  id_seguro?: number;
  id?: number;
  nombre_seguro?: string;
  nombreSeguro?: string;
  descripcion?: string;
  valor?: number;
}

const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';
const poolLocal = ["/images/seguro_1.png", "/images/seguro_2.png", "/images/seguro_3.png"];

const imgSeguro = (seguro: Seguro) => {
  const id = Number(seguro.id_seguro ?? seguro.id ?? 0);
  // Mapeo determinístico a pool local para mantener consistencia entre vistas
  return poolLocal[id % poolLocal.length];
};

const AdminSegurosList: React.FC = () => {
  const navigate = useNavigate();
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(SEGUROS_API_URL);
        setSeguros(resp.data || []);
        setError('');
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los seguros.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) return <div className="text-center mt-5">Cargando seguros...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold text-danger mb-0">Seguros</h2>
          <p className="text-muted mb-0">Administra el catálogo de seguros.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/admin-dashboard')}>Volver</button>
          <Link className="btn btn-danger" to="/admin/seguros/nuevo">Añadir Seguro</Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="seguros-grid">
        {seguros.map((seg) => {
          const id = seg.id_seguro ?? seg.id;
          const nombre = seg.nombre_seguro ?? seg.nombreSeguro ?? 'Seguro';
          return (
            <div key={id} className="seguro-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold mb-1">{nombre}</h5>
                  <p className="text-muted small mb-2">{seg.descripcion}</p>
                </div>
                <span className="seguro-price">${seg.valor?.toLocaleString('es-CL')}</span>
              </div>
              <div className="my-2">
                <img
                  src={imgSeguro(seg)}
                  alt={nombre}
                  style={{ width: '100%', borderRadius: 10, maxHeight: 160, objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">ID: {id}</small>
                <Link className="btn btn-outline-primary btn-sm" to={`/admin/seguros/${id}/editar`}>Editar</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSegurosList;
