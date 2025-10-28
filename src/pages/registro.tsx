import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/estiloRegistro.css';
import { savePerfilData } from '../utils/perfilStorage';


//se definen los tipos para los datos del formulario y los errores
type RegistroFormData = {
  rut: string;
  nombre: string;
  correo: string;
  nombre_usu: string;
  password: string;
  password2: string; //la repeticion de la contraseña
  telefono: string;
};

type RegistroFormErrors = RegistroFormData;


//inicializa los estados vacios para el formulario y los errores
const emptyForm: RegistroFormData = {
  rut: '',
  nombre: '',
  correo: '',
  nombre_usu: '',
  password: '',
  password2: '',
  telefono: '',
};

const emptyErrors: RegistroFormErrors = {
  rut: '',
  nombre: '',
  correo: '',
  nombre_usu: '',
  password: '',
  password2: '',
  telefono: '',
};



const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistroFormData>(emptyForm); // no tiene datos iniciales
  const [errors, setErrors] = useState<RegistroFormErrors>(emptyErrors); // no tiene errores iniciales


  //Fucnión que permite modificar los datos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };


  //valida los datos del formulario al enviarlo
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    //manejo de errores
    const newErrors: RegistroFormErrors = { ...emptyErrors };
    let isValid = true;

    if (formData.rut.trim().length < 9 || formData.rut.trim().length > 11) {
      newErrors.rut = 'El Rut debe contener entre 9 y 11 caractéres.';
      isValid = false;
    }

    if (formData.nombre.trim().length < 2 || formData.nombre.trim().length > 50) {
      newErrors.nombre = 'El Nombre debe contener entre 2 y 50 caractéres.';
      isValid = false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.correo)) {
      newErrors.correo = 'El Correo debe tener un formato válido.';
      isValid = false;
    }

    if (formData.nombre_usu.trim().length < 4 || formData.nombre_usu.trim().length > 20) {
      newErrors.nombre_usu = 'El Usuario debe contener entre 4 y 20 caractéres.';
      isValid = false;
    }

    if (formData.password.trim().length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caractéres.';
      isValid = false;
    }

    if (formData.password.trim() !== formData.password2.trim()) {
      newErrors.password2 = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    if (!/^\+569\d{8}$/.test(formData.telefono.trim())) {
      newErrors.telefono = 'Formato incorrecto. Ej: +56912345678';
      isValid = false;
    }

    setErrors(newErrors);


    //si no se cumple niguna condición del error, se guardan los datos y se navega al perfil
    if (isValid) {
      savePerfilData({
        nombre: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono,
        direccion: '',
      });

      console.log('Datos del formulario enviados:', formData);
      alert('Todos los campos estan correctos!');
      navigate('/perfil');
    }
  };






//Inicio del componente
  return (
    <div className="register-container">
      <div className="abs-center">
        <div className="text-center mb-4">
          <h1>Regístrate</h1>
          <p className="lead">Rellena el formulario para crear una cuenta</p>
        </div>

        <form className="form" id="form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-6">
              <div className="form-input rut">
                <label htmlFor="rut">Rut</label>
                <input type="text" id="rut" value={formData.rut} onChange={handleChange} />
                <p className="mensajeError">{errors.rut}</p>
              </div>

              <div className="form-input nombre">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" value={formData.nombre} onChange={handleChange} />
                <p className="mensajeError">{errors.nombre}</p>
              </div>

              <div className="form-input correo">
                <label htmlFor="correo">Correo</label>
                <input type="text" id="correo" value={formData.correo} onChange={handleChange} />
                <p className="mensajeError">{errors.correo}</p>
              </div>

              <div className="form-input nombre_usu">
                <label htmlFor="nombre_usu">Usuario</label>
                <input type="text" id="nombre_usu" value={formData.nombre_usu} onChange={handleChange} />
                <p className="mensajeError">{errors.nombre_usu}</p>
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
                <label htmlFor="telefono">Teléfono</label>
                <input type="text" id="telefono" value={formData.telefono} onChange={handleChange} />
                <p className="mensajeError">{errors.telefono}</p>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;

