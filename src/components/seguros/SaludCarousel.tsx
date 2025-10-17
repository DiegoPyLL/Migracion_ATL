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
    video: "/videos/Cl\u00EDnica_Tranquila_con_Vista_Panor\u00E1mica.mp4",
    title: "Seguro de Salud B\u00E1sico",
    desc: "Plan econ\u00F3mico que cubre consultas y medicamentos esenciales.",
    ctaTo: "/comprar-seguro-salud",
  },
  {
    video: "/videos/Ahora_un_video_202510171539.mp4",
    title: "Seguro de Salud Avanzado",
    desc: "Cobertura extendida con especialistas, chequeos preventivos y urgencias.",
    ctaTo: "/comprar-seguro-salud",
  },
  {
    video: "/videos/Video_de_Accidente_Vehicular_Generado.mp4",
    title: "Seguro de Salud Premium",
    desc: "Protecci\u00F3n completa: consultas, hospitalizaci\u00F3n y emergencias.",
    ctaTo: "/comprar-seguro-salud",
  },
  {
    video: "/videos/Ahora_un_video_202510171543.mp4",
    title: "Seguro de Salud Empresarial",
    desc: "Plan para colaboradores con atenci\u00F3n integral y programas de bienestar.",
    ctaTo: "/comprar-seguro-salud",
  },
];

const SaludCarousel: React.FC = () => {
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

export default SaludCarousel;