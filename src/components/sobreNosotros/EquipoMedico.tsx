import React, { useEffect, useState } from "react";
import DoctorCard, { Doc } from "./DoctorCard";
import { doctoresApi, DoctorDto } from "../../services/doctoresApi";

type Section = { titulo: string; resumen: string; docs: Doc[] };

const photoPool = [    
  "/images/doctor_medgen_1.png",
  "/images/doctor_medgen_2.png",
  "/images/doctor_medgen_3.png",
  "/images/doctor_medgen_4.png",
  "/images/doctor_medgen_5.png",

  "/images/doctor_cardio_1.png",
  "/images/doctor_cardio_2.png",    
  "/images/doctor_cardio_3.png",
  "/images/doctor_cardio_4.png",
  "/images/doctor_cardio_5.png",

  "/images/doctor_pedi_1.png",
  "/images/doctor_pedi_2.png",
  "/images/doctor_pedi_3.png",
  "/images/doctor_pedi_4.png",

  "/images/doctor_derma_1.png",
  "/images/doctor_derma_2.png",
  "/images/doctor_derma_3.png",
  "/images/doctor_derma_4.png",
  "/images/doctor_derma_5.png",

  "/images/doctor_nutri_1.png",
  "/images/doctor_nutri_2.png",
  "/images/doctor_nutri_3.png",
  "/images/doctor_nutri_4.png",

  "/images/doctor_psico_1.png",
  "/images/doctor_psico_2.png",
  "/images/doctor_psico_3.png",
  "/images/doctor_psico_4.png",
  "/images/doctor_psico_5.png",
];


const buildSections = (items: DoctorDto[]): Section[] => {
  const grouped: Record<string, Doc[]> = {};
  let counter = 0;

  items.forEach((doc) => {
    const specialty = doc.especialidad || "Especialidad";
    const nombre =
      doc.nombreCompleto ||
      `${doc.usuario?.nombre ?? "Doctor"} ${doc.usuario?.apellido ?? ""}`.trim() ||
      "Doctor/a";
    const desde = 2014 + (counter % 8);
    const foto = photoPool[counter % photoPool.length];

    const doctorCard: Doc = {
      nombre,
      cargo: specialty,
      desde: `${desde}`,
      img: foto,
    };

    if (!grouped[specialty]) grouped[specialty] = [];
    grouped[specialty].push(doctorCard);
    counter++;
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([titulo, docs]) => ({
      titulo,
      resumen: `Especialistas en ${titulo.toLowerCase()}.`,
      docs,
    }));
};

const EquipoMedico: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const apiDocs = await doctoresApi.getAll();
        if (!isMounted) return;
        setSections(buildSections(apiDocs));
      } catch (err) {
        console.error("No se pudieron cargar los doctores (sobre nosotros)", err);
        if (!isMounted) return;
        setError("No pudimos actualizar el equipo en línea.");
        setSections([]);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="equipo-bg py-5">
      <div className="container-fluid px-4 px-lg-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold mt-3 lh-1">Nuestro Equipo Médico</h1>
          {error && <p className="text-danger small mb-0">{error}</p>}
        </div>

        {sections.map((section) => (
          <article key={section.titulo} className="mb-5 px-3 px-lg-5">
            <div className="section-head d-flex flex-column flex-lg-row align-items-lg-end justify-content-lg-between gap-2 mb-3">
              <h2 className="h4 fw-bold mb-0">{section.titulo}</h2>
              <p className="text-muted mb-0">{section.resumen}</p>
            </div>

            <div className="row g-4">
              {section.docs.map((doc) => (
                <div
                  key={`${section.titulo}-${doc.nombre}`}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                >
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
