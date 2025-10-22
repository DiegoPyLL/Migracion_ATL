import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/estiloPerfil.css";
import PerfilCarousel from '../components/perfil/PerfilCarousel';
import PerfilForm, { PerfilData } from '../components/perfil/PerfilForm';
import SegurosContratadosList, { SeguroContratado } from '../components/perfil/SegurosContratadosList';

const PERFIL_DATA_KEY = 'perfilData';


//Datos Base 
const defaultPerfilData: PerfilData = {
  nombre: 'Juana Iglesias Negras',
  direccion: 'Palacio de Gitovia, San Petersburgo',
  telefono: '+7 999 1917 1917',
  correo: 'correogenerico@Duocuc.cl',
  comunicacion: 'Mensajes misticos via commit',
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
      console.error('No se pudo guardar el perfil en la sesion', error);
    }

    console.log('Guardando cambios del perfil:', perfilData);
    alert('Perfil actualizado con exito!');
    setIsEditing(false);
    navigate('/');
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












  const segurosContratados = useMemo<SeguroContratado[]>(() => ([
    {
      id: 1,
      nombre: 'Seguro Salud Integral',
      descripcion: 'Cobertura medica completa con atencion a domicilio y telemedicina.',
      precio: 55000
    },
    {
      id: 2,
      nombre: 'Seguro Vida Familiar',
      descripcion: 'Proteccion de vida con beneficio para todo el grupo familiar.',
      precio: 72000
    },
    {
      id: 3,
      nombre: 'Seguro Dental Premium',
      descripcion: 'Consultas ilimitadas y cobertura completa de ortodoncia y periodoncia.',
      precio: 38000
    }
  ]), []);

  const totalSeguros = useMemo(
    () => segurosContratados.reduce((acc, seguro) => acc + seguro.precio, 0),
    [segurosContratados]
  );

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

      <div className="container-fluid perfil-wrapper mt-5 seguros-contratados">
        <SegurosContratadosList seguros={segurosContratados} total={totalSeguros} />
      </div>
    </div>
  );
};

export default Perfil;
