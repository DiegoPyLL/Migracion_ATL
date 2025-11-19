import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import "../styles/login_style.css";

const Login = () => {

  const navigate = useNavigate();

  // URL de tu Backend Spring Boot
  const API_URL = 'http://localhost:8082/api/v1/auth/login';

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ usuario: '', password: '' });
  const [generalError, setGeneralError] = useState(''); 

  // --- 1. EFECTO: Si ya estoy logueado, redirigir automáticamente ---
  useEffect(() => {
    const usuarioSesion = localStorage.getItem('usuario');
    if (usuarioSesion) {
        try {
            const usuarioObj = JSON.parse(usuarioSesion);
            const rol = usuarioObj.role ? usuarioObj.role.toLowerCase() : "";
            
            if (rol === "administrador") navigate('/admin-dashboard');
            else if (rol === "doctor") navigate('/doctor-dashboard');
            
            else navigate('/'); 
            
        } catch (e) {
            localStorage.removeItem('usuario');
        }
    }
  }, [navigate]);

  // --- 2. MANEJO DEL ENVÍO DEL FORMULARIO ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Limpiamos errores previos
    setErrors({ usuario: '', password: '' });
    setGeneralError('');

    // Validaciones locales
    let valido = true;
    const newErrors = { usuario: '', password: '' };

    if (!usuario.trim()) {
      newErrors.usuario = "Por favor ingresa el usuario/correo";
      valido = false;
    }

    if (!password.trim()) {
      newErrors.password = "Por favor ingresa la contraseña";
      valido = false;
    }

    if (!valido) {
      setErrors(newErrors);
      return; 
    }

    try {
      // Conexión con el Backend
      const response = await axios.post(API_URL, {
        correo: usuario, 
        contrasena: password
      });

      if (response.status === 200) {
        console.log("Login exitoso:", response.data);
        
        // Guardar sesión
        localStorage.setItem('usuario', JSON.stringify(response.data));
        
        // REDIRECCIÓN POR ROL
        const rol = response.data.role ? response.data.role.toLowerCase() : "";

        if (rol === "administrador") {
            navigate('/admin-dashboard');
        } else if (rol === "doctor") {
            navigate('/doctor-dashboard');
        } else {
            navigate('/'); 
        }
      }

    } catch (error: any) {
      console.error("Error de login:", error);

      // Manejo de Errores Específicos
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        setErrors({ ...newErrors, password: "Correo o contraseña incorrectos" });
      } else if (error.code === "ERR_NETWORK") {
        setGeneralError("No se pudo conectar con el servidor. Verifica que el puerto 8082 esté activo.");
      } else {
        setGeneralError("Ocurrió un error inesperado. Inténtalo más tarde.");
      }
    }
  };

  return (
    <div className="login-container">      
      <form id="loginForm" onSubmit={handleSubmit} noValidate>
        <h2>Iniciar Sesión</h2>

        {/* Error general (Servidor caído, etc.) */}
        {generalError && <div className="alert alert-danger" style={{color: 'red', marginBottom: '10px'}}>{generalError}</div>}

        <div className="form-input usuario">
          <label htmlFor="usuario">Correo / Usuario</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="ejemplo@correo.com"
          />
          <p className="mensajeError">{errors.usuario}</p>
        </div>

        <div className="form-input password">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mensajeError">{errors.password}</p>
        </div>

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;