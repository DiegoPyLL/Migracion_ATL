import React from "react";
import DoctorCard, { Doc } from "./DoctorCard";

const Spacer: React.FC<{ y?: number }> = ({ y = 5 }) => (
  <div className={`my-${y}`} aria-hidden="true" />
);

const medGen: Doc[] = [
  { nombre: "Dra. Ana Pérez", cargo: "Traumatóloga", desde: "2012", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_medgen_1.png?raw=true" },
  { nombre: "Dra. Juana Pérez", cargo: "Médico de familia", desde: "2010", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_medgen_2.png?raw=true" },
  { nombre: "Dra. Marcela Ruiz", cargo: "Ginecóloga", desde: "2015", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_medgen_3.png?raw=true" },
  { nombre: "Dra. Alejandra Peña", cargo: "Médico de atención primaria", desde: "2011", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_medgen_4.png?raw=true" },
  { nombre: "Dr. Ignacio Fuentes", cargo: "Traumatólogo", desde: "2013", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_medgen_5.png?raw=true" },
];

const cardio: Doc[] = [
  { nombre: "Dr. Juan Torres", cargo: "Cardiólogo", desde: "2012", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_cardio_2.png?raw=true" },
  { nombre: "Dra. Marcela Ruiz", cargo: "Cardióloga", desde: "2015", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_cardio_3.png?raw=true" },
  { nombre: "Dra. Ricarda Gómez", cargo: "Cardióloga", desde: "2016", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_cardio_4.png?raw=true" },
  { nombre: "Dra. Valentina Castro", cargo: "Cardióloga", desde: "2013", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_cardio_5.png?raw=true" },
];

const derma: Doc[] = [
  { nombre: "Dra. Ana Pérez", cargo: "Dermatóloga", desde: "2011", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_derma_1.png?raw=true" },
  { nombre: "Dr. Nicolás Díaz", cargo: "Dermatólogo", desde: "2012", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_derma_2.png?raw=true" },
  { nombre: "Dra. Isabel Soto", cargo: "Dermatóloga", desde: "2014", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_derma_3.png?raw=true" },
  { nombre: "Dr. Paulo Bravo", cargo: "Dermatólogo", desde: "2013", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_derma_4.png?raw=true" },
  { nombre: "Dra. Lorena Salazar", cargo: "Dermatóloga", desde: "2015", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_derma_5.png?raw=true" },
];

const pedi: Doc[] = [
  { nombre: "Dr. Gabriel Molina", cargo: "Pediatra", desde: "2010", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_pedi_1.png?raw=true" },
  { nombre: "Dra. Fernanda Morales", cargo: "Pediatra", desde: "2011", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_pedi_2.png?raw=true" },
  { nombre: "Dra. Natalia Carrasco", cargo: "Pediatra", desde: "2012", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_pedi_3.png?raw=true" },
];

const nutri: Doc[] = [
  { nombre: "Dra. Verónica Contreras", cargo: "Nutrióloga", desde: "2011", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_nutri_1.png?raw=true" },
  { nombre: "Dr. Felipe Lagos", cargo: "Nutriólogo", desde: "2012", img: "https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/doctor_nutri_2.png?raw=true" },
];

const EquipoMedico: React.FC = () => {
  return (
    <section className="container my-5 py-3">
      <hr className="mb-4" />
      <h1 className="fw-bold text-center mb-5">Nuestro Equipo Médico</h1>

      <h2 className="h2 mb-3">Medicina General</h2>
      <div className="row g-4 mb-5">
        {medGen.map(d => <DoctorCard key={d.nombre} {...d} />)}
      </div>

      <h2 className="h2 mb-3">Cardiología</h2>
      <div className="row g-4 mb-5">
        {cardio.map(d => <DoctorCard key={d.nombre} {...d} />)}
      </div>

      <h2 className="h2 mb-3">Dermatología</h2>
      <div className="row g-4 mb-5">
        {derma.map(d => <DoctorCard key={d.nombre} {...d} />)}
      </div>

      <h2 className="h2 mb-3">Pediatría</h2>
      <div className="row g-4 mb-5">
        {pedi.map(d => <DoctorCard key={d.nombre} {...d} />)}
      </div>

      <h2 className="h2 mb-3">Nutrición</h2>
      <div className="row g-4">
        {nutri.map(d => <DoctorCard key={d.nombre} {...d} />)}
      </div>

      <Spacer y={10} />
    </section>
  );
};

export default EquipoMedico;
