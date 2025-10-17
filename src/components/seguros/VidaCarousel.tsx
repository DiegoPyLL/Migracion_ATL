import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/segurosCarousels.css";

type Slide = {
  video: string;
  title: string;
  desc: string;
  ctaTo: string;
};

const slides: Slide[] = [
  {
    video: "/videos/Video_de_segundos_sin_barras.mp4",
    title: "Seguro de Vida Individual",
    desc: "Protecci\u00F3n ajustada a tus metas personales y familiares.",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video: "/videos/playa.mp4",
    title: "Seguro de Vida Individual Premium",
    desc: "Cobertura ampliada con beneficios adicionales para toda tu etapa laboral.",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video: "/videos/familiaFeliz_1.mp4",
    title: "Seguro de Vida Familiar",
    desc: "Tranquilidad econ\u00F3mica para quienes m\u00E1s amas si algo ocurre.",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video: "/videos/Joven_en_Restaurante_de_Playa.mp4",
    title: "Seguro de Vida Estudiante",
    desc: "Apoyo financiero flexible pensado para j\u00F3venes y estudiantes.",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video: "/videos/Video_De_Atardecer_En_La_Playa.mp4",
    title: "Seguro de Vida Senior",
    desc: "Dise\u00F1ado para mayores, con coberturas preferenciales y servicios de asistencia.",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video: "/videos/lluvia.mp4",
    title: "Seguro de Vida Senior Premium",
    desc: "Protecci\u00F3n integral para disfrutar cada etapa con respaldo garantizado.",
    ctaTo: "/comprar-seguro-vida",
  },
];

const VidaCarousel: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const count = slides.length;
  const prev = () => setIdx((i) => (i - 1 + count) % count);
  const next = () => setIdx((i) => (i + 1) % count);

  return (
    <div className="sc-carousel">
      <div className="sc-viewport">
        {slides.map((s, i) => (
          <div key={i} className={`sc-slide ${i === idx ? "active" : ""}`}>
            <video src={s.video} autoPlay muted loop playsInline className="sc-video" />
            <div className="sc-caption">
              <h5>{s.title}</h5>
              <p>{s.desc}</p>
              <Link to={s.ctaTo} className="btn btn-primary">
                Contratar Seguro
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button aria-label="Anterior" className="sc-prev" onClick={prev}>
        &#10094;
      </button>
      <button aria-label="Siguiente" className="sc-next" onClick={next}>
        &#10095;
      </button>

      <div className="sc-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`sc-dot ${i === idx ? "active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VidaCarousel;