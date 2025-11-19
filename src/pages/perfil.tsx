import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloPerfil.css';
import PerfilCarousel from '../components/perfil/PerfilCarousel';
import PerfilForm from '../components/perfil/PerfilForm';

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

  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    fechaNacimiento: ''
  });

  const API_URL = 'http://localhost:8082/api/v1/usuarios';

  // --- 1. CARGAR DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioSesion = localStorage.getItem('usuario');
      
      if (!usuarioSesion) {
        navigate('/login');
        return;
      }

      const usuarioObj = JSON.parse(usuarioSesion);
      const userId = usuarioObj.userId || usuarioObj.id;

      try {
        const response = await axios.get(`${API_URL}/${userId}`);
        const u = response.data;

        setPerfilData({
          id: u.id,
          nombre: u.nombre || '',
          apellido: u.apellido || '',
          correo: u.correo || '',
          telefono: u.telefono || '',
          fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : '',
          rol: u.rol
        });

      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  // --- 2. LOGICA DE CERRAR SESIÓN (NUEVO) ---
  const handleLogout = () => {
    // 1. Borramos los datos del navegador
    localStorage.removeItem('usuario');
    // 2. Lo mandamos al login
    navigate('/login');
  };

  // --- 3. MANEJO DEL FORMULARIO ---
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

    // --- VALIDACIONES PREVIAS ---
    
    if (!perfilData.nombre.trim()) {
        alert("El nombre es obligatorio.");
        return;
    }
    
    if (!perfilData.apellido.trim()) {
        alert("El apellido es obligatorio.");
        return;
    }

    // Validamos que haya fecha
    if (!perfilData.fechaNacimiento) {
        alert("La fecha de nacimiento es obligatoria.");
        return;
    }

    // Validamos formato de correo básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!perfilData.correo.trim() || !emailRegex.test(perfilData.correo)) {
        alert("Por favor ingresa un correo válido.");
        return;
    }

    // Validamos teléfono (opcional: que no esté vacío y tenga largo decente)
    if (!perfilData.telefono.trim() || perfilData.telefono.trim().length < 8) {
        alert("Por favor ingresa un teléfono válido.");
        return;
    }

    // --- FIN VALIDACIONES ---

    try {
      const payload = {
        nombre: perfilData.nombre,
        apellido: perfilData.apellido,
        correo: perfilData.correo,
        telefono: perfilData.telefono,
        fechaNacimiento: perfilData.fechaNacimiento ? `${perfilData.fechaNacimiento}T00:00:00` : null,
      };

      await axios.put(`${API_URL}/${perfilData.id}`, payload);
      
      alert('¡Perfil actualizado con éxito!');
      setIsEditing(false);
      
      // Actualizamos el nombre en el header/localStorage
      const usuarioSesion = JSON.parse(localStorage.getItem('usuario') || '{}');
      usuarioSesion.nombre = perfilData.nombre;
      usuarioSesion.apellido = perfilData.apellido;
      localStorage.setItem('usuario', JSON.stringify(usuarioSesion));

    } catch (error: any) {
      console.error("Error actualizando:", error);
      if (error.response && error.response.status === 400) {
        alert("Error: Revisa que los datos (especialmente el correo) sean correctos.");
      } else {
        alert("Error al guardar los cambios. Inténtalo de nuevo.");
      }
    }
  };

  const handleEnableEdition = () => {
    setIsEditing(true);
  };

  const handleClear = () => {
    setPerfilData(prev => ({
      ...prev,
      telefono: '',
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
              onLogout={handleLogout} // <--- Pasamos la función nueva aquí
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;