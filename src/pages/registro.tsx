import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloRegistro.css';
// import { savePerfilData } from '../utils/perfilStorage'; // Ya no usaremos esto, guardaremos en BD real

// --- TIPOS ADAPTADOS AL BACKEND REAL (Usuario.java) ---
type RegistroFormData = {
  nombre: string;
  apellido: string; // [NUEVO] Obligatorio en Backend
  fechaNacimiento: string; // [NUEVO] Obligatorio en Backend
  correo: string;
  password: string;
  password2: string;
  telefono: string;
};

type RegistroFormErrors = Partial<RegistroFormData>;

// ID del rol "Paciente" en tu base de datos (Revisa tu tabla 'rol' en MySQL)
const ROL_PACIENTE_ID = 1; 

const emptyForm: RegistroFormData = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  correo: '',
  password: '',
  password2: '',
  telefono: '',
};

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistroFormData>(emptyForm);
  const [errors, setErrors] = useState<RegistroFormErrors>({});
  const [serverError, setServerError] = useState('');

  // URL del Backend (Puerto 8082)
  const API_URL = 'http://localhost:8082/api/v1/usuarios';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');

    // --- VALIDACIONES ---
    const newErrors: RegistroFormErrors = {};
    let isValid = true;

    if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre es muy corto.';
      isValid = false;
    }

    if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido es muy corto.';
      isValid = false;
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
      isValid = false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido.';
      isValid = false;
    }

    if (formData.password.trim().length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres.';
      isValid = false;
    }

    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    // Validación simple de teléfono chileno
    if (formData.telefono && !/^\+569\d{8}$/.test(formData.telefono.trim())) {
       newErrors.telefono = 'Formato incorrecto. Ej: +56912345678';
       isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        // --- CONEXIÓN CON BACKEND ---
        // Preparamos el JSON tal cual lo pide Usuario.java
        const payload = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            // Agregamos hora al final para cumplir formato LocalDateTime (YYYY-MM-DDTHH:mm:ss)
            fechaNacimiento: `${formData.fechaNacimiento}T00:00:00`, 
            correo: formData.correo,
            contrasena: formData.password,
            telefono: formData.telefono,
            // Asignamos el Rol por defecto (Paciente)
            rol: {
                id: ROL_PACIENTE_ID 
            }
        };

        const response = await axios.post(API_URL, payload);

        if (response.status === 201) { // 201 Created
            console.log('Usuario creado:', response.data);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login');
        }

      } catch (error: any) {
        console.error("Error al registrar:", error);
        if (error.response && error.response.data) {
             // Intentar mostrar el error específico del backend si existe
             setServerError(`Error: ${error.response.status} - Verifica que el correo no esté repetido.`);
        } else {
             setServerError("No se pudo conectar con el servidor (Puerto 8082).");
        }
      }
    }
  };

  return (
    <div className="register-container">
      <div className="abs-center">
        <div className="text-center mb-4">
          <h1>Regístrate</h1>
          <p className="lead">Crea tu cuenta de paciente</p>
        </div>

        {serverError && <div className="alert alert-danger text-center">{serverError}</div>}

        <form className="form" id="form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-6">
              
              {/* Apellido (Reemplaza al Rut que no existe en backend) */}
              <div className="form-input nombre">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" value={formData.nombre} onChange={handleChange} />
                <p className="mensajeError">{errors.nombre}</p>
              </div>

              <div className="form-input apellido">
                <label htmlFor="apellido">Apellido</label>
                <input type="text" id="apellido" value={formData.apellido} onChange={handleChange} />
                <p className="mensajeError">{errors.apellido}</p>
              </div>

              {/* Fecha Nacimiento (Reemplaza al Usuario que no existe en backend) */}
              <div className="form-input fecha">
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <input type="date" id="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                <p className="mensajeError">{errors.fechaNacimiento}</p>
              </div>

              <div className="form-input correo">
                <label htmlFor="correo">Correo</label>
                <input type="email" id="correo" value={formData.correo} onChange={handleChange} />
                <p className="mensajeError">{errors.correo}</p>
              </div>

            </div>

            <div className="col-md-6">
              <div className="form-input password">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} />
                <p className="mensajeError">{errors.password}</p>
              </div>

              <div className="form-input password2">
                <label htmlFor="password2">Repetir contraseña</label>
                <input type="password" id="password2" value={formData.password2} onChange={handleChange} />
                <p className="mensajeError">{errors.password2}</p>
              </div>

              <div className="form-input telefono">
                <label htmlFor="telefono">Teléfono (+569...)</label>
                <input type="text" id="telefono" value={formData.telefono} onChange={handleChange} />
                <p className="mensajeError">{errors.telefono}</p>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;