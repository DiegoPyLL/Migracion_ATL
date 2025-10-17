import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login_style.css";

const Login = () => {

  const navigate = useNavigate();


  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

 
  const [errors, setErrors] = useState({ usuario: '', password: '' });


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    setErrors({ usuario: '', password: '' });


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


  return (
    <div className="login-container">      
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