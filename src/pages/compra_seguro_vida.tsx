import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/stylesSeguros_vida.css"; 

const ComprarSeguroVida = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [loadingDatos, setLoadingDatos] = useState(true);
  
  // URLs de las APIs
  const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';
  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';

  const [formData, setFormData] = useState({
    rut: '', // Este se pedirá porque no existe en tu BD de usuarios
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

  // --- 1. Cargar Datos del Usuario al Iniciar ---
  useEffect(() => {
    const cargarUsuario = async () => {
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
            // Consultamos los datos frescos a la API de Usuarios (8082)
            const response = await axios.get(`${USUARIOS_API_URL}/${id}`);
            const u = response.data;

            // Rellenamos el formulario automáticamente
            setFormData(prev => ({
                ...prev,
                nombres: `${u.nombre} ${u.apellido}`,
                email: u.correo,
                celular: u.telefono || '',
                // Formateamos la fecha para que el input type="date" la entienda (YYYY-MM-DD)
                fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : ''
            }));
        } catch (error) {
            console.error("No se pudieron cargar los datos del usuario", error);
        } finally {
            setLoadingDatos(false);
        }
    };

    cargarUsuario();
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
    const newErrors = { rut: '', nombres: '', fechaNacimiento: '', email: '', pago: '', terminos: ''};
    
    // Validación de RUT (Necesaria porque el usuario lo escribe manualmente)
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
    
    if (!validarRut(formData.rut)) { newErrors.rut = 'El RUT no es válido (Ej: 11111111-1).'; isValid = false; }
    if (!formData.pago) { newErrors.pago = 'Seleccione un método de pago.'; isValid = false; }
    if (!formData.terminos) { newErrors.terminos = 'Debes aceptar los términos.'; isValid = false; }
    
    setErrors(newErrors);

    if (isValid && userId) {
      try {
          const payload = {
            nombreSeguro: "Seguro de Vida Plus",
            // Incluimos el RUT en la descripción porque es el único dato "nuevo"
            descripcion: `Contratado Web. RUT: ${formData.rut}. Pago: ${formData.pago}. Contacto: ${formData.celular}`,
            usuarioId: userId,
            estado: "ACTIVO"
          };

          await axios.post(SEGUROS_API_URL, payload);
          setShowSuccess(true);
          setTimeout(() => navigate('/perfil'), 3000);

      } catch (error) {
          console.error("Error al contratar:", error);
          alert("Error al procesar. Intente nuevamente.");
      }
    }
  };
  
  if (showSuccess) {
    return (
      <div className="seguro-vida-container">
        <div className="mensaje-exito-react">
          <strong>¡Felicidades!</strong><br />
          Tu Seguro de Vida ha sido activado correctamente.
        </div>
      </div>
    );
  }

  if (loadingDatos) return <div className="text-center mt-5">Cargando tus datos...</div>;

  return (
    <div className="seguro-vida-container">
      <div className="form-container">
        <form id="seguro-form" onSubmit={handleSubmit} noValidate>
          <header className="form-header">
            <h1>Confirmar Contratación</h1>
            <p>Revisa tus datos y selecciona el pago</p>
          </header>

          <section className="form-section">
            <h2>Datos del Asegurado</h2>
            <p className="text-muted mb-3">Estos datos se han cargado de tu perfil.</p>
            
            <div className="form-row">
              {/* RUT: Único campo personal editable (porque no lo tenemos en BD) */}
              <div className={`form-field ${errors.rut ? 'has-error' : ''}`}>
                <label htmlFor="rut">Rut (Requerido)</label>
                <input type="text" id="rut" value={formData.rut} onChange={handleChange} placeholder="Ej. 11.111.111-k" />
                <span className="error-message">{errors.rut}</span>
              </div>

              {/* NOMBRE: Bloqueado */}
              <div className="form-field">
                <label>Nombre Completo</label>
                <input type="text" value={formData.nombres} disabled className="bg-light" />
              </div>

              {/* FECHA: Bloqueada */}
              <div className="form-field">
                <label>Fecha de nacimiento</label>
                <input type="date" value={formData.fechaNacimiento} disabled className="bg-light" />
              </div>
            </div>

            <div className="form-row">
              {/* CORREO: Bloqueado */}
              <div className="form-field">
                <label>Correo electrónico</label>
                <input type="email" value={formData.email} disabled className="bg-light" />
              </div>
              
              {/* CELULAR: Bloqueado */}
              <div className="form-field">
                <label>Celular de contacto</label>
                <input type="tel" value={formData.celular} disabled className="bg-light" />
              </div>
            </div>
          </section>

          <hr className="separator" />

          <section className="form-section">
            <h2>Detalle del Plan</h2>
            <div className="summary-box">
              <div className="summary-item">
                <span>Plan</span>
                <strong>Seguro de Vida Plus</strong>
              </div>
              <div className="summary-item price">
                <span>Total a pagar</span>
                <strong>$54.990 CLP</strong>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Método de Pago</h2>
            <div className={`form-field ${errors.pago ? 'has-error' : ''}`}>
              <select id="pago" value={formData.pago} onChange={handleChange}>
                <option value="" disabled>Selecciona cómo pagar</option>
                <option value="tarjeta-credito">Tarjeta de Crédito</option>
                <option value="tarjeta-debito">Tarjeta de Débito (Redcompra)</option>
                <option value="transferencia">Transferencia Bancaria</option>
              </select>
              <span className="error-message">{errors.pago}</span>
            </div>
          </section>
          
          <section className={`form-section terms-section ${errors.terminos ? 'has-error' : ''}`}>
            <div className="form-field-checkbox">
              <input type="checkbox" id="terminos" checked={formData.terminos} onChange={handleChange} />
              <label htmlFor="terminos">
                Acepto contratar el seguro bajo los <Link to="/terminos-y-condiciones" target="_blank">Términos y Condiciones</Link>.
              </label>
            </div>
            <span className="error-message">{errors.terminos}</span>
          </section>

          <div className="form-actions">
            <button type="submit" className="btn-submit w-100">Confirmar y Pagar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComprarSeguroVida;