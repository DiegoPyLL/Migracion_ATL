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
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01jrdbct23fb7r09jsrds9fha6%2Ftask_01jrdbct23fb7r09jsrds9fha6_genid_dc1aef72-b171-4932-a8c7-113070fbf580_25_04_09_13_26_156928%2Fvideos%2F00000_610388680%2Fsource.mp4",
    title: "Seguro de Salud Básico",
    desc: "Plan económico, cubre consultas y medicamentos esenciales.",
    ctaTo: "/comprar-seguro-salud",
  },
  {
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01jt2zvfkyedzsfa2fkce5c3kk%2Ftask_01jt2zvfkyedzsfa2fkce5c3kk_genid_752a4b00-a440-4ea8-84c8-ada1ec6f52fb_25_04_30_09_19_114187%2Fvideos%2F00000_730232400%2Fsource.mp4",
    title: "Seguro de Salud Avanzado",
    desc: "Cobertura extendida con especialistas, chequeos preventivos y urgencias.",
    ctaTo: "/comprar-seguro-salud",
  },
  {
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01k0pxeh57e71sj54frfa9q86q%2Ftask_01k0pxeh57e71sj54frfa9q86q_genid_812b5145-1c33-4a56-af2c-cf190c0e6067_25_07_21_16_36_095906%2Fvideos%2F00000_528914953%2Fsource.mp4",
    title: "Seguro de Salud Premium",
    desc: "Cobertura completa. Incluye consultas, hospitalización y emergencias.",
    ctaTo: "/comprar-seguro-salud",
  },
  {
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01jn2qfbrvf28rfdgdns982xwv%2Ftask_01jn2qfbrvf28rfdgdns982xwv_genid_407e2e80-0731-4cfd-923e-cc005ff8a980_25_02_27_03_34_425850%2Fvideos%2F00000_317979549%2Fsource.mp4",
    title: "Seguro de Salud Empresarial",
    desc: "Plan para empleados con atención médica completa y programas de bienestar.",
    ctaTo: "/comprar-seguro-salud",
  },
];

export default function SaludCarousel(): React.ReactElement {
  const [idx, setIdx] = useState(0);
  const count = slides.length;
  const prev = () => setIdx((i) => (i - 1 + count) % count);
  const next = () => setIdx((i) => (i + 1) % count);

  return (
    <div className="sc-carousel">
      <div className="sc-viewport">
        {slides.map((s, i) => (
          <div
            key={i}
            className="sc-slide"
            style={{ transform: `translateX(${(i - idx) * 100}%)` }}
          >
            <video
              src={s.video}
              autoPlay
              muted
              loop
              playsInline
              className="sc-video"
            />
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
        ‹
      </button>
      <button aria-label="Siguiente" className="sc-next" onClick={next}>
        ›
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
}

