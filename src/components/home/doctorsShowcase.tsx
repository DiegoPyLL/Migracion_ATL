import React from "react";
import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import { FaStethoscope, FaHeartbeat, FaUserMd, FaMicroscope } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import "../../styles/doctorsShowcase.css";
type Doctor = {
  name: string;
  specialty: string;
  description: string;
  icon: IconType;
  highlight: string;
  schedule: string;
  accent: string;
};
const doctors: Doctor[] = [
  {
    name: "Dra. Ana L\u00f3pez",
    specialty: "Medicina General",
    description:
      "Coordina los planes preventivos y acompa\u00f1a a las familias en controles peri\u00f3dicos.",
    icon: FaStethoscope,
    highlight: "10 a\u00f1os de experiencia",
    schedule: "Disponible esta semana",
    accent: "linear-gradient(135deg, #d6ecff 0%, #f2f8ff 100%)",
  },
  {
    name: "Dr. Mart\u00edn Salazar",
    specialty: "Cardiolog\u00eda",
    description:
      "Especialista en chequeos cardiacos y programas de recuperaci\u00f3n activa.",
    icon: FaHeartbeat,
    highlight: "Unidad Coraz\u00f3n Saludable",
    schedule: "Agenda mi\u00e9rcoles y viernes",
    accent: "linear-gradient(135deg, #ffe7e0 0%, #fff5f1 100%)",
  },
  {
    name: "Dra. Camila R\u00edos",
    specialty: "Pediatr\u00eda Integral",
    description:
      "Gu\u00eda a los m\u00e1s peque\u00f1os con un enfoque c\u00e1lido y personalizado para cada familia.",
    icon: FaUserMd,
    highlight: "Consultas familiares",
    schedule: "Turnos ma\u00f1ana y tarde",
    accent: "linear-gradient(135deg, #e8f8f1 0%, #f4fffb 100%)",
  },
  {
    name: "Dr. Felipe Arancibia",
    specialty: "Medicina Interna",
    description:
      "Apoya diagn\u00f3sticos complejos y coordina tratamientos junto a especialistas.",
    icon: FaMicroscope,
    highlight: "Referente en casos integrales",
    schedule: "Pr\u00f3ximas horas martes",
    accent: "linear-gradient(135deg, #ede7ff 0%, #f7f4ff 100%)",
  },
];
const DoctorsShowcase: React.FC = () => {
  return (
    <section className="doctors-section" aria-labelledby="doctors-section-title">
      <div className="doctors-wrapper">
        <span className="doctors-kicker">Nuestro equipo</span>
        <h2 id="doctors-section-title">Conoce a nuestros especialistas</h2>
        <p className="doctors-lead">
          Profesionalismo, cercan\u00eda y tecnolog\u00eda para cuidar de tu salud en cada etapa
          de la vida.
        </p>
        <div className="doctors-grid">
          {doctors.map(
            ({ name, specialty, description, icon: Icon, highlight, schedule, accent }) => (
              <article key={name} className="doctor-card">
                <div className="doctor-hero" style={{ background: accent }}>
                  <Icon className="doctor-icon" aria-hidden="true" />
                  <span className="doctor-highlight">{highlight}</span>
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