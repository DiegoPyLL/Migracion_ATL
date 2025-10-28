import type { PerfilData } from '../components/perfil/PerfilForm';

export const PERFIL_DATA_KEY = 'perfilData';


//PlaceHolders
export const defaultPerfilData: PerfilData = {
  nombre: 'Juana Iglesias Torres',
  direccion: 'Palacio de Gitovia, San Petersburgo',
  correo: 'ju.torres@duocuc.cl',
  telefono: '+56 9 5657 7989',
  comunicacion: 'WhatsApp',
  historial: 'upload',
};


//Comprueba si el navegador puede usar sessionStorage sin errores.
//Sirve para evitar fallos al acceder a sessionStorage
const isSessionStorageAvailable = (): boolean => {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return false;
  }

  try {
    const testKey = '__perfil_storage_test__';
    window.sessionStorage.setItem(testKey, '1');
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};



// Leer datos del perfil desde sessionStorage
export const readStoredPerfilData = (): PerfilData => {
  if (!isSessionStorageAvailable()) {
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



// Modifica los datos existenetes del perfil en sessionStorage
export const savePerfilData = (data: Partial<PerfilData>): PerfilData => {
  const mergedData = { ...defaultPerfilData, ...data };

  if (!isSessionStorageAvailable()) {
    return mergedData;
  }

  try {
    window.sessionStorage.setItem(PERFIL_DATA_KEY, JSON.stringify(mergedData));
  } catch (error) {
    console.error('No se pudo guardar el perfil en la sesion', error);
  }

  return mergedData;
};
