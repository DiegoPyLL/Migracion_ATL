import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloPerfil.css';
import PerfilCarousel from '../components/perfil/PerfilCarousel';
import PerfilForm from '../components/perfil/PerfilForm';

// Definimos la estructura EXACTA de tu API (Usuario.java)
// Eliminamos direccion y comunicacion porque no existen en el backend
export interface PerfilData {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  rol?: any;
}

const Perfil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado inicial limpio, solo con datos reales
  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    fechaNacimiento: ''
  });

  // URL base de la API (Puerto 8082)
  const API_URL = 'http://localhost:8082/api/v1/usuarios';

  // --- 1. CARGAR DATOS AL INICIAR ---
  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioSesion = localStorage.getItem('usuario');
      
      if (!usuarioSesion) {
        alert("No has iniciado sesión.");
        navigate('/login');
        return;
      }

      const usuarioObj = JSON.parse(usuarioSesion);
      // Ajuste por si tu login devuelve 'userId' o 'id'
      const userId = usuarioObj.userId || usuarioObj.id;

      try {
        const response = await axios.get(`${API_URL}/${userId}`);
        const u = response.data;

        // Solo cargamos lo que existe
        setPerfilData({
          id: u.id,
          nombre: u.nombre || '',
          apellido: u.apellido || '',
          correo: u.correo || '',
          telefono: u.telefono || '',
          // Convertimos la fecha completa de Java a formato simple (YYYY-MM-DD) para el input date
          fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : '',
          rol: u.rol
        });

      } catch (error) {
        console.error("Error cargando perfil:", error);
        // Si falla (ej: el usuario fue borrado), lo sacamos al login
        // localStorage.removeItem('usuario');
        // navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);


  // --- MANEJO DEL FORMULARIO ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!perfilData.id) return;

    try {
      // SOLUCIÓN DEL ERROR 400:
      // 1. No enviamos 'rol'. Al ir como null/undefined, el Backend mantendrá el rol actual.
      // 2. Aseguramos que fechaNacimiento no vaya vacía si el usuario borró la fecha.
      
      const payload = {
        nombre: perfilData.nombre,
        apellido: perfilData.apellido,
        correo: perfilData.correo,
        telefono: perfilData.telefono,
        // Si hay fecha, le pegamos la hora. Si no, enviamos null para evitar errores de formato.
        fechaNacimiento: perfilData.fechaNacimiento ? `${perfilData.fechaNacimiento}T00:00:00` : null,
        // rol: perfilData.rol  <-- BORRAMOS ESTA LÍNEA (Causante del error 400)
      };

      console.log('Enviando actualización:', payload);

      await axios.put(`${API_URL}/${perfilData.id}`, payload);

      alert('¡Perfil actualizado con éxito!');
      setIsEditing(false);
      
      // Actualizamos el localStorage para que el saludo del header (si lo tienes) se actualice
      const usuarioSesion = JSON.parse(localStorage.getItem('usuario') || '{}');
      usuarioSesion.nombre = perfilData.nombre;
      usuarioSesion.apellido = perfilData.apellido; // Guardamos apellido también
      localStorage.setItem('usuario', JSON.stringify(usuarioSesion));

    } catch (error: any) {
      console.error("Error actualizando:", error);
      // Mostramos un mensaje más útil si es error 400
      if (error.response && error.response.status === 400) {
        alert("Error en los datos enviados. Revisa que la fecha sea válida.");
      } else {
        alert("Error al guardar los cambios.");
      }
    }
  };

  const handleEnableEdition = () => {
    setIsEditing(true);
  };

  const handleClear = () => {
    // Limpiamos solo campos editables no críticos. 
    // No limpiamos Nombre/Apellido porque son obligatorios y es raro querer borrarlos todos.
    setPerfilData(prev => ({
      ...prev,
      telefono: '', // El teléfono es opcional, se puede limpiar
    }));
  };

  if (loading) return <div className="text-center mt-5 p-5">Cargando tus datos...</div>;

  return (
    <div className="perfil-container">
      <div className="container-fluid perfil-wrapper">
        <div className="perfil-card">
          <div className="row align-items-start g-0">
            <PerfilCarousel />
            
            <PerfilForm
              perfilData={perfilData}
              isEditing={isEditing}
              onChange={handleChange}
              onEnableEdition={handleEnableEdition}
              onClear={handleClear}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;