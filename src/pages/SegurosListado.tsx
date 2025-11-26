import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const SegurosListado = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSeguros = async () => {
      try {
        const resp = await axios.get(SEGUROS_API_URL);
        setSeguros(resp.data || []);
      } catch (e) {
        setError('No se pudieron cargar los seguros. Inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchSeguros();
  }, []);

  const segurosSalud = useMemo(
    () => seguros.filter((s) => s.nombre_seguro?.toLowerCase().includes('salud')),
    [seguros]
  );
  const segurosVida = useMemo(
    () => seguros.filter((s) => s.nombre_seguro?.toLowerCase().includes('vida')),
    [seguros]
  );
  const otrosSeguros = useMemo(
    () =>
      seguros.filter(
        (s) =>
          !s.nombre_seguro?.toLowerCase().includes('vida') &&
          !s.nombre_seguro?.toLowerCase().includes('salud')
      ),
    [seguros]
  );

  const formatPrecio = (valor?: number) =>
    valor !== undefined ? `$${valor.toLocaleString('es-CL')}` : '$ -';

  const slug = (txt?: string) => (txt || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  const getImagenSeguro = (seg: Seguro) => {
    const id = Number(seg.id_seguro ?? seg.id ?? 0);
    const pool = ['/images/seguro_1.png', '/images/seguro_2.png', '/images/seguro_3.png'];
    return pool[id % pool.length];
  };

  const renderBloque = (titulo: string, items: Seguro[]) => {
    if (items.length === 0) return null;
    return (
      <section className="mb-4">
        <div className="d-flex align-items-center mb-2">
          <span className="seguro-tag me-2">{titulo}</span>
          <span className="text-muted small">{items.length} opciones</span>
        </div>
        <div className="seguros-grid">
          {items.map((seguro) => {
            const idSeguro = seguro.id_seguro ?? seguro.id;
            const nombre = seguro.nombre_seguro || seguro.nombreSeguro || 'Seguro';
            const cardId = `seguro-${slug(nombre)}`;
            return (
              <div key={idSeguro} className="seguro-card" id={cardId}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1 fw-bold">{nombre}</h5>
                    <p className="text-muted small mb-2">{seguro.descripcion}</p>
                  </div>
                  <span className="seguro-price">{formatPrecio(seguro.valor)}</span>
                </div>
                <div className="my-2">
                  <img
                    src={getImagenSeguro(seguro)}
                    alt={nombre}
                    style={{ width: '100%', borderRadius: 10, maxHeight: 160, objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                <button
                  className="btn btn-info text-white w-100"
                  onClick={() => navigate(`/seguros/${idSeguro}/contratar`)}
                >
                  Contratar
                </button>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  if (loading) return <div className="text-center mt-5">Cargando seguros...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container py-4">
      <div className="seguros-hero">
        <h2 className="fw-bold mb-2">Nuestros Seguros</h2>
        <p className="mb-0">Elige tu plan y contrátalo en pocos pasos.</p>
      </div>

      {renderBloque('Salud', segurosSalud)}
      {renderBloque('Vida', segurosVida)}
      {renderBloque('Otros', otrosSeguros)}
    </div>
  );
};

export default SegurosListado;
