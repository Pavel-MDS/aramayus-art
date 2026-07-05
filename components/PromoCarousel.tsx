"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    eyebrow: "Colección 2026",
    title: "Alpaca cusqueña tejida a mano",
    image: "/banners/banner-1.jpg",
  },
  {
    eyebrow: "Envío gratis",
    title: "En tu primera compra",
    image: "/banners/banner-2.jpg",
  },
  {
    eyebrow: "Edición limitada",
    title: "Ropa hecho 100% fibra de alpaca",
    image: "/banners/banner-3.jpg",
  },
];

export function PromoCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[active];

  return (
    <div className="relative h-[220px] sm:h-[320px] rounded-xl overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src={slide.image}
        alt={slide.title}
        fill
        className="object-cover transition-opacity duration-700"
        priority
      />

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-dark/40" />

      {/* Badge Aramayu */}
      <div className="absolute top-4 right-4 bg-dark/70 text-cream px-3.5 py-2.5 rounded-md z-10">
        <div className="eyebrow text-[8px] mb-0.5">Cusco, Perú</div>
        <div className="font-serif-display text-base leading-none">Aramayu</div>
        <div className="text-[10px] text-cream/70 mt-0.5">Colección sostenible · 2026</div>
      </div>

      {/* Texto del slide */}
      <div className="absolute bottom-4 left-5 text-cream z-10">
        <div className="eyebrow text-[9px] mb-1">{slide.eyebrow}</div>
        <div className="font-serif-display text-xl sm:text-2xl">{slide.title}</div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-5 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === active ? "w-5 bg-gold" : "w-2 bg-cream/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}