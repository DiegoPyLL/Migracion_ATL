import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/stylesSeguros_vida.css"; 

const ComprarSeguroVida = () => {
  // --- HOOKS: Para manejar el estado y la navegación ---
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    rut: '',
    nombres: '',
    fechaNacimiento: '',
    email: '',
    celular: '',
    pago: '',
    terminos: false
  });

  const [errors, setErrors] = useState({
    rut: '',
    nombres: '',
    fechaNacimiento: '',
    email: '',
    pago: '',
    terminos: ''
  });

  // --- LÓGICA: Funciones para manejar cambios y envíos ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkedValue = (e.target as HTMLInputElement).checked;

    setFormData(prevState => ({
      ...prevState,
      [id]: isCheckbox ? checkedValue : value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // La lógica de validación es la misma que en el formulario anterior
    let isValid = true;
    const newErrors = { rut: '', nombres: '', fechaNacimiento: '', email: '', pago: '', terminos: ''};
    
    const validarRut = (rutCompleto: string) => { /* ...la misma función de validación de RUT... */ if(!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto.replace(/\./g,'')))return false;const[cuerpo,dv]=rutCompleto.replace(/\./g,'').split('-');let suma=0;let multiplicador=2;for(let i=cuerpo.length-1;i>=0;i--){suma+=parseInt(cuerpo.charAt(i))*multiplicador;multiplicador=multiplicador===7?2:multiplicador+1;}const dvEsperado=11-(suma%11);let dvCalculado=String(dvEsperado);if(dvEsperado===11)dvCalculado='0';else if(dvEsperado===10)dvCalculado='k';return dv.toLowerCase()===dvCalculado;};
    
    if (!validarRut(formData.rut)) { newErrors.rut = 'El RUT no es válido.'; isValid = false; }
    if (!formData.nombres.trim()) { newErrors.nombres = 'El nombre es requerido.'; isValid = false; }
    if (!formData.fechaNacimiento) { newErrors.fechaNacimiento = 'La fecha es requerida.'; isValid = false; }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) { newErrors.email = 'El formato del correo no es válido.'; isValid = false; }
    if (!formData.pago) { newErrors.pago = 'Seleccione un método de pago.'; isValid = false; }
    if (!formData.terminos) { newErrors.terminos = 'Debes aceptar los términos y condiciones.'; isValid = false; }
    
    setErrors(newErrors);

    if (isValid) {
      console.log('Datos del seguro de vida guardados:', formData);
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 5000);
    }
  };
  
  if (showSuccess) {
    return (
      <div className="seguro-vida-container">
        <div className="mensaje-exito-react">
          <strong>¡Contratación exitosa!</strong><br />
          Hemos recibido tus datos para el Seguro de Vida y te contactaremos pronto.
        </div>
      </div>
    );
  }

  // --- JSX: La estructura visual del componente ---
  return (
    <div className="seguro-vida-container">
      <div className="form-container">
        <form id="seguro-form" onSubmit={handleSubmit} noValidate>
          <header className="form-header">
            {/* ✅ CAMBIO: Títulos actualizados */}
            <h1>Planificador de Vida</h1>
            <p>Ingresa los datos para contratar tu seguro de vida</p>
          </header>

          <section className="form-section">
            <h2>Datos del asegurado</h2>
            {/* Los campos de datos personales son idénticos */ }
            <div className="form-row">
              <div className={`form-field ${errors.rut ? 'has-error' : ''}`}>
                <label htmlFor="rut">Rut</label>
                <input type="text" id="rut" value={formData.rut} onChange={handleChange} placeholder="Ej. 11.111.111-k" />
                <span className="error-message">{errors.rut}</span>
              </div>
              <div className={`form-field ${errors.nombres ? 'has-error' : ''}`}>
                <label htmlFor="nombres">Nombres y apellidos</label>
                <input type="text" id="nombres" value={formData.nombres} onChange={handleChange} placeholder="Ej. Jose Perez" />
                <span className="error-message">{errors.nombres}</span>
              </div>
              <div className={`form-field ${errors.fechaNacimiento ? 'has-error' : ''}`}>
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input type="date" id="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                <span className="error-message">{errors.fechaNacimiento}</span>
              </div>
            </div>
            <div className="form-row">
              <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Ej. correo@dominio.cl" />
                <span className="error-message">{errors.email}</span>
              </div>
              <div className="form-field">
                <label htmlFor="celular">Número de celular</label>
                <input type="tel" id="celular" value={formData.celular} onChange={handleChange} placeholder="Ej. +56987654321" />
              </div>
            </div>
          </section>

          <hr className="separator" />

          <section className="form-section">
            <h2>Resumen de tu Seguro</h2>
            <div className="summary-box">
              <div className="summary-item">
                <span>Plan seleccionado</span>
                <strong>Seguro de Vida Plus</strong>
              </div>
              <div className="summary-item price">
                <span>Valor mensual</span>
                <strong>$54.990 CLP</strong>
              </div>
            </div>
          </section>

          {/* Las secciones de pago y términos son idénticas */}
          <section className="form-section">
            <h2>Datos de pago</h2>
            <div className={`form-field ${errors.pago ? 'has-error' : ''}`}>
              <label htmlFor="pago">Seleccione un método de pago</label>
              <select id="pago" value={formData.pago} onChange={handleChange}>
                <option value="" disabled>Seleccione un método de pago</option>
                <option value="tarjeta-credito">Tarjeta de crédito</option>
                <option value="tarjeta-debito">Tarjeta de débito</option>
                <option value="transferencia">Transferencia bancaria</option>
              </select>
              <span className="error-message">{errors.pago}</span>
            </div>
          </section>
          
          <section className={`form-section terms-section ${errors.terminos ? 'has-error' : ''}`}>
            <div className="form-field-checkbox">
              <input type="checkbox" id="terminos" checked={formData.terminos} onChange={handleChange} />
              <label htmlFor="terminos">
                He leído y acepto los <Link to="/terminos-y-condiciones" target="_blank">Términos y Condiciones</Link> del servicio.
              </label>
            </div>
            <span className="error-message">{errors.terminos}</span>
          </section>

          <div className="form-actions">
            <button type="reset" className="btn-reset" onClick={() => setErrors({rut:'',nombres:'',fechaNacimiento:'',email:'',pago:'',terminos:''})}>Limpiar</button>
            <button type="submit" className="btn-submit">Confirmar Contratación</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComprarSeguroVida;