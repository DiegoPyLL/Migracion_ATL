import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // [Importante] Importamos axios para conectar con Java
import "../styles/login_style.css";

const Login = () => {

  const navigate = useNavigate();

  // URL de tu Backend Spring Boot (Puerto 8082 según tu application.properties)
  const API_URL = 'http://localhost:8082/api/v1/auth/login';

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ usuario: '', password: '' });
  // Estado para mensajes generales de error (ej: "Servidor no responde")
  const [generalError, setGeneralError] = useState(''); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Limpiamos errores previos
    setErrors({ usuario: '', password: '' });
    setGeneralError('');

    let valido = true;
    const newErrors = { usuario: '', password: '' };

    if (!usuario.trim()) {
      newErrors.usuario = "Por favor ingresa el usuario";
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
      // --- CONEXIÓN CON BACKEND ---
      // Enviamos 'usuario' como 'correo' porque así lo pide tu Java (LoginRequest.java)
      const response = await axios.post(API_URL, {
        correo: usuario, 
        contrasena: password
      });

      if (response.status === 200) {
        console.log("Login exitoso:", response.data);
        
        // Guardamos la sesión en el navegador
        localStorage.setItem('usuario', JSON.stringify(response.data));
        
        // Redirigir según el rol (Opcional, pero útil)
        // Si es admin, quizás quieras ir a otro lado, por ahora vamos a perfil
        navigate('/perfil'); 
      }

    } catch (error: any) {
      console.error("Error de login:", error);

      if (error.response && error.response.status === 401) {
        // 401 significa Credenciales Incorrectas (según tu AuthControllerTest.java)
        setErrors({ ...newErrors, password: "Correo o contraseña incorrectos" });
      } else if (error.code === "ERR_NETWORK") {
        setGeneralError("No se pudo conectar con el servidor. Revisa que el Backend esté corriendo en el puerto 8082.");
      } else {
        setGeneralError("Ocurrió un error inesperado. Inténtalo más tarde.");
      }
    }
  };

  return (
    <div className="login-container">      
      <form id="loginForm" onSubmit={handleSubmit} noValidate>
        <h2>Iniciar Sesión</h2>

        {/* Mostrar error general si existe (ej: servidor apagado) */}
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