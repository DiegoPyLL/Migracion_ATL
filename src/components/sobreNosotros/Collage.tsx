import React, { useEffect, useRef } from "react";
import "../../styles/collage.css";

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
          <img src="public/images/clinica_2.png" alt="" />
        </div>
      </div>
      <div className="item span-3 effect-desat">
        <img src="public/images/clinica_6.png" alt="" />
      </div>
      <div className="item span-6 effect-rotate">
        <img src="public/images/clinica_7.png" alt="" />
      </div>
      <div className="item span-6 effect-desat parallax" data-speed="-0.08">
        <div className="parallax-inner">
          <img src="public/images/clinica_4.png" alt="" />
        </div>
      </div>
      <div className="item span-4 effect-zoom">
        <img src="public/images/clinica_10.png" alt="" />
      </div>
      <div className="item span-8 effect-desat">
        <img src="public/images/clinica_8.png" alt="" />
      </div>
    </section>
  );
};

export default Collage;

