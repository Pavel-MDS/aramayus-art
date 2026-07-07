"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown, ChevronRight, Camera, Upload, X } from "lucide-react";
import { products, Product } from "@/lib/products";
import type { PrendaTipo, ColorPrenda } from "./Avatar3D";
import { Button } from "./Button";

// Carga dinámica — Three.js solo en el browser
const Avatar3D = dynamic(
  () => import("./Avatar3D").then((m) => ({ default: m.Avatar3D })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 rounded-xl flex items-center justify-center"
        style={{ minHeight: 520, background: "#1a1a2e" }}>
        <div className="text-center text-cream/60">
          <div className="w-8 h-8 border-2 border-t-gold rounded-full animate-spin mx-auto mb-2"
            style={{ borderColor: "rgba(201,168,118,0.2)", borderTopColor: "#C9A876" }} />
          <p className="text-[11px]">Cargando avatar 3D…</p>
        </div>
      </div>
    ),
  }
);

// Mapa de producto → tipo de prenda 3D
const PRENDA_MAP: Record<string, PrendaTipo> = {
  "chompa-qhata": "chompa",
  "poncho-inti":  "poncho",
  "saco-yawar":   "saco",
};

const COLOR_OPTIONS: { key: ColorPrenda; hex: string; label: string }[] = [
  { key: "tierra", hex: "#a08e6c", label: "Tierra" },
  { key: "verde",  hex: "#3a4032", label: "Verde andino" },
  { key: "negro",  hex: "#1d1611", label: "Negro" },
  { key: "gris",   hex: "#7A7066", label: "Gris" },
];

function calcTalla(h: number, ctx: string) {
  if (h < 158) return ctx === "robusta" ? "M" : "S";
  if (h < 168) return ctx === "robusta" ? "L" : "M";
  if (h < 178) return ctx === "robusta" ? "XL" : "M";
  return ctx === "robusta" ? "XL" : "L";
}

export function ProbadorVirtual3D({ initialProduct }: { initialProduct?: Product }) {
  const available = products.filter((p) => p.stock !== "agotado" && PRENDA_MAP[p.id]);

  const [selected, setSelected]     = useState<Product>(
    initialProduct && PRENDA_MAP[initialProduct.id] ? initialProduct : available[0]
  );
  const [color, setColor]           = useState<ColorPrenda>("tierra");
  const [altura, setAltura]         = useState(170);
  const [contextura, setContextura] = useState<"delgada" | "media" | "robusta">("media");
  const [showPicker, setShowPicker] = useState(false);

  // Face swap
  const [fotoUrl, setFotoUrl]       = useState<string | null>(null);
  const fotoInputRef                = useRef<HTMLInputElement>(null);

  // Textura de ropa (Etapa 2)
  const [clothTex, setClothTex]     = useState<string | null>(null);
  const clothInputRef               = useRef<HTMLInputElement>(null);

  const prenda: PrendaTipo = PRENDA_MAP[selected.id] ?? "chompa";
  const talla              = useMemo(() => calcTalla(altura, contextura), [altura, contextura]);

  // ── Carga de foto del usuario ─────────────────────────────────────────────
  const onFotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFotoUrl(url);
  }, []);

  const onClothChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setClothTex(url);
  }, []);

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
        Sube tu foto para personalizar el avatar, selecciona la prenda y ajusta
        tus medidas para ver el ajuste en tiempo real.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

        {/* ── Vista 3D ── */}
        <div className="flex flex-col" style={{ minHeight: 600 }}>
          <Avatar3D
            prenda={prenda}
            color={color}
            altura={altura}
            contextura={contextura}
            fotoUrl={fotoUrl}
          />
        </div>

        {/* ── Panel ── */}
        <div className="flex flex-col gap-4">

          {/* Foto del usuario — Face Swap */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-3">Tu foto</p>

            {fotoUrl ? (
              <div className="relative">
                <img
                  src={fotoUrl}
                  alt="Tu foto"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => setFotoUrl(null)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-dark/70 text-cream flex items-center justify-center hover:bg-dark transition-colors"
                >
                  <X size={11} />
                </button>
                <div className="mt-2 bg-cream/80 rounded px-2 py-1">
                  <p className="text-[10px] text-muted text-center">
                    ✦ Cara aplicada al avatar
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fotoInputRef.current?.click()}
                className="w-full border border-dashed border-border-subtle rounded-lg py-5 flex flex-col items-center gap-2 hover:border-muted transition-colors"
              >
                <Camera size={20} className="text-muted" />
                <p className="text-[11px] text-muted">Sube tu foto de perfil</p>
                <p className="text-[10px] text-muted/60">La cara se aplica al avatar</p>
              </button>
            )}
            <input
              ref={fotoInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFotoChange}
            />
          </div>

          {/* Selector de prenda */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-3">Prenda</p>
            <div className="relative">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-full flex items-center justify-between border border-border-subtle bg-cream rounded-lg px-3 py-2.5 text-[12px] text-dark"
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded flex-shrink-0"
                    style={{ background: selected.gradient }} />
                  {selected.name}
                </span>
                <ChevronDown size={13}
                  className={`text-muted transition-transform ${showPicker ? "rotate-180" : ""}`} />
              </button>

              {showPicker && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-cream border border-border-subtle rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                  {available.map((p) => (
                    <button key={p.id}
                      onClick={() => { setSelected(p); setShowPicker(false); setClothTex(null); }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-left transition-colors hover:bg-cream-deep ${
                        p.id === selected.id ? "bg-cream-deep font-medium" : ""}`}>
                      <span className="w-4 h-4 rounded flex-shrink-0" style={{ background: p.gradient }} />
                      {p.name}
                      <span className="ml-auto text-terracotta">S/ {p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Textura de ropa personalizada (Etapa 2) */}
            <div className="mt-3">
              <p className="text-[10px] text-muted mb-1.5">
                Textura personalizada <span className="text-gold">(opcional)</span>
              </p>
              {clothTex ? (
                <div className="flex items-center gap-2">
                  <img src={clothTex} alt="Textura" className="w-10 h-10 rounded object-cover border border-border-subtle" />
                  <p className="text-[10px] text-muted flex-1">Textura aplicada</p>
                  <button onClick={() => setClothTex(null)}>
                    <X size={13} className="text-muted hover:text-dark" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => clothInputRef.current?.click()}
                  className="w-full flex items-center gap-2 border border-dashed border-border-subtle rounded-lg px-3 py-2 text-[11px] text-muted hover:border-muted transition-colors"
                >
                  <Upload size={13} />
                  Subir foto de la tela
                </button>
              )}
              <input ref={clothInputRef} type="file" accept="image/*" className="sr-only" onChange={onClothChange} />
            </div>
          </div>

          {/* Color */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-3">Color</p>
            <div className="flex gap-2.5 flex-wrap">
              {COLOR_OPTIONS.map(({ key, hex, label }) => (
                <button key={key} onClick={() => setColor(key)} title={label}
                  aria-label={label}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                    color === key ? "ring-2 ring-offset-2 ring-dark" : ""}`}
                  style={{ background: hex, border: "1px solid #E0D7C8" }} />
              ))}
            </div>
            <p className="text-[10px] text-muted mt-1.5">
              {COLOR_OPTIONS.find((c) => c.key === color)?.label}
            </p>
          </div>

          {/* Medidas */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-3">Tus medidas</p>
            <label className="text-[11px] text-muted">Altura</label>
            <div className="flex items-center gap-2 mt-1 mb-3">
              <input type="range" min={150} max={195} step={1} value={altura}
                onChange={(e) => setAltura(Number(e.target.value))} className="flex-1" />
              <span className="text-[12px] font-medium text-dark w-14 text-right">{altura} cm</span>
            </div>
            <label className="text-[11px] text-muted">Contextura</label>
            <div className="flex gap-2 mt-1.5">
              {(["delgada", "media", "robusta"] as const).map((c) => (
                <button key={c} onClick={() => setContextura(c)}
                  className={`flex-1 text-[11px] py-1.5 rounded-md border capitalize transition-colors ${
                    contextura === c ? "bg-dark text-cream border-dark" : "border-border-subtle text-dark hover:border-dark"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Talla sugerida */}
          <div className="bg-cream-deep rounded-xl border border-border-subtle p-4">
            <p className="eyebrow mb-1">Talla sugerida</p>
            <div className="flex items-end gap-3">
              <span className="font-serif-display text-[48px] leading-none text-dark">{talla}</span>
              <div className="mb-1">
                <p className="text-[10px] text-muted">Para {altura} cm</p>
                <p className="text-[10px] text-muted capitalize">{contextura}</p>
              </div>
            </div>
            <p className="text-[10px] text-muted mt-2 leading-relaxed">
              La alpaca tiene ligera elasticidad — el ajuste es una guía.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <Link href={`/producto/${selected.id}`}>
              <Button variant="primary" fullWidth>Ver producto → Comprar</Button>
            </Link>
            <Link href="/catalogo">
              <Button variant="outline" fullWidth>Explorar catálogo</Button>
            </Link>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-border-subtle p-4 space-y-2">
            {[
              "Arrastra el avatar para rotarlo",
              "Scroll para hacer zoom",
              "Tu foto no se sube a ningún servidor",
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