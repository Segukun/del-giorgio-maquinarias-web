import { useEffect, useState } from "react";
import "../styles/hero.css";

const SLIDES = [
  {
    image: "/hero-combine.jpg",
    title: "DEL GIORGIO MAQUINARIAS",
    subtitle: "Maquinaria agrícola nueva y usada",
  },
  {
    image: "/hero-tractor.jpg",
    title: "TRACTORES DE ÚLTIMA GENERACIÓN",
    subtitle: "Potencia y tecnología para tu campo",
  },
  {
    image: "/hero-used.jpg",
    title: "EQUIPOS USADOS REVISADOS",
    subtitle: "Listos para trabajar desde el primer día",
  },
];

const AUTO_MS = 6000;

const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, []);

  const goTo = (i) => setActive(i);
  const prev = () => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setActive((i) => (i + 1) % SLIDES.length);

  const whatsappHref =
    "https://wa.me/5493468123456?text=" +
    encodeURIComponent("Hola, quisiera consultar por maquinaria agrícola.");

  return (
    <section className="dg-hero">
      <div className="dg-hero__slides">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.image}
            className={`dg-hero__slide ${i === active ? "is-active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      <div className="dg-hero__overlay" />

      <button className="dg-hero__arrow dg-hero__arrow--left" onClick={prev} aria-label="Anterior">
        &#8249;
      </button>
      <button className="dg-hero__arrow dg-hero__arrow--right" onClick={next} aria-label="Siguiente">
        &#8250;
      </button>

      <div className="dg-hero__content">
        <h1 className="dg-hero__title">{SLIDES[active].title}</h1>
        <p className="dg-hero__subtitle">{SLIDES[active].subtitle}</p>

        <div className="dg-hero__actions">
          <a href="/nuevos" className="dg-btn dg-btn--primary">
            Ver catálogo <span aria-hidden>→</span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="dg-btn dg-btn--outline"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </div>

      <div className="dg-hero__dots">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.image}
            className={`dg-hero__dot ${i === active ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
