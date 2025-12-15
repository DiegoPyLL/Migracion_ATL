import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import { FaStethoscope, FaHeartbeat, FaUserMd, FaMicroscope } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { doctoresApi, DoctorDto } from "../../services/doctoresApi";
import "../../styles/doctorsShowcase.css";

type DoctorCardData = {
  id?: number;
  name: string;
  specialty: string;
  description: string;
  icon: IconType;
  highlight: string;
  schedule: string;
  accent: string;
  img: string;
};

const visuals = [
  { img: "/images/doctor_medgen_1.png", accent: "linear-gradient(135deg, #d6ecff 0%, #f2f8ff 100%)", icon: FaStethoscope },
  { img: "/images/doctor_cardio_2.png", accent: "linear-gradient(135deg, #ffe7e0 0%, #fff5f1 100%)", icon: FaHeartbeat },
  { img: "/images/doctor_pedi_1.png", accent: "linear-gradient(135deg, #e8f8f1 0%, #f4fffb 100%)", icon: FaUserMd },
  { img: "/images/doctor_medgen_5.png", accent: "linear-gradient(135deg, #ede7ff 0%, #f7f4ff 100%)", icon: FaMicroscope },
  { img: "/images/doctor_derma_3.png", accent: "linear-gradient(135deg, #fef6ff 0%, #fff8fc 100%)", icon: FaUserMd },
  { img: "/images/doctor_nutri_1.png", accent: "linear-gradient(135deg, #f1fff6 0%, #f8fffb 100%)", icon: FaHeartbeat },
];

const fallbackDocs: DoctorDto[] = [
  { id: 1, nombreCompleto: "Dra. Ana López", especialidad: "Medicina General" },
  { id: 2, nombreCompleto: "Dr. Martín Salazar", especialidad: "Cardiología" },
  { id: 3, nombreCompleto: "Dr. Aleksei Ivanov", especialidad: "Pediatría Integral" },
  { id: 4, nombreCompleto: "Dr. Felipe Arancibia", especialidad: "Medicina Interna" },
];

const buildCards = (items: DoctorDto[]): DoctorCardData[] =>
  items.map((doc, idx) => {
    const visual = visuals[idx % visuals.length];
    const name =
      doc.nombreCompleto ||
      `${doc.usuario?.nombre ?? "Doctor"} ${doc.usuario?.apellido ?? ""}`.trim() ||
      "Doctor/a";
    const specialty = doc.especialidad || "Especialidad no disponible";

    return {
      id: doc.id ?? doc.idDoctor ?? doc.doctorId,
      name,
      specialty,
      description: `Atiende en ${specialty.toLowerCase()}.`,
      icon: visual.icon,
      highlight: `Especialista en ${specialty}`,
      schedule: "Agenda disponible",
      accent: visual.accent,
      img: visual.img,
    };
  });

const DoctorsShowcase: React.FC = () => {
  const [cards, setCards] = useState<DoctorCardData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const apiDocs = await doctoresApi.getAll();
        if (!isMounted) return;
        const mapped = buildCards(apiDocs);
        setCards(mapped.length ? mapped.slice(0, 4) : buildCards(fallbackDocs));
      } catch (err) {
        console.error("No se pudieron cargar los doctores", err);
        if (!isMounted) return;
        setError("No pudimos actualizar la lista en línea.");
        setCards(buildCards(fallbackDocs));
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCards = cards.length ? cards : buildCards(fallbackDocs);

  return (
    <section className="doctors-section" aria-labelledby="doctors-section-title">
      <div className="doctors-wrapper">
        <h2 id="doctors-section-title">Conoce a nuestros especialistas</h2>
        {error && <p className="doctor-error">{error}</p>}

        <div className="doctors-grid">
          {visibleCards.map(
            ({ id, name, specialty, description, icon: Icon, highlight, schedule, accent, img }) => (
              <article key={id ?? name} className="doctor-card">
                <div className="doctor-hero" style={{ background: accent }}>
                  <span className="doctor-highlight">{highlight}</span>
                  <Icon className="doctor-icon" aria-hidden="true" />
                  <img className="doctor-photo" src={img} alt={`Foto de ${name}`} />
                </div>
                <div className="doctor-body">
                  <h3>{name}</h3>
                  <p className="doctor-specialty">{specialty}</p>
                  <p className="doctor-description">{description}</p>
                </div>
                <div className="doctor-footer">
                  <span className="doctor-schedule">{schedule}</span>
                  <Link
                    className="doctor-link"
                    to="/pedir-hora"
                    aria-label={`Ver disponibilidad de ${name}`}
                  >
                    Ver disponibilidad
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorsShowcase;
