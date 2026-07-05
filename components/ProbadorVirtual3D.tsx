"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { products, Product } from "@/lib/products";
import type { PrendaTipo, ColorPrenda } from "./Avatar3D";
import { Button } from "./Button";

// Carga dinámica — Three.js no puede ejecutarse en el servidor
const Avatar3D = dynamic(
  () => import("./Avatar3D").then((m) => ({ default: m.Avatar3D })),
  { ssr: false, loading: () => <AvatarPlaceholder /> }
);

function AvatarPlaceholder() {
  return (
    <div
      className="flex-1 rounded-xl flex items-center justify-center"
      style={{ minHeight: 520, background: "#1a1a2e" }}
    >
      <div className="text-center text-cream/60">
        <div
          className="w-8 h-8 border-2 border-cream/20 border-t-cream/70 rounded-full animate-spin mx-auto mb-2"
          style={{ borderTopColor: "#C9A876" }}
        />
        <p className="text-[11px]">Cargando avatar 3D…</p>
      </div>
    </div>
  );
}

const COLOR_OPTIONS: { key: ColorPrenda; hex: string; label: string }[] = [
  { key: "tierra", hex: "#a08e6c", label: "Tierra" },
  { key: "verde",  hex: "#3a4032", label: "Verde andino" },
  { key: "negro",  hex: "#1d1611", label: "Negro" },
  { key: "gris",   hex: "#7A7066", label: "Gris" },
];

const PRENDA_MAP: Record<string, PrendaTipo> = {
  "chompa-qhata": "chompa",
  "poncho-inti":  "poncho",
  "saco-yawar":   "saco",
};

function calcTalla(altura: number, contextura: string): string {
  if (altura < 158) return contextura === "robusta" ? "M" : "S";
  if (altura < 168) return contextura === "robusta" ? "L" : "M";
  if (altura < 178) return contextura === "robusta" ? "XL" : "M";
  return contextura === "robusta" ? "XL" : "L";
}

interface Props {
  initialProduct?: Product;
}

export function ProbadorVirtual3D({ initialProduct }: Props) {
  const availableProducts = products.filter(
    (p) => p.stock !== "agotado" && PRENDA_MAP[p.id]
  );

  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct && PRENDA_MAP[initialProduct.id]
      ? initialProduct
      : availableProducts[0]
  );
  const [color, setColor]           = useState<ColorPrenda>("tierra");
  const [altura, setAltura]         = useState(170);
  const [contextura, setContextura] = useState<"delgada" | "media" | "robusta">("media");
  const [showPicker, setShowPicker] = useState(false);

  const prenda: PrendaTipo = PRENDA_MAP[selectedProduct.id] ?? "chompa";
  const tallaSugerida      = useMemo(() => calcTalla(altura, contextura), [altura, contextura]);

  return (
    <main className="max-w-[1280px] mx-auto px-6 sm:px-10 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6 text-[11px] text-muted">
        <Link href="/" className="hover:text-dark transition-colors">Inicio</Link>
        <ChevronRight size={11} />
        <span className="text-dark">Probador virtual 3D</span>
      </nav>

      <div className="eyebrow mb-2">Probador virtual 3D</div>
      <h1 className="font-serif-display text-[32px] sm:text-[40px] text-dark mb-1.5">
        Descubre cómo te queda.
      </h1>
      <p className="text-[13px] text-muted mb-8 max-w-lg">
        Ajusta las medidas del avatar, selecciona la prenda y el color para
        visualizar el ajuste en tiempo real antes de comprar.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

        {/* ── Vista 3D ── */}
        <div className="flex flex-col" style={{ minHeight: 600 }}>
          <Avatar3D
            prenda={prenda}
            color={color}
            altura={altura}
            contextura={contextura}
          />
        </div>

        {/* ── Panel de controles ── */}
        <div className="flex flex-col gap-4">

          {/* Selector de prenda */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-3">Prenda</p>
            <div className="relative">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-full flex items-center justify-between border border-border-subtle bg-cream rounded-lg px-3 py-2.5 text-[12px] text-dark"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded flex-shrink-0"
                    style={{ background: selectedProduct.gradient }}
                  />
                  {selectedProduct.name}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-muted transition-transform ${showPicker ? "rotate-180" : ""}`}
                />
              </button>

              {showPicker && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-cream border border-border-subtle rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                  {availableProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedProduct(p); setShowPicker(false); }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-left transition-colors hover:bg-cream-deep ${
                        p.id === selectedProduct.id ? "bg-cream-deep font-medium" : ""
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded flex-shrink-0"
                        style={{ background: p.gradient }}
                      />
                      {p.name}
                      <span className="ml-auto text-terracotta">S/ {p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Color */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-3">Color</p>
            <div className="flex gap-2.5 flex-wrap">
              {COLOR_OPTIONS.map(({ key, hex, label }) => (
                <button
                  key={key}
                  onClick={() => setColor(key)}
                  title={label}
                  aria-label={label}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                    color === key ? "ring-2 ring-offset-2 ring-dark" : ""
                  }`}
                  style={{ background: hex, border: "1px solid #E0D7C8" }}
                />
              ))}
            </div>
            <p className="text-[10px] text-muted mt-2">
              {COLOR_OPTIONS.find((c) => c.key === color)?.label}
            </p>
          </div>

          {/* Medidas */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-3">Tus medidas</p>

            <label className="text-[11px] text-muted">Altura</label>
            <div className="flex items-center gap-2 mt-1 mb-3">
              <input
                type="range"
                min={150} max={195} step={1}
                value={altura}
                onChange={(e) => setAltura(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-[12px] font-medium text-dark w-14 text-right">
                {altura} cm
              </span>
            </div>

            <label className="text-[11px] text-muted">Contextura</label>
            <div className="flex gap-2 mt-1.5">
              {(["delgada", "media", "robusta"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setContextura(c)}
                  className={`flex-1 text-[11px] py-1.5 rounded-md border capitalize transition-colors ${
                    contextura === c
                      ? "bg-dark text-cream border-dark"
                      : "border-border-subtle text-dark hover:border-dark"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Talla sugerida */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-1">Talla sugerida</p>
            <div className="flex items-end gap-3">
              <span className="font-serif-display text-[48px] leading-none text-dark">
                {tallaSugerida}
              </span>
              <div className="mb-1">
                <p className="text-[10px] text-muted">Para {altura} cm</p>
                <p className="text-[10px] text-muted capitalize">{contextura}</p>
              </div>
            </div>
            <p className="text-[10px] text-muted mt-2 leading-relaxed">
              La alpaca tiene ligera elasticidad natural — el ajuste es la guía,
              no la talla exacta.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <Link href={`/producto/${selectedProduct.id}`}>
              <Button variant="primary" fullWidth>
                Ver producto → Comprar
              </Button>
            </Link>
            <Link href="/catalogo">
              <Button variant="outline" fullWidth>
                Explorar catálogo
              </Button>
            </Link>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-border-subtle p-4 space-y-2">
            {[
              "El avatar usa proporciones anatómicas reales",
              "Arrastra para rotar · scroll para zoom",
              "Tu foto no se sube ni se almacena",
            ].map((tip) => (
              <p key={tip} className="flex gap-2 text-[11px] text-muted">
                <span className="text-gold flex-shrink-0">✦</span>
                {tip}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
