"use client";

import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { PromoCarousel } from "@/components/PromoCarousel";
import { products, testimonials } from "@/lib/products";

// ── Íconos SVG institucionales ──────────────────────────────────────────────
const IconMision = () => (
  <svg viewBox="0 0 160 130" className="w-full h-32">
    <rect x="0" y="0" width="160" height="130" rx="12" fill="#EFE7D8"/>
    <rect x="40" y="15" width="80" height="70" rx="4" fill="none" stroke="#B97A4D" strokeWidth="2"/>
    <line x1="55" y1="15" x2="55" y2="85" stroke="#C9A876" strokeWidth="1.2"/>
    <line x1="67" y1="15" x2="67" y2="85" stroke="#C9A876" strokeWidth="1.2"/>
    <line x1="79" y1="15" x2="79" y2="85" stroke="#C9A876" strokeWidth="1.2"/>
    <line x1="91" y1="15" x2="91" y2="85" stroke="#C9A876" strokeWidth="1.2"/>
    <line x1="103" y1="15" x2="103" y2="85" stroke="#C9A876" strokeWidth="1.2"/>
    <rect x="41" y="25" width="78" height="7" rx="1" fill="#B97A4D" opacity="0.6"/>
    <rect x="41" y="37" width="78" height="7" rx="1" fill="#7A7066" opacity="0.5"/>
    <rect x="41" y="49" width="78" height="7" rx="1" fill="#B97A4D" opacity="0.6"/>
    <rect x="41" y="61" width="55" height="7" rx="1" fill="#7A7066" opacity="0.35"/>
    <line x1="96" y1="61" x2="112" y2="72" stroke="#C9A876" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="113" cy="73" r="4" fill="#C9A876"/>
    <ellipse cx="52" cy="108" rx="14" ry="9" fill="#d4b896" transform="rotate(-15,52,108)"/>
    <ellipse cx="44" cy="102" rx="5" ry="7" fill="#d4b896" transform="rotate(-20,44,102)"/>
    <ellipse cx="60" cy="100" rx="4" ry="6" fill="#d4b896" transform="rotate(5,60,100)"/>
    <ellipse cx="108" cy="108" rx="14" ry="9" fill="#d4b896" transform="rotate(15,108,108)"/>
    <ellipse cx="116" cy="102" rx="5" ry="7" fill="#d4b896" transform="rotate(20,116,102)"/>
    <ellipse cx="100" cy="100" rx="4" ry="6" fill="#d4b896" transform="rotate(-5,100,100)"/>
  </svg>
);

const IconVision = () => (
  <svg viewBox="0 0 160 130" className="w-full h-32">
    <rect x="0" y="0" width="160" height="130" rx="12" fill="#EFE7D8"/>
    <circle cx="80" cy="36" r="18" fill="#C9A876" opacity="0.9"/>
    <line x1="80" y1="12" x2="80" y2="4" stroke="#C9A876" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="80" y1="60" x2="80" y2="68" stroke="#C9A876" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="56" y1="36" x2="48" y2="36" stroke="#C9A876" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="104" y1="36" x2="112" y2="36" stroke="#C9A876" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="63" y1="19" x2="57" y2="13" stroke="#C9A876" strokeWidth="2" strokeLinecap="round"/>
    <line x1="97" y1="19" x2="103" y2="13" stroke="#C9A876" strokeWidth="2" strokeLinecap="round"/>
    <line x1="63" y1="53" x2="57" y2="59" stroke="#C9A876" strokeWidth="2" strokeLinecap="round"/>
    <line x1="97" y1="53" x2="103" y2="59" stroke="#C9A876" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="22,105 65,60 108,105" fill="#B97A4D" opacity="0.35"/>
    <polygon points="52,105 90,50 128,105" fill="#7A7066" opacity="0.55"/>
    <polygon points="80,50 90,50 85,63 75,63" fill="#F4EFE5" opacity="0.9"/>
    <rect x="15" y="103" width="130" height="5" rx="2" fill="#B97A4D" opacity="0.4"/>
  </svg>
);

const IconOrigen = () => (
  <svg viewBox="0 0 160 130" className="w-full h-32">
    <rect x="0" y="0" width="160" height="130" rx="12" fill="#EFE7D8"/>
    <ellipse cx="78" cy="82" rx="36" ry="24" fill="#C9A876" opacity="0.75"/>
    <rect x="68" y="48" width="18" height="36" rx="9" fill="#C9A876" opacity="0.75"/>
    <ellipse cx="77" cy="42" rx="14" ry="12" fill="#C9A876" opacity="0.85"/>
    <ellipse cx="66" cy="33" rx="5" ry="9" fill="#C9A876" opacity="0.8" transform="rotate(-15,66,33)"/>
    <ellipse cx="88" cy="33" rx="5" ry="9" fill="#C9A876" opacity="0.8" transform="rotate(15,88,33)"/>
    <circle cx="71" cy="41" r="2.5" fill="#211712"/>
    <circle cx="72" cy="40" r="0.8" fill="#F4EFE5"/>
    <circle cx="83" cy="41" r="2.5" fill="#211712"/>
    <circle cx="84" cy="40" r="0.8" fill="#F4EFE5"/>
    <ellipse cx="77" cy="48" rx="5" ry="3" fill="#b89a6a" opacity="0.7"/>
    <rect x="52" y="98" width="10" height="18" rx="4" fill="#b89a6a" opacity="0.7"/>
    <rect x="66" y="100" width="10" height="16" rx="4" fill="#b89a6a" opacity="0.7"/>
    <rect x="82" y="100" width="10" height="16" rx="4" fill="#b89a6a" opacity="0.7"/>
    <rect x="96" y="98" width="10" height="18" rx="4" fill="#b89a6a" opacity="0.7"/>
    <ellipse cx="114" cy="80" rx="8" ry="12" fill="#C9A876" opacity="0.6" transform="rotate(20,114,80)"/>
    <path d="M50,78 Q60,70 70,78 Q80,70 90,78 Q100,70 110,78" fill="none" stroke="#b89a6a" strokeWidth="1.2" opacity="0.5"/>
    <path d="M50,86 Q60,78 70,86 Q80,78 90,86 Q100,78 110,86" fill="none" stroke="#b89a6a" strokeWidth="1.2" opacity="0.5"/>
  </svg>
);

// ── Datos sección institucional ─────────────────────────────────────────────
const institucional = [
  {
    title: "Misión",
    text: "Vestir con consciencia, sosteniendo a las familias tejedoras del altiplano cusqueño.",
    Icon: IconMision,
  },
  {
    title: "Visión",
    text: "Ser referente global de moda regenerativa hecha desde los Andes hacia el mundo.",
    Icon: IconVision,
  },
  {
    title: "Origen",
    text: "Nacimos en una comunidad de Cusco, tejiendo alpaca desde hace tres generaciones.",
    Icon: IconOrigen,
  },
];

// ── Página ──────────────────────────────────────────────────────────────────
export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-dark text-center py-2 px-4">
        <p className="text-[10px] tracking-[0.08em] uppercase">
          <span className="text-gold">🌿 Campaña de acceso anticipado</span>
          <span className="text-cream/90"> — Solo </span>
          <span className="text-terracotta font-medium">100 cupos exclusivos</span>
          <span className="text-cream/90"> disponibles</span>
        </p>
      </div>

      <NavBar />

      <main>
        {/* ── Hero ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow mb-4">Cusco Alpaca · Pre-launch</div>
            <h1 className="font-serif-display text-[42px] sm:text-[56px] leading-[1.05] text-dark">
              Lujo que{" "}
              <em className="text-terracotta not-italic font-serif-display italic">
                gives back.
              </em>
            </h1>
            <p className="text-[15px] sm:text-base text-muted leading-relaxed mt-5 max-w-md">
              Más que una prenda. Una elección consciente que protege ecosistemas
              andinos, apoya comunidades del Cusco y redefine la moda sostenible
              moderna.
            </p>
            <p className="text-[12px] text-terracotta mt-3">
              ✦ Beneficios exclusivos para los primeros 100 miembros
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/catalogo">
                <Button variant="primary">Acceso anticipado</Button>
              </Link>
              <Link href="/catalogo">
                <Button variant="outline">Ver colección</Button>
              </Link>
            </div>

            <div className="flex gap-8 mt-10 pt-8 border-t border-border-subtle">
              <div>
                <div className="font-serif-display text-2xl text-dark">87</div>
                <div className="text-[10px] text-muted uppercase tracking-wide mt-0.5">
                  Cupos restantes
                </div>
              </div>
              <div>
                <div className="font-serif-display text-2xl text-dark">100%</div>
                <div className="text-[10px] text-muted uppercase tracking-wide mt-0.5">
                  Fibra natural
                </div>
              </div>
              <div>
                <div className="font-serif-display text-2xl text-dark">0</div>
                <div className="text-[10px] text-muted uppercase tracking-wide mt-0.5">
                  Sintéticos
                </div>
              </div>
            </div>
          </div>

          <PromoCarousel />
        </section>

        {/* ── Institucional ── */}
        <section id="historia" className="bg-cream-deep py-16 sm:py-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="eyebrow mb-3">Nuestra historia</div>
              <h2 className="font-serif-display text-[28px] sm:text-[36px] leading-tight text-dark">
                Tres generaciones{" "}
                <em className="text-terracotta not-italic italic">tejiendo</em>{" "}
                futuro.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {institucional.map(({ title, text, Icon }) => (
                <div key={title} className="text-center">
                  <Icon />
                  <h3 className="text-[13px] font-medium text-dark mb-1.5 mt-4">
                    {title}
                  </h3>
                  <p className="text-[12px] text-muted leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Productos destacados ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="eyebrow mb-3">Productos destacados</div>
              <h2 className="font-serif-display text-[28px] sm:text-[32px] text-dark">
                Lo más buscado
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="text-[11px] uppercase tracking-[0.05em] text-terracotta hover:text-dark transition-colors whitespace-nowrap"
            >
              Ver todo →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-7">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── Testimonios ── */}
        <section className="bg-dark py-16 sm:py-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
            <div className="text-center mb-12">
              <div className="eyebrow mb-3">Testimonios</div>
              <h2 className="font-serif-display text-[28px] sm:text-[32px] text-cream">
                Voces que confían en nosotros
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div
                  key={t.author}
                  className="bg-cream/[0.06] border border-cream/15 rounded-lg p-6"
                >
                  <div className="text-gold text-sm mb-3">★★★★★</div>
                  <p className="text-[13px] text-cream/80 leading-relaxed mb-4">
                    &quot;{t.quote}&quot;
                  </p>
                  <p className="text-[11px] text-gold">
                    — {t.author}, {t.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contacto ── */}
        <section
          id="contacto"
          className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 sm:py-20 text-center"
        >
          <div className="eyebrow mb-3">Únete a la lista</div>
          <h2 className="font-serif-display text-[28px] sm:text-[36px] text-dark mb-4">
            Sé parte de los primeros 100.
          </h2>
          <p className="text-[14px] text-muted max-w-md mx-auto mb-8">
            Déjanos tu correo y recibe acceso anticipado, descuentos exclusivos y
            novedades de la colección.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tu nombre"
              className="flex-1 px-4 py-3 rounded-md border border-border-subtle bg-transparent text-[13px] placeholder:text-muted focus:border-terracotta outline-none transition-colors"
            />
            <input
              type="email"
              placeholder="Tu correo"
              className="flex-1 px-4 py-3 rounded-md border border-border-subtle bg-transparent text-[13px] placeholder:text-muted focus:border-terracotta outline-none transition-colors"
            />
            <Button variant="primary" type="submit">
              Unirme
            </Button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}