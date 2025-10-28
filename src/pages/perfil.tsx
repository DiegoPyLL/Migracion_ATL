import React, { useState } from 'react';
import '../styles/estiloPerfil.css';
import PerfilCarousel from '../components/perfil/PerfilCarousel';
import PerfilForm from '../components/perfil/PerfilForm';
import { readStoredPerfilData, savePerfilData } from '../utils/perfilStorage';


const Perfil = () => {
  const [perfilData, setPerfilData] = useState(readStoredPerfilData);
  const [isEditing, setIsEditing] = useState(false);


  //perimitir la edición de los datos del perfil
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setPerfilData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };


  //Fucnión que permite modificar los datos del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = savePerfilData(perfilData);
    setPerfilData(updatedData);

    console.log('Guardando cambios del perfil:', updatedData);
    alert('Perfil actualizado con exito!');
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
      comunicacion: '',
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

