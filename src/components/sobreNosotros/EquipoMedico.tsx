import React from "react";
import DoctorCard, { Doc } from "./DoctorCard";

const medGen: Doc[] = [
  { nombre: "Dra. Ana Pérez", cargo: "Traumatóloga", desde: "2012", img: "/images/doctor_medgen_1.png" },
  { nombre: "Dra. Juana Pérez", cargo: "Médico de familia", desde: "2010", img: "/images/doctor_medgen_2.png" },
  { nombre: "Dra. Marcela Ruiz", cargo: "Ginecóloga", desde: "2015", img: "/images/doctor_medgen_3.png" },
  { nombre: "Dra. Alejandra Peña", cargo: "Médico de atención primaria", desde: "2011", img: "/images/doctor_medgen_4.png" },
  { nombre: "Dr. Ignacio Fuentes", cargo: "Traumatólogo", desde: "2013", img: "/images/doctor_medgen_5.png" },
];

const cardio: Doc[] = [
  { nombre: "Dr. Juan Torres", cargo: "Cardiólogo", desde: "2012", img: "/images/doctor_cardio_2.png" },
  { nombre: "Dra. Marcela Ruiz", cargo: "Cardióloga", desde: "2015", img: "/images/doctor_cardio_3.png" },
  { nombre: "Dra. Ricarda Gómez", cargo: "Cardióloga", desde: "2016", img: "/images/doctor_cardio_4.png" },
  { nombre: "Dra. Valentina Castro", cargo: "Cardióloga", desde: "2013", img: "/images/doctor_cardio_5.png" },
];

const derma: Doc[] = [
  { nombre: "Dra. Ana Pérez", cargo: "Dermatóloga", desde: "2011", img: "/images/doctor_derma_1.png" },
  { nombre: "Dr. Nicolás Díaz", cargo: "Dermatólogo", desde: "2012", img: "/images/doctor_derma_2.png" },
  { nombre: "Dra. Isabel Soto", cargo: "Dermatóloga", desde: "2014", img: "/images/doctor_derma_3.png" },
  { nombre: "Dr. Paulo Bravo", cargo: "Dermatólogo", desde: "2013", img: "/images/doctor_derma_4.png" },
  { nombre: "Dra. Lorena Salazar", cargo: "Dermatóloga", desde: "2015", img: "/images/doctor_derma_5.png" },
];

const pedi: Doc[] = [
  { nombre: "Dr. Gabriel Molina", cargo: "Pediatra", desde: "2010", img: "/images/doctor_pedi_1.png" },
  { nombre: "Dra. Fernanda Morales", cargo: "Pediatra", desde: "2011", img: "/images/doctor_pedi_2.png" },
  { nombre: "Dra. Natalia Carrasco", cargo: "Pediatra", desde: "2012", img: "/images/doctor_pedi_3.png" },
];

const nutri: Doc[] = [
  { nombre: "Dra. Verónica Contreras", cargo: "Nutrióloga", desde: "2011", img: "/images/doctor_nutri_1.png" },
  { nombre: "Dr. Felipe Lagos", cargo: "Nutriólogo", desde: "2012", img: "/images/doctor_nutri_2.png" },
];

const sections: { titulo: string; resumen: string; docs: Doc[] }[] = [
  { titulo: "Medicina General", resumen: "Diagnóstico integral y acompañamiento para toda la familia.", docs: medGen },
  { titulo: "Cardiología", resumen: "Especialistas en cuidar tu corazón con tecnología de punta.", docs: cardio },
  { titulo: "Dermatología", resumen: "Tratamientos personalizados para el bienestar de tu piel.", docs: derma },
  { titulo: "Pediatría", resumen: "Atención cercana para los más pequeños del hogar.", docs: pedi },
  { titulo: "Nutrición", resumen: "Planes alimenticios adaptados a tu estilo de vida.", docs: nutri },
];

const EquipoMedico: React.FC = () => {
  return (
    <section className="equipo-bg py-5">
  <div className="container-fluid px-4 px-lg-5">
    <div className="text-center mb-5">
      <span className="badge rounded-pill text-primary-emphasis bg-primary-subtle fw-semibold px-3 py-2 shadow-sm">
        Profesionales a tu lado
      </span>
      <h1 className="fw-bold mt-3 lh-1">Nuestro Equipo Médico</h1>
      <p className="text-muted mb-0">
        Acompañamiento integral con calidez y excelencia clínica.
      </p>
    </div>

    {sections.map((section) => (
      <article key={section.titulo} className="mb-5 px-3 px-lg-5">
        <div className="section-head d-flex flex-column flex-lg-row align-items-lg-end justify-content-lg-between gap-2 mb-3">
          <h2 className="h4 fw-bold mb-0">{section.titulo}</h2>
          <p className="text-muted small mb-0">{section.resumen}</p>
        </div>

        <div className="row g-4">
          {section.docs.map((doc) => (
            <div key={doc.nombre} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm hover-lift">
                <DoctorCard {...doc} />
              </div>
            </div>
          ))}
        </div>
      </article>
    ))}
  </div>
</section>

  );
};

export default EquipoMedico;

