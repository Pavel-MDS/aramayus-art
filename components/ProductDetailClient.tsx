"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Share2, ChevronRight, Minus, Plus } from "lucide-react";
import { Product } from "@/lib/products";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";

const TABS = ["Detalles", "Cuidados", "Envíos", "Reseñas"] as const;
type Tab = (typeof TABS)[number];

const TAB_CONTENT: Record<Tab, React.ReactNode> = {
  Detalles: (
    <ul className="space-y-2.5 text-[13px] text-muted leading-relaxed">
      <li>✦ &nbsp;100% fibra de alpaca baby cusqueña</li>
      <li>✦ &nbsp;Tejido a mano por artesanas de Chinchero</li>
      <li>✦ &nbsp;Libre de químicos y sintéticos</li>
      <li>✦ &nbsp;Certificado de origen Cusco, Perú</li>
      <li>✦ &nbsp;Prenda única, con pequeñas variaciones naturales del tejido</li>
    </ul>
  ),
  Cuidados: (
    <ul className="space-y-2.5 text-[13px] text-muted leading-relaxed">
      <li>✦ &nbsp;Lavar a mano en agua fría</li>
      <li>✦ &nbsp;No usar blanqueador ni suavizante</li>
      <li>✦ &nbsp;Secar extendida en superficie plana</li>
      <li>✦ &nbsp;No estrujar ni torcer</li>
      <li>✦ &nbsp;Guardar en bolsa de tela, no en plástico</li>
    </ul>
  ),
  Envíos: (
    <ul className="space-y-2.5 text-[13px] text-muted leading-relaxed">
      <li>✦ &nbsp;Envío nacional: 3–5 días hábiles</li>
      <li>✦ &nbsp;Envío internacional: 10–15 días hábiles</li>
      <li>✦ &nbsp;Empaque artesanal 100% reciclable</li>
      <li>✦ &nbsp;Número de seguimiento vía WhatsApp</li>
      <li>✦ &nbsp;Cambios aceptados dentro de 15 días</li>
    </ul>
  ),
  Reseñas: (
    <div className="space-y-4">
      {[
        { author: "Valeria M.", loc: "Lima", text: "La calidad supera cualquier expectativa. La uso todos los días en invierno." },
        { author: "Renzo T.", loc: "Cusco", text: "El tejido es impresionante. Se nota el trabajo artesanal en cada detalle." },
        { author: "Camila S.", loc: "Arequipa", text: "Pedí la talla M y le quedó perfecto. El color es exactamente como en las fotos." },
      ].map((r) => (
        <div key={r.author} className="border-b border-border-subtle pb-4 last:border-0">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <span className="text-[12px] font-medium text-dark">{r.author}</span>
              <span className="text-[11px] text-muted ml-1.5">— {r.loc}</span>
            </div>
            <span className="text-gold text-xs">★★★★★</span>
          </div>
          <p className="text-[12px] text-muted leading-relaxed">{r.text}</p>
        </div>
      ))}
    </div>
  ),
};

const stockInfo = {
  disponible: { label: "En stock", className: "text-status-ok" },
  "ultimas-unidades": { label: "Últimas unidades", className: "text-status-low" },
  agotado: { label: "Agotado", className: "text-status-low" },
};

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.find((s) => !product.unavailableSizes?.includes(s)) ?? null
  );
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("Detalles");
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Placeholder gradients para simular 4 ángulos de foto
  const galleryImages = product.images && product.images.length > 0
  ? product.images
  : null;

  const stock = stockInfo[product.stock];
  const isSoldOut = product.stock === "agotado";

  function handleAddToCart() {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  }

  return (
    <main className="max-w-[1280px] mx-auto px-6 sm:px-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 py-5 text-[11px] text-muted">
        <Link href="/" className="hover:text-dark transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/catalogo" className="hover:text-dark transition-colors">Catálogo</Link>
        <ChevronRight size={12} />
        <span className="text-dark">{product.name}</span>
      </nav>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 pb-16">

        {/* Galería izquierda */}
        <div>
          {/* Imagen principal */}
          <div className="relative w-full aspect-[4/5] rounded-xl mb-3 overflow-hidden bg-cream-deep">
            {galleryImages ? (
              <Image
                src={galleryImages[activeImage]}
                alt={`${product.name} — vista ${activeImage + 1}`}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0" style={{ background: product.gradient }} />
            )}
            {product.isNew && (
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block bg-terracotta text-cream text-[10px] px-2.5 py-1 rounded">
                  Nuevo
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2.5">
            {galleryImages && galleryImages.length > 1 && (
              <div className="flex gap-2.5 mt-2.5">
                {galleryImages.map((src, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    className={`relative flex-1 aspect-square rounded-md overflow-hidden transition-all ${
                      activeImage === i ? "ring-2 ring-dark ring-offset-1" : "opacity-60 hover:opacity-100"
                    }`}>
                    <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info derecha */}
        <div className="flex flex-col">
          <div className="eyebrow mb-2">Alpaca 100% · Cusco</div>

          <h1 className="font-serif-display text-[32px] sm:text-[40px] leading-tight text-dark">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-2 mb-4">
            <span className="text-gold text-sm">{"★".repeat(product.rating)}</span>
            <span className="text-[11px] text-muted">
              ({product.reviewCount} reseñas)
            </span>
          </div>

          <div className="font-serif-display text-[28px] text-terracotta mb-1">
            S/ {product.price.toFixed(2)}
          </div>

          <p className="text-[13px] text-muted leading-relaxed mb-6 max-w-md">
            {product.description}
          </p>

          {/* Selector de color */}
          <div className="mb-5">
            <p className="text-[11px] text-dark mb-2">
              Color: <strong className="font-medium">Variante {selectedColor + 1}</strong>
            </p>
            <div className="flex gap-2">
              {product.colors.map((hex, i) => (
                <button
                  key={hex}
                  onClick={() => setSelectedColor(i)}
                  aria-label={`Color ${i + 1}`}
                  className={`w-7 h-7 rounded-full transition-all ${
                    selectedColor === i
                      ? "ring-2 ring-offset-2 ring-dark"
                      : "hover:scale-110"
                  }`}
                  style={{ background: hex, border: "0.5px solid #E0D7C8" }}
                />
              ))}
            </div>
          </div>

          {/* Selector de talla */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-dark">Talla</p>
              <button className="text-[10px] text-terracotta hover:text-dark transition-colors">
                Guía de tallas →
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => {
                const disabled = product.unavailableSizes?.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => !disabled && setSelectedSize(size)}
                    disabled={disabled}
                    className={`min-w-[42px] h-10 px-3 rounded-md text-[11px] border transition-colors
                      ${disabled
                        ? "border-border-subtle text-muted/40 cursor-not-allowed line-through"
                        : selectedSize === size
                        ? "bg-dark text-cream border-dark"
                        : "border-border-subtle text-dark hover:border-dark"
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock + cantidad */}
          <div className="flex items-center justify-between mb-6">
            <p className={`text-[11px] ${stock.className}`}>
              ● {stock.label}
              {product.stock === "ultimas-unidades" && product.stockCount
                ? ` — quedan ${product.stockCount}`
                : product.stock === "disponible" && product.stockCount
                ? ` — ${product.stockCount} disponibles`
                : ""}
            </p>

            {!isSoldOut && (
              <div className="flex items-center gap-2 border border-border-subtle rounded-md">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 flex items-center justify-center text-dark hover:bg-cream-deep transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="text-[13px] w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  className="w-9 h-9 flex items-center justify-center text-dark hover:bg-cream-deep transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 mb-4">
            <Button
              variant="primary"
              fullWidth
              onClick={handleAddToCart}
              disabled={isSoldOut || !selectedSize}
            >
              {addedToCart
                ? "✦ Agregado al carrito"
                : isSoldOut
                ? "Agotado"
                : "Agregar al carrito"}
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push(`/probador?producto=${product.id}`)}
            >
              Probar virtualmente
            </Button>
          </div>

          {/* Wishlist + share */}
          <div className="flex gap-4 pt-1">
            <button
              onClick={() => setWished(!wished)}
              className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                wished ? "text-terracotta" : "text-muted hover:text-dark"
              }`}
            >
              <Heart size={13} fill={wished ? "currentColor" : "none"} />
              {wished ? "Guardado" : "Guardar"}
            </button>
            <button className="flex items-center gap-1.5 text-[11px] text-muted hover:text-dark transition-colors">
              <Share2 size={13} />
              Compartir
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="mt-10 border-t border-border-subtle pt-6">
            <div className="flex gap-6 mb-5 border-b border-border-subtle">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[12px] transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "text-dark border-b-[1.5px] border-dark -mb-px"
                      : "text-muted hover:text-dark"
                  }`}
                >
                  {tab === "Reseñas" ? `${tab} (${product.reviewCount})` : tab}
                </button>
              ))}
            </div>
            <div className="pt-1">{TAB_CONTENT[activeTab]}</div>
          </div>
        </div>
      </div>

      {/* ── Productos relacionados ── */}
      {related.length > 0 && (
        <section className="border-t border-border-subtle pt-12 pb-16">
          <div className="eyebrow mb-3">También te puede gustar</div>
          <h2 className="font-serif-display text-[24px] text-dark mb-8">
            Otras prendas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
