import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/estiloPerfil.css';

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

  // --- ESTADOS ---
  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: ''
  });
  
  // [NUEVO] Estado para guardar la copia original (Backup)
  const [originalData, setOriginalData] = useState<PerfilData | null>(null);

  const [listaSeguros, setListaSeguros] = useState<Seguro[]>([]);
  const [listaCitas, setListaCitas] = useState<Cita[]>([]);

  const USUARIOS_API_URL = 'http://localhost:8082/api/v1/usuarios';
  const DOCTORES_API_URL = 'http://localhost:8082/api/v1/doctores';
  const SEGUROS_API_URL = 'http://localhost:8084/api/v1/seguros';
  const CITAS_API_URL = 'http://localhost:8080/api/v1/citas';

  // --- 1. CARGAR DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioSesion = localStorage.getItem('usuario');
      if (!usuarioSesion) { navigate('/login'); return; }

      const usuarioObj = JSON.parse(usuarioSesion);
      const userId = usuarioObj.userId || usuarioObj.id;

      try {
        // A) Usuario
        const respUsuario = await axios.get(`${USUARIOS_API_URL}/${userId}`);
        const u = respUsuario.data;
        
        const datosCargados = {
          id: u.id,
          nombre: u.nombre || '',
          apellido: u.apellido || '',
          correo: u.correo || '',
          telefono: u.telefono || '', // Aseguramos que no sea null
          fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : '',
          rol: u.rol
        };

        setPerfilData(datosCargados);
        setOriginalData(datosCargados); // [IMPORTANTE] Guardamos el backup aquí

        // B) Seguros
        try {
            const respSeguros = await axios.get(`${SEGUROS_API_URL}/usuario/${userId}`);
            setListaSeguros(respSeguros.data || []);
        } catch (e) { console.warn("Sin seguros"); }

        // C) Citas
        try {
            const respCitas = await axios.get(`${CITAS_API_URL}/usuario/${userId}`);
            const citasRaw = respCitas.data || [];
            if (citasRaw.length > 0) {
                const respDoctores = await axios.get(DOCTORES_API_URL);
                const doctoresReales = respDoctores.data;
                const citasCompletas = citasRaw.map((cita: any) => {
                    const doctorIdEnCita = cita.idDoctor || (cita.doctor ? cita.doctor.id : null);
                    const doctorReal = doctoresReales.find((d: any) => d.id === doctorIdEnCita);
                    return {
                        id: cita.id, fechaCita: cita.fechaCita, horaInicio: cita.horaInicio, estado: cita.estado,
                        doctor: { id: doctorIdEnCita, usuario: { nombre: doctorReal ? doctorReal.usuario.nombre : "Doctor", apellido: doctorReal ? doctorReal.usuario.apellido : "No encontrado" } }
                    };
                });
                setListaCitas(citasCompletas);
            } else { setListaCitas([]); }
        } catch (e) { setListaCitas([]); }

      } catch (error) { console.error("Error general:", error); } finally { setLoading(false); }
    };

    cargarDatos();
  }, [navigate]);

  // --- ACCIONES ---
  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/login'); };

  const handleCancelSeguro = async (idSeguro: number) => {
    if (!confirm("¿Cancelar seguro?")) return;
    try {
        await axios.patch(`${SEGUROS_API_URL}/${idSeguro}/cancelacion`, { motivo: "Web" });
        setListaSeguros(prev => prev.map(s => s.id === idSeguro ? { ...s, estado: "CANCELADO" } : s));
    } catch (error) { alert("Error al cancelar seguro."); }
  };

  const handleCancelCita = async (idCita: number) => {
    if (!confirm("¿Cancelar cita?")) return;
    try {
        await axios.delete(`${CITAS_API_URL}/${idCita}`);
        setListaCitas(prev => prev.filter(c => c.id !== idCita));
        alert("Cita cancelada.");
    } catch (error) { alert("Error al cancelar cita."); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prev => ({ ...prev, [id]: value }));
  };

  // [CORREGIDO] Función Restaurar (Antes borraba, ahora restaura)
  const handleRestore = () => {
    if (originalData) {
        setPerfilData(originalData); // Volvemos a la copia original
        alert("Cambios revertidos a los valores guardados.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!perfilData.id) return;
    if (!perfilData.nombre.trim() || !perfilData.apellido.trim() || !perfilData.correo.trim()) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      const payload = {
        nombre: perfilData.nombre, apellido: perfilData.apellido, correo: perfilData.correo,
        telefono: perfilData.telefono,
        fechaNacimiento: perfilData.fechaNacimiento ? `${perfilData.fechaNacimiento}T00:00:00` : null,
      };
      await axios.put(`${USUARIOS_API_URL}/${perfilData.id}`, payload);
      alert('Perfil actualizado exitosamente.');
      setIsEditing(false);
      
      // Actualizamos también el backup por si quiere restaurar de nuevo después
      setOriginalData(perfilData);

      const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
      sesion.nombre = perfilData.nombre; sesion.apellido = perfilData.apellido;
      localStorage.setItem('usuario', JSON.stringify(sesion));

    } catch (error) { alert("Error al guardar cambios."); }
  };

  if (loading) return <div className="text-center mt-5 p-5">Cargando...</div>;

  return (
    <div className="perfil-container">
      <div className="container-fluid px-lg-5 py-5">
        <div className="perfil-card">
          <div className="row align-items-start g-0 mb-5">
            <PerfilCarousel />
            <PerfilForm
              perfilData={perfilData}
              isEditing={isEditing}
              onChange={handleChange}
              onEnableEdition={() => setIsEditing(true)}
              onClear={handleRestore} // [CORREGIDO] Usamos la función nueva
              onSubmit={handleSubmit}
              onLogout={handleLogout}
            />
          </div>
          <div className="row g-0 px-4 pb-4"><div className="col-12"><MisCitas citas={listaCitas} onCancel={handleCancelCita} /></div></div>
          <div className="row g-0 px-4 pb-2"><div className="col-12"><MisSeguros seguros={listaSeguros} onCancel={handleCancelSeguro} /></div></div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;