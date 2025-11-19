import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloPerfil.css';

// Componentes
import PerfilCarousel from '../components/perfil/PerfilCarousel';
import PerfilForm from '../components/perfil/PerfilForm';
import MisSeguros, { Seguro } from '../components/perfil/MisSeguros';
import MisCitas, { Cita } from '../components/perfil/MisCitas';

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

  // Estados de Datos
  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: ''
  });
  const [listaSeguros, setListaSeguros] = useState<Seguro[]>([]);
  const [listaCitas, setListaCitas] = useState<Cita[]>([]);

  // URLs de las 3 APIs
  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';
  const DOCTORES_API_URL = 'http://localhost:8082/api/v1/doctores'; // Para obtener nombres
  const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';
  const CITAS_API_URL = 'http://localhost:8080/api/v1/citas';

  // --- 1. CARGAR DATOS (USUARIO + SEGUROS + CITAS + DOCTORES) ---
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
        // A) Cargar Datos del Usuario
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

        // B) Cargar Seguros
        try {
            const respSeguros = await axios.get(`${SEGUROS_API_URL}/usuario/${userId}`);
            setListaSeguros(respSeguros.data || []);
        } catch (e) { console.warn("Sin seguros o API Seguros apagada"); }

        // C) Cargar Citas + Doctores (Magia de Cruzamiento)
        try {
            // 1. Pedimos las citas (Tienen ID doctor pero no nombre)
            const respCitas = await axios.get(`${CITAS_API_URL}/usuario/${userId}`);
            const citasRaw = respCitas.data || [];

            if (citasRaw.length > 0) {
                // 2. Pedimos la lista de doctores reales (Tienen nombres)
                const respDoctores = await axios.get(DOCTORES_API_URL);
                const doctoresReales = respDoctores.data;

                // 3. Cruzamos los datos
                const citasCompletas = citasRaw.map((cita: any) => {
                    // Buscamos el doctor real usando el ID que viene en la cita
                    // La cita puede traer 'idDoctor' o 'doctor.id', revisamos ambos
                    const doctorIdEnCita = cita.idDoctor || (cita.doctor ? cita.doctor.id : null);
                    
                    const doctorReal = doctoresReales.find((d: any) => d.id === doctorIdEnCita);

                    // Reconstruimos la cita con el nombre correcto
                    return {
                        id: cita.id,
                        fechaCita: cita.fechaCita,
                        estado: cita.estado,
                        doctor: {
                            id: doctorIdEnCita,
                            usuario: {
                                nombre: doctorReal ? doctorReal.usuario.nombre : "Doctor",
                                apellido: doctorReal ? doctorReal.usuario.apellido : "No Encontrado"
                            }
                        }
                    };
                });

                setListaCitas(citasCompletas);
            } else {
                setListaCitas([]);
            }

        } catch (e) { 
            console.error("Error cargando citas:", e); 
            // Si falla, dejamos la lista vacía pero no rompemos la página
            setListaCitas([]);
        }

      } catch (error) { 
        console.error("Error general:", error); 
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  // --- ACCIONES ---

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleCancelSeguro = async (idSeguro: number) => {
    try {
        await axios.patch(`${SEGUROS_API_URL}/${idSeguro}/cancelacion`, { motivo: "Web" });
        setListaSeguros(prev => prev.map(s => s.id === idSeguro ? { ...s, estado: "CANCELADO" } : s));
        alert("Seguro cancelado.");
    } catch (error) { alert("Error al cancelar seguro."); }
  };

  const handleCancelCita = async (idCita: number) => {
    try {
        await axios.delete(`${CITAS_API_URL}/${idCita}`);
        setListaCitas(prev => prev.filter(c => c.id !== idCita));
        alert("Cita cancelada correctamente.");
    } catch (error) {
        console.error("Error al cancelar cita:", error);
        alert("Error al cancelar la cita.");
    }
  };

  // --- FORMULARIO PERFIL ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prev => ({ ...prev, [id]: value }));
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
      alert('Perfil actualizado.');
      setIsEditing(false);
    } catch (error) { alert("Error al guardar."); }
  };

  const handleEnableEdition = () => setIsEditing(true);
  const handleClear = () => setPerfilData(prev => ({ ...prev, telefono: '' }));

  if (loading) return <div className="text-center mt-5 p-5">Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <div className="container-fluid perfil-wrapper">
        <div className="perfil-card">
          
          {/* BLOQUE 1: DATOS PERSONALES */}
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

          {/* BLOQUE 2: LISTA DE CITAS (PRIORIDAD) */}
          <div className="row g-0 px-4 pb-4">
             <div className="col-12">
                <MisCitas 
                    citas={listaCitas} 
                    onCancel={handleCancelCita} 
                />
             </div>
          </div>

          {/* BLOQUE 3: LISTA DE SEGUROS */}
          <div className="row g-0 px-4 pb-2">
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