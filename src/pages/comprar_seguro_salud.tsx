import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/stylesSeguros_salud.css"; // Asegúrate de tener este archivo o usa el de vida

const ComprarSeguroSalud = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [loadingDatos, setLoadingDatos] = useState(true);
  
  // URLs de las APIs
  const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';
  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';

  const [formData, setFormData] = useState({
    rut: '',
    nombres: '',
    fechaNacimiento: '',
    email: '',
    celular: '',
    prevision: '', // Campo extra específico de salud (Fonasa/Isapre)
    pago: '',
    terminos: false
  });

  const [errors, setErrors] = useState({
    rut: '',
    nombres: '',
    fechaNacimiento: '',
    email: '',
    prevision: '',
    pago: '',
    terminos: ''
  });

  // --- 1. Cargar Usuario Logueado ---
  useEffect(() => {
    const usuarioSesion = localStorage.getItem('usuario');
    
    if (!usuarioSesion) {
        alert("Debes iniciar sesión para contratar.");
        navigate('/login');
        return;
      }

      const usuarioJson = JSON.parse(usuarioSesion);
      const id = usuarioJson.id || usuarioJson.userId;
      setUserId(id);

      try {
          // Rellenamos datos base desde el localStorage o podríamos llamar a la API
          // Para hacerlo rápido, usamos lo que ya tenemos en sesión si es suficiente
          setFormData(prev => ({
              ...prev,
              nombres: usuarioJson.nombre ? `${usuarioJson.nombre} ${usuarioJson.apellido || ''}` : '',
              email: usuarioJson.correo || '',
              celular: usuarioJson.telefono || '',
              fechaNacimiento: usuarioJson.fechaNacimiento ? usuarioJson.fechaNacimiento.split('T')[0] : ''
          }));
      } catch (error) {
          console.error("Error cargando datos usuario", error);
      } finally {
          setLoadingDatos(false);
      }
  }, [navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkedValue = (e.target as HTMLInputElement).checked;

    setFormData(prevState => ({
      ...prevState,
      [id]: isCheckbox ? checkedValue : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let isValid = true;
    const newErrors = { rut: '', nombres: '', fechaNacimiento: '', email: '', prevision: '', pago: '', terminos: ''};
    
    // Validación de RUT
    const validarRut = (rutCompleto: string) => { 
        if(!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto.replace(/\./g,'')))return false;
        const[cuerpo,dv]=rutCompleto.replace(/\./g,'').split('-');
        let suma=0;let multiplicador=2;
        for(let i=cuerpo.length-1;i>=0;i--){suma+=parseInt(cuerpo.charAt(i))*multiplicador;multiplicador=multiplicador===7?2:multiplicador+1;}
        const dvEsperado=11-(suma%11);
        let dvCalculado=String(dvEsperado);
        if(dvEsperado===11)dvCalculado='0';else if(dvEsperado===10)dvCalculado='k';
        return dv.toLowerCase()===dvCalculado;
    };
    
    if (!validarRut(formData.rut)) { newErrors.rut = 'El RUT no es válido.'; isValid = false; }
    if (!formData.prevision) { newErrors.prevision = 'Selecciona tu previsión actual.'; isValid = false; }
    if (!formData.pago) { newErrors.pago = 'Seleccione un método de pago.'; isValid = false; }
    if (!formData.terminos) { newErrors.terminos = 'Debes aceptar los términos.'; isValid = false; }
    
    setErrors(newErrors);

    if (isValid && userId) {
      try {
          const payload = {
            nombreSeguro: "Seguro de Salud Familiar", // Nombre del producto
            // Guardamos Previsión y RUT en la descripción
            descripcion: `Salud Full. RUT: ${formData.rut}. Previsión: ${formData.prevision}. Pago: ${formData.pago}. Contacto: ${formData.celular}`,
            usuarioId: userId,
            estado: "ACTIVO"
          };

          await axios.post(SEGUROS_API_URL, payload);
          setShowSuccess(true);
          setTimeout(() => navigate('/perfil'), 3000);

      } catch (error) {
          console.error("Error al contratar:", error);
          alert("Error al procesar. Verifique que la API de Seguros (8081) esté corriendo.");
      }
    }
  };
  
  if (showSuccess) {
    return (
      <div className="seguro-salud-container">
        <div className="mensaje-exito-react">
          <strong>¡Cobertura Activada!</strong><br />
          Tu Seguro de Salud ya está disponible en tu perfil.
        </div>
      </div>
    );
  }

  if (loadingDatos) return <div className="text-center mt-5">Cargando tus datos...</div>;

  return (
    <div className="seguro-salud-container">
      <div className="form-container">
        <form id="seguro-form" onSubmit={handleSubmit} noValidate>
          <header className="form-header">
            <h1>Contratar Seguro de Salud</h1>
            <p>Protección completa para ti y tu familia</p>
          </header>

          <section className="form-section">
            <h2>Datos del Asegurado</h2>
            
            <div className="form-row">
              <div className={`form-field ${errors.rut ? 'has-error' : ''}`}>
                <label htmlFor="rut">Rut (Requerido)</label>
                <input type="text" id="rut" value={formData.rut} onChange={handleChange} placeholder="Ej. 11.111.111-k" />
                <span className="error-message">{errors.rut}</span>
              </div>

              <div className="form-field">
                <label>Nombre Completo</label>
                <input type="text" value={formData.nombres} disabled className="bg-light" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Correo electrónico</label>
                <input type="email" value={formData.email} disabled className="bg-light" />
              </div>
              <div className={`form-field ${errors.prevision ? 'has-error' : ''}`}>
                <label htmlFor="prevision">Previsión Actual</label>
                <select id="prevision" value={formData.prevision} onChange={handleChange}>
                    <option value="" disabled>Selecciona...</option>
                    <option value="Fonasa">Fonasa</option>
                    <option value="Isapre">Isapre</option>
                    <option value="Particular">Particular</option>
                </select>
                <span className="error-message">{errors.prevision}</span>
              </div>
            </div>
          </section>

          <hr className="separator" />

          <section className="form-section">
            <h2>Plan Salud Familiar</h2>
            <div className="summary-box">
              <div className="summary-item">
                <span>Cobertura</span>
                <strong>Ambulatoria y Hospitalaria</strong>
              </div>
              <div className="summary-item price">
                <span>Valor mensual</span>
                <strong>$35.000 CLP</strong>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Pago</h2>
            <div className={`form-field ${errors.pago ? 'has-error' : ''}`}>
              <label>Método de Pago</label>
              <select id="pago" value={formData.pago} onChange={handleChange}>
                <option value="" disabled>Selecciona...</option>
                <option value="tarjeta-credito">Tarjeta de Crédito</option>
                <option value="tarjeta-debito">Tarjeta de Débito</option>
                <option value="pat">Pago Automático (PAT)</option>
              </select>
              <span className="error-message">{errors.pago}</span>
            </div>
          </section>
          
          <section className={`form-section terms-section ${errors.terminos ? 'has-error' : ''}`}>
            <div className="form-field-checkbox">
              <input type="checkbox" id="terminos" checked={formData.terminos} onChange={handleChange} />
              <label htmlFor="terminos">
                Acepto los <Link to="/terminos-y-condiciones" target="_blank">Términos y Condiciones</Link>.
              </label>
            </div>
            <span className="error-message">{errors.terminos}</span>
          </section>

          <div className="form-actions">
            <button type="submit" className="btn-submit w-100">Confirmar Contratación</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComprarSeguroSalud;