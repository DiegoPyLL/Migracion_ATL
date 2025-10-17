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
      "https://videos.openai.com/vg-assets/assets%2Ftask_01jvkhd5xteqht1x9her0pv7kp%2Ftask_01jvkhd5xteqht1x9her0pv7kp_genid_27437689-7dbd-4521-bd73-890f60bbbeb7_25_05_19_05_49_543844%2Fvideos%2F00000_441907361%2Fsource.mp4",
    title: "Seguro de Vida Individual",
    desc: "Protección adaptada a tus necesidades individuales",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01jpcdmq5gex1t8xkc0v8ftr2d%2Ftask_01jpcdmq5gex1t8xkc0v8ftr2d_genid_be9d7977-90fa-44d4-b2dc-71cc6a273614_25_03_15_08_10_495352%2Fvideos%2F00000_892802068%2Fsource.mp4",
    title: "Seguro de Vida Individual Premium",
    desc: "Cobertura amplia para todas tus necesidades",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01jmj8dfwpfcjstcdp9v3qfr74%2Ftask_01jmj8dfwpfcjstcdp9v3qfr74_genid_ebe7c03f-cdd4-4b90-b3d9-c566ffbc2108_25_02_20_18_03_375265%2Fvideos%2F00000_865811061%2Fsource.mp4",
    title: "Seguro de Vida Familiar",
    desc: "Cobertura completa en caso de fallecimiento.",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01jpmc4gg8fj99d352mvye56j0%2Ftask_01jpmc4gg8fj99d352mvye56j0_genid_b9f3b7b2-2d2f-47bb-ae72-1f085d4c57dc_25_03_18_10_18_462065%2Fvideos%2F00000_838008698%2Fsource.mp4",
    title: "Seguro de Vida Estudiante",
    desc: "Protección económica adaptada a jóvenes y estudiantes",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01k59z3vyrf3ka85228c27czmg%2Ftask_01k59z3vyrf3ka85228c27czmg_genid_98a0f595-0a90-4efa-9bde-7ef936a59023_25_09_16_19_13_915084%2Fvideos%2F00000_236821057%2Fsource.mp4",
    title: "Seguro de Vida Senior",
    desc: "Plan pensado para adultos mayores",
    ctaTo: "/comprar-seguro-vida",
  },
  {
    video:
      "https://videos.openai.com/vg-assets/assets%2Ftask_01k2swy3c6ejr9n7sdmj558abj%2Ftask_01k2swy3c6ejr9n7sdmj558abj_genid_6d9ccd22-220f-40ae-8fc8-788562222e27_25_08_16_16_57_520996%2Fvideos%2F00000_418447774%2Fsource.mp4",
    title: "Seguro de Vida Senior Premium",
    desc: "Cobertura total con asistencia extendida",
    ctaTo: "/comprar-seguro-vida",
  },
];

export default function VidaCarousel(): React.ReactElement {
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

