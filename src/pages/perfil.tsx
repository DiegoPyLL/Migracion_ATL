import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloPerfil.css';
import PerfilCarousel from '../components/perfil/PerfilCarousel';
import PerfilForm from '../components/perfil/PerfilForm';
import MisSeguros, { Seguro } from '../components/perfil/MisSeguros'; 

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

  // Estado de Usuario
  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: ''
  });

  // Estado de Seguros (Lista)
  const [listaSeguros, setListaSeguros] = useState<Seguro[]>([]);

  // URLs de las APIs
  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';
  const SEGUROS_API_URL = 'http://localhost:8081/api/v1/seguros';

  // --- 1. CARGAR DATOS (USUARIO + SEGUROS) ---
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
        // Llamada 1: Datos del Usuario (Puerto 8082)
        const respUsuario = await axios.get(`${USUARIOS_API_URL}/${userId}`);
        const u = respUsuario.data;

        setPerfilData({
          id: u.id,
          nombre: u.nombre || '',
          apellido: u.apellido || '',
          correo: u.correo || '',
          telefono: u.telefono || '',
          fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : '',
          rol: u.rol
        });

        // Llamada 2: Seguros Contratados (Puerto 8081)
        // Usamos el endpoint findByUsuarioId de tu Backend
        const respSeguros = await axios.get(`${SEGUROS_API_URL}/usuario/${userId}`);
        setListaSeguros(respSeguros.data);

      } catch (error: any) {
        console.error("Error cargando datos:", error);
        // Si falla seguros, no rompemos todo, solo dejamos la lista vacía
        if (error.response && error.response.status === 404) {
             // Es normal si no tiene seguros
             setListaSeguros([]); 
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  // --- LÓGICA DE CERRAR SESIÓN ---
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  // --- LÓGICA DE CANCELAR SEGURO ---
  const handleCancelSeguro = async (idSeguro: number) => {
    try {
        // Llamamos al endpoint PATCH de tu controlador Java
        await axios.patch(`${SEGUROS_API_URL}/${idSeguro}/cancelacion`, {
            motivo: "Cancelado por el usuario desde la web"
        });
        
        // Actualizamos la lista visualmente sin recargar
        setListaSeguros(prevLista => prevLista.map(seg => 
            seg.id === idSeguro ? { ...seg, estado: "CANCELADO" } : seg
        ));
        
        alert("Seguro cancelado correctamente.");
    } catch (error) {
        console.error("Error al cancelar:", error);
        alert("No se pudo cancelar el seguro. Intente más tarde.");
    }
  };

  // --- MANEJO DEL FORMULARIO DE PERFIL ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!perfilData.id) return;

    try {
      const payload = {
        nombre: perfilData.nombre,
        apellido: perfilData.apellido,
        correo: perfilData.correo,
        telefono: perfilData.telefono,
        fechaNacimiento: perfilData.fechaNacimiento ? `${perfilData.fechaNacimiento}T00:00:00` : null,
      };

      await axios.put(`${USUARIOS_API_URL}/${perfilData.id}`, payload);
      alert('¡Perfil actualizado con éxito!');
      setIsEditing(false);
      
      const usuarioSesion = JSON.parse(localStorage.getItem('usuario') || '{}');
      usuarioSesion.nombre = perfilData.nombre;
      usuarioSesion.apellido = perfilData.apellido;
      localStorage.setItem('usuario', JSON.stringify(usuarioSesion));

    } catch (error) {
      alert("Error al guardar los cambios.");
    }
  };

  const handleEnableEdition = () => setIsEditing(true);
  const handleClear = () => setPerfilData(prev => ({ ...prev, telefono: '' }));

  if (loading) return <div className="text-center mt-5 p-5">Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <div className="container-fluid perfil-wrapper">
        <div className="perfil-card">
          
          {/* SECCIÓN SUPERIOR: FORMULARIO + CAROUSEL */}
          <div className="row align-items-start g-0 mb-5">
            <PerfilCarousel />
            <PerfilForm
              perfilData={perfilData}
              isEditing={isEditing}
              onChange={handleChange}
              onEnableEdition={handleEnableEdition}
              onClear={handleClear}
              onSubmit={handleSubmit}
              onLogout={handleLogout}
            />
          </div>

          {/* SECCIÓN INFERIOR: LISTA DE SEGUROS (NUEVO) */}
          <div className="row g-0 px-4 pb-4">
             <div className="col-12">
                <MisSeguros 
                    seguros={listaSeguros} 
                    onCancel={handleCancelSeguro} 
                />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Perfil;