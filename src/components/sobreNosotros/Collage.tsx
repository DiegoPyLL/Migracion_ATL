import React, { useEffect, useRef } from "react";
import "../../styles/sobreNosotros/collage.css";

const Collage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => {
      const root = rootRef.current;
      if (!root) return;
      root.querySelectorAll<HTMLElement>(".parallax").forEach((el) => {
        const speed = Number((el as HTMLElement).dataset.speed || 0);
        const y = window.scrollY * speed;
        const inner = el.querySelector<HTMLElement>(".parallax-inner");
        if (inner) inner.style.transform = `translateY(${y}px)`;
      });
    };
    window.addEventListener("scroll", handler, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener("scroll", handler as EventListener);
  }, []);

  return (
    <section className="collage" id="collage" ref={rootRef}>
      <div className="item span-9 effect-scale parallax" data-speed="0.12">
        <div className="parallax-inner">
          <img src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/clinica_10.png?raw=true" alt="" />
        </div>
      </div>
      <div className="item span-3 effect-desat">
        <img src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/clinica_6.png?raw=true" alt="" />
      </div>
      <div className="item span-6 effect-rotate">
        <img src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/clinica_7.png?raw=true" alt="" />
      </div>
      <div className="item span-6 effect-desat parallax" data-speed="-0.08">
        <div className="parallax-inner">
          <img src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/clinica_4.png?raw=true" alt="" />
        </div>
      </div>
      <div className="item span-4 effect-zoom">
        <img src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/clinica_10.png?raw=true" alt="" />
      </div>
      <div className="item span-8 effect-desat">
        <img src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/clinica_8.png?raw=true" alt="" />
      </div>
    </section>
  );
};

export default Collage;

