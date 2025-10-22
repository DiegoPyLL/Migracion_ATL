import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/estiloPerfil.css";
import PerfilCarousel from '../components/perfil/PerfilCarousel';
import PerfilForm, { PerfilData } from '../components/perfil/PerfilForm';

const PERFIL_DATA_KEY = 'perfilData';


//Datos Base 
const defaultPerfilData: PerfilData = {
  nombre: 'Juana Iglesias Torres',
  direccion: 'Palacio de Gitovia, San Petersburgo',
  correo: 'ju.torres@duocuc.cl',
  telefono: '+56 9 5657 7989',  
  comunicacion: 'WhatsApp',
  historial: 'upload'
};





const readStoredPerfilData = (): PerfilData => {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return { ...defaultPerfilData };
  }

  const stored = window.sessionStorage.getItem(PERFIL_DATA_KEY);

  if (!stored) {
    return { ...defaultPerfilData };
  }

  try {
    const parsed = JSON.parse(stored);
    return { ...defaultPerfilData, ...parsed };
  } catch (error) {
    console.warn('No se pudo parsear el perfil guardado en la sesion', error);
    return { ...defaultPerfilData };
  }
};





const Perfil = () => {
  const navigate = useNavigate();

  const [perfilData, setPerfilData] = useState(readStoredPerfilData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPerfilData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();





    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(PERFIL_DATA_KEY, JSON.stringify(perfilData));
      }
    } catch (error) {
      console.error('No se pudo guardar el perfil en la sesión', error);
    }

    console.log('Guardando cambios del perfil:', perfilData);
    alert('Perfil actualizado con éxito!');
    setIsEditing(false);
  };

  const handleEnableEdition = () => {
    setIsEditing(true);
  };

  const handleClear = () => {
    setPerfilData(prevData => ({
      ...prevData,
      direccion: '',
      telefono: '',
      correo: '',
      comunicacion: ''
    }));
  };








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
