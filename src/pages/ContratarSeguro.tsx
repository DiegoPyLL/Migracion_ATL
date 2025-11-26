import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/segurosNuevo.css';

interface Seguro {
  id_seguro?: number;
  id?: number;
  nombre_seguro: string;
  descripcion: string;
  valor: number;
}

interface Beneficiario {
  nombre: string;
  apellido: string;
  rut: string;
  fechaNacimiento: string; // usamos input date y luego formateamos dd-mm-yyyy al enviar
}

interface UsuarioSesion {
  id?: number;
  userId?: number;
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
}

const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';
const CONTRATOS_API_URL = 'http://localhost:8084/api/v1/seguros/contratos';

const ContratarSeguro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seguro, setSeguro] = useState<Seguro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [contacto, setContacto] = useState({ correo: '', telefono: '' });
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([
    { nombre: '', apellido: '', rut: '', fechaNacimiento: '' }
  ]);
  const [metodoPago, setMetodoPago] = useState('');

  const usuarioSesion: UsuarioSesion | null = useMemo(() => {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }, []);

  const userId = usuarioSesion?.id || usuarioSesion?.userId;

  const nombreSeguro = useMemo(() => {
    const raw = seguro?.nombre_seguro ?? (seguro as any)?.nombreSeguro ?? '';
    return raw || '';
  }, [seguro]);

  // Permite multiples beneficiarios para planes especificos
  const permiteMultiplesBeneficiarios = useMemo(() => {
    if (!nombreSeguro) return false;
    const n = nombreSeguro.toLowerCase();
    return (
      n.includes('familiar') ||
      n.includes('avanzado') ||
      n.includes('premium') ||
      n.includes('empresarial')
    );
  }, [nombreSeguro]);

  useEffect(() => {
    const cargar = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }
      try {
        const resp = await axios.get(`${SEGUROS_API_URL}/${id}`);
        setSeguro(resp.data);
      } catch (e) {
        setError('No se pudo cargar el seguro.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id, navigate, userId]);

  useEffect(() => {
    // Prellenamos contacto con el usuario logueado (titular)
    if (usuarioSesion) {
      setContacto({
        correo: usuarioSesion.correo || '',
        telefono: usuarioSesion.telefono || ''
      });

      // Para seguros sin beneficiarios multiples, precargamos con el titular
      setBeneficiarios((prev) => {
        if (!prev || prev.length === 0) return prev;
        const base: Beneficiario = {
          nombre: usuarioSesion.nombre || '',
          apellido: usuarioSesion.apellido || '',
          rut: prev[0].rut,
          fechaNacimiento: prev[0].fechaNacimiento
        };
        return permiteMultiplesBeneficiarios ? prev : [base];
      });
    }
  }, [usuarioSesion, permiteMultiplesBeneficiarios]);

  const handleBenefChange = (index: number, field: keyof Beneficiario, value: string) => {
    setBeneficiarios((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  };

  const addBeneficiario = () => {
    if (!permiteMultiplesBeneficiarios) return;
    if (beneficiarios.length >= 5) return;
    setBeneficiarios((prev) => [...prev, { nombre: '', apellido: '', rut: '', fechaNacimiento: '' }]);
  };

  const removeBeneficiario = (index: number) => {
    if (!permiteMultiplesBeneficiarios) return;
    if (beneficiarios.length <= 1) return;
    setBeneficiarios((prev) => prev.filter((_, i) => i !== index));
  };

  const validar = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{8,}$/;
    const nameRegex = /^[A-Za-z�?�%�?�"�sǭǸ����ǧ�'���oǬ\s]{1,60}$/;
    const rutRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/;

    if (!emailRegex.test(contacto.correo.trim())) return 'Correo de contacto invalido.';
    if (!phoneRegex.test(contacto.telefono.trim())) return 'Telefono: solo digitos y + opcional, minimo 8.';
    if (!metodoPago) return 'Seleccione un metodo de pago.';

    const list = beneficiarios;
    if (list.length === 0) return 'Debe agregar al menos un beneficiario.';

    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (!nameRegex.test(b.nombre.trim())) return `Nombre del beneficiario ${i + 1} invalido.`;
      if (!nameRegex.test(b.apellido.trim())) return `Apellido del beneficiario ${i + 1} invalido.`;
      if (!rutRegex.test(b.rut.trim())) return `RUT del beneficiario ${i + 1} invalido (ej: 11.111.111-1).`;
      if (!b.fechaNacimiento) return `Fecha de nacimiento del beneficiario ${i + 1} obligatoria.`;
    }
    return null;
  };

  const toDDMMYYYY = (isoDate: string) => {
    if (!isoDate.includes('-')) return isoDate;
    const [y, m, d] = isoDate.split('-');
    return `${d}-${m}-${y}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validar();
    if (validationError) {
      alert(validationError);
      return;
    }
    if (!seguro || !userId) {
      alert('No hay datos de seguro o usuario.');
      return;
    }

    const idSeguro = Number(seguro.id_seguro ?? seguro.id);
    const titularId = Number(userId);
    const nombres = beneficiarios.map((b) => `${b.nombre.trim()} ${b.apellido.trim()}`.trim()).join('; ');
    const ruts = beneficiarios.map((b) => b.rut.trim()).join('; ');
    const fechas = beneficiarios.map((b) => toDDMMYYYY(b.fechaNacimiento.trim())).join('; ');

    const hoyIso = new Date().toISOString().split('T')[0];
    const payload = {
      idSeguro: idSeguro,
      idUsuario: titularId,
      nombreBeneficiarios: nombres,
      rutBeneficiarios: ruts,
      fechaNacimientoBeneficiarios: fechas,
      correoContacto: contacto.correo.trim(),
      telefonoContacto: contacto.telefono.trim(),
      metodoPago: metodoPago,
      fechaContratacion: `${hoyIso}T00:00:00`,
      estado: 'ACTIVO'
    };

    try {
      console.log('Payload contrato seguro', payload);
      await axios.post(CONTRATOS_API_URL, payload);
      alert('Seguro contratado correctamente.');
      navigate('/perfil');
    } catch (err) {
      console.error(err);
      const serverMsg = (err as any)?.response?.data?.message || (err as any)?.response?.data || '';
      alert(`No se pudo contratar el seguro. ${serverMsg || 'Intente de nuevo mas tarde.'}`);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando seguro...</div>;
  if (error || !seguro) return <div className="alert alert-danger mt-4 text-center">{error || 'Seguro no encontrado'}</div>;

  return (
    <div className="container py-4">
      <div className="seguros-hero">
        <h3 className="fw-bold mb-1">{nombreSeguro || 'Seguro'}</h3>
        <p className="mb-1">{seguro.descripcion}</p>
        <span className="seguro-price">Valor: ${seguro.valor?.toLocaleString('es-CL')}</span>
      </div>

      <form className="bg-white p-3 p-md-4 rounded shadow-sm" onSubmit={handleSubmit}>
        <section className="mb-3">
          <h5 className="fw-bold">Datos de contacto titular</h5>
          <p className="text-muted small mb-2">Se prellenan con tu sesion. El titular siempre es el usuario logueado.</p>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Correo de contacto</label>
              <input
                className="form-control"
                value={contacto.correo}
                onChange={(e) => setContacto({ ...contacto, correo: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Telefono de contacto</label>
              <input
                className="form-control"
                value={contacto.telefono}
                onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })}
                required
              />
            </div>
          </div>
        </section>

        <section className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h5 className="fw-bold mb-0">Beneficiarios</h5>
              <small className="text-muted">
                {permiteMultiplesBeneficiarios
                  ? 'Puedes agregar beneficiarios (hasta 5).'
                  : 'Seguros individuales: beneficiario unico (puede ser el titular).'}
              </small>
            </div>
            {permiteMultiplesBeneficiarios && (
              <button
                type="button"
                className="btn btn-outline-info btn-sm d-flex align-items-center"
                onClick={addBeneficiario}
                disabled={beneficiarios.length >= 5}
                title="Agregar beneficiario"
              >
                <span className="fw-bold me-1">+</span> Beneficiario
              </button>
            )}
          </div>

          <div className="beneficiarios-grid">
            {beneficiarios.map((b, idx) => (
              <div key={idx} className="beneficiario-card">
                <div className="beneficiario-header">
                  <span className="pill">Beneficiario {idx + 1}</span>
                  {permiteMultiplesBeneficiarios && beneficiarios.length > 1 && (
                    <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeBeneficiario(idx)}>
                      Eliminar
                    </button>
                  )}
                </div>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label small">Nombre</label>
                    <input
                      className="form-control"
                      value={b.nombre}
                      onChange={(e) => handleBenefChange(idx, 'nombre', e.target.value)}
                      maxLength={60}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Apellido</label>
                    <input
                      className="form-control"
                      value={b.apellido}
                      onChange={(e) => handleBenefChange(idx, 'apellido', e.target.value)}
                      maxLength={60}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">RUT</label>
                    <input
                      className="form-control"
                      placeholder="11.111.111-1"
                      value={b.rut}
                      onChange={(e) => handleBenefChange(idx, 'rut', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Fecha de nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      value={b.fechaNacimiento}
                      onChange={(e) => handleBenefChange(idx, 'fechaNacimiento', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-3">
          <h5 className="fw-bold">Metodo de pago</h5>
          <select className="form-select" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} required>
            <option value="" disabled>Selecciona...</option>
            <option value="Debito">Debito</option>
            <option value="Credito">Credito</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </section>

        <div className="d-grid">
          <button type="submit" className="btn btn-info text-white btn-lg">Confirmar contratacion</button>
        </div>
      </form>
    </div>
  );
};

export default ContratarSeguro;
