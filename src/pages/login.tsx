import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login_style.css";

const Login = () => {
  // --- 1. HOOKS: Para manejar el estado y la navegación ---
  const navigate = useNavigate(); // Hook para redirigir al usuario

  // Estados para guardar lo que el usuario escribe en los inputs
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  // Un estado para los mensajes de error, más organizado
  const [errors, setErrors] = useState({ usuario: '', password: '' });

  // --- 2. LÓGICA: Función que se ejecuta al enviar el formulario ---
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previene que la página se recargue

    // Limpiamos los errores previos
    setErrors({ usuario: '', password: '' });

    // Lógica de validación (traducida de tu validacion.js)
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

    // Si hay errores de validación, los mostramos y detenemos
    if (!valido) {
      setErrors(newErrors);
      return;
    }

    // Simulación de login (traducida de tu validacion.js)
    if (usuario === "admin" && password === "1234") {
      // ¡Correcto! Usamos navigate para ir al perfil
      console.log("Login exitoso, redirigiendo...");
      navigate('/perfil'); // Redirige a la ruta /perfil
    } else {
      // Incorrecto, mostramos error en el campo de contraseña
      setErrors({ ...newErrors, password: "Usuario o contraseña incorrectos" });
    }
  };

  // --- 3. JSX: La estructura visual del componente ---
  return (
    <div className="login-container"> {/* Contenedor principal para el fondo */}
      <img
        src="/images/logo.png" // Ruta desde la carpeta 'public'
        alt="Logo de la empresa"
        className="logo"
      />
      
      <form id="loginForm" onSubmit={handleSubmit} noValidate>
        <h2>Iniciar Sesión</h2>

        <div className="form-input usuario">
          <label htmlFor="usuario">Usuario</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          {/* Mostramos el mensaje de error si existe */}
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
          {/* Mostramos el mensaje de error si existe */}
          <p className="mensajeError">{errors.password}</p>
        </div>

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;