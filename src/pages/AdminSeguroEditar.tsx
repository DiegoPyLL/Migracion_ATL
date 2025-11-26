import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';

const AdminSeguroEditar: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${SEGUROS_API_URL}/${id}`);
        const seg = resp.data;
        setNombre(seg.nombreSeguro ?? seg.nombre_seguro ?? '');
        setDescripcion(seg.descripcion ?? '');
        setValor(seg.valor ?? '');
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el seguro.');
      } finally { setLoading(false); }
    };
    if (id) cargar();
  }, [id]);

  const validar = () => {
    if (nombre.trim().length < 3 || nombre.trim().length > 100) return 'El nombre debe tener entre 3 y 100 caracteres.';
    if (descripcion.length > 200) return 'La descripción no puede superar los 200 caracteres.';
    if (valor === '' || Number(valor) <= 0) return 'El valor debe ser un entero mayor que 0.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validar();
    if (err) { alert(err); return; }
    setSaving(true);
    try {
      await axios.put(`${SEGUROS_API_URL}/${id}`, {
        nombreSeguro: nombre.trim(),
        descripcion: descripcion.trim(),
        valor: Number(valor)
      });
      alert('Seguro actualizado.');
      navigate('/admin/seguros');
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el seguro.');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center mt-5">Cargando seguro...</div>;
  if (error) return (
    <div className="container py-4">
      <div className="alert alert-danger">{error}</div>
      <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/seguros')}>Volver</button>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-danger mb-0">Editar Seguro</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/seguros')}>Volver</button>
      </div>

      <form className="card shadow-sm border-0 p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del seguro</label>
          <input
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={200}
            rows={3}
          ></textarea>
          <small className="text-muted">Máx. 200 caracteres (opcional).</small>
        </div>
        <div className="mb-3">
          <label className="form-label">Valor</label>
          <input
            type="number"
            min={1}
            className="form-control"
            value={valor}
            onChange={(e) => setValor(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/seguros')}>Cancelar</button>
          <button type="submit" className="btn btn-danger" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminSeguroEditar;
