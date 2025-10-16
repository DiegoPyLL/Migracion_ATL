import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/estiloRegistro.css";

const Registro = () => {
  // --- HOOKS: Para manejar el estado y la navegación ---
  const navigate = useNavigate();

  // Un solo estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    correo: '',
    nombre_usu: '',
    password: '',
    password2: '',
    telefono: ''
  });

  // Un solo estado para todos los mensajes de error
  const [errors, setErrors] = useState({
    rut: '',
    nombre: '',
    correo: '',
    nombre_usu: '',
    password: '',
    password2: '',
    telefono: ''
  });

  // --- LÓGICA: Funciones para manejar cambios y envíos ---

  // Se ejecuta cada vez que el usuario escribe en un input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Se ejecuta al enviar el formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Aquí movemos toda tu lógica de validación de registrateCode.js
    const newErrors = { rut: '', nombre: '', correo: '', nombre_usu: '', password: '', password2: '', telefono: '' };
    let isValid = true;

    // Validamos Rut
    if (formData.rut.trim().length < 9 || formData.rut.trim().length > 11) {
      newErrors.rut = "El Rut debe contener entre 9 y 11 caracteres.";
      isValid = false;
    }
    // Validamos Nombre
    if (formData.nombre.trim().length < 2 || formData.nombre.trim().length > 50) {
      newErrors.nombre = "El Nombre debe contener entre 2 y 50 caracteres.";
      isValid = false;
    }
    // Validamos Correo
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.correo)) {
      newErrors.correo = "El Correo debe tener un formato válido.";
      isValid = false;
    }
    // Validamos Usuario
    if (formData.nombre_usu.trim().length < 4 || formData.nombre_usu.trim().length > 20) {
      newErrors.nombre_usu = "El Usuario debe contener entre 4 y 20 caracteres.";
      isValid = false;
    }
    // Validamos Contraseña
    if (formData.password.trim().length < 4) {
      newErrors.password = "La contraseña debe tener al menos 4 caracteres.";
      isValid = false;
    }
    // Validamos si las contraseñas coinciden
    if (formData.password.trim() !== formData.password2.trim()) {
      newErrors.password2 = "Las contraseñas no coinciden.";
      isValid = false;
    }
    // Validamos Teléfono
    if (!/^\+569\d{8}$/.test(formData.telefono.trim())) {
      newErrors.telefono = "Formato incorrecto. Ej: +56912345678.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      alert("¡Todos los campos están correctos!");
      console.log("Datos del formulario enviados:", formData);
      navigate('/perfil'); // Redirige al perfil si todo está bien
    }
  };


  // --- JSX: La estructura visual del componente ---
  return (
    <div className="register-container"> {/* Contenedor para aplicar el fondo y centrado */}
      <div className="abs-center">
        <div className="text-center mb-4">
          <h1>Regístrate</h1>
          <p className="lead">Rellena el formulario para crear una cuenta</p>
        </div>

        <form className="form" id="form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-6">
              {/* Rut */}
              <div className="form-input rut">
                <label htmlFor="rut">Rut</label>
                <input type="text" id="rut" value={formData.rut} onChange={handleChange} />
                <p className="mensajeError">{errors.rut}</p>
              </div>
              {/* Nombre */}
              <div className="form-input nombre">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" value={formData.nombre} onChange={handleChange} />
                <p className="mensajeError">{errors.nombre}</p>
              </div>
              {/* Correo */}
              <div className="form-input correo">
                <label htmlFor="correo">Correo</label>
                <input type="text" id="correo" value={formData.correo} onChange={handleChange} />
                <p className="mensajeError">{errors.correo}</p>
              </div>
              {/* Usuario */}
              <div className="form-input nombre_usu">
                <label htmlFor="nombre_usu">Usuario</label>
                <input type="text" id="nombre_usu" value={formData.nombre_usu} onChange={handleChange} />
                <p className="mensajeError">{errors.nombre_usu}</p>
              </div>
            </div>

            <div className="col-md-6">
              {/* Contraseña */}
              <div className="form-input password">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} />
                <p className="mensajeError">{errors.password}</p>
              </div>
              {/* Repetir Contraseña */}
              <div className="form-input password2">
                <label htmlFor="password2">Repetir Contraseña</label>
                <input type="password" id="password2" value={formData.password2} onChange={handleChange} />
                <p className="mensajeError">{errors.password2}</p>
              </div>
              {/* Teléfono */}
              <div className="form-input telefono">
                <label htmlFor="telefono">Teléfono</label>
                <input type="text" id="telefono" value={formData.telefono} onChange={handleChange} />
                <p className="mensajeError">{errors.telefono}</p>
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;