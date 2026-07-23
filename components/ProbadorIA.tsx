"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Upload, X, Sparkles, ChevronRight, RotateCcw, Download } from "lucide-react";
import { products, Product } from "@/lib/products";
import { useTryOn } from "@/hooks/useTryOn";
import { Button } from "./Button";

// Solo productos con foto real disponible
const disponibles = products.filter((p) =>
  p.image && p.stock !== "agotado"
);

export function ProbadorIA({ initialProduct }: { initialProduct?: Product }) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct && initialProduct.image ? initialProduct : disponibles[0]
  );
  const [personaFile, setPersonaFile]   = useState<File | null>(null);
  const [personaPreview, setPersonaPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging]     = useState(false);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const { status, imagenResultado, error, generar, reset } = useTryOn();

  // ── Cargar foto del usuario ──────────────────────────────────────────────
  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPersonaFile(file);
    const url = URL.createObjectURL(file);
    setPersonaPreview(url);
    reset();
  }, [reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  };

  const clearFoto = () => {
    setPersonaFile(null);
    setPersonaPreview(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Generar try-on ────────────────────────────────────────────────────────
  const handleGenerar = async () => {
    if (!personaFile || !selectedProduct.image) return;
    await generar(personaFile, selectedProduct.image);
  };

  // ── Descargar resultado ───────────────────────────────────────────────────
  const handleDescargar = () => {
    if (!imagenResultado) return;
    const a = document.createElement("a");
    a.href = imagenResultado;
    a.download = `probador-${selectedProduct.id}.png`;
    a.click();
  };

  return (
    <main className="max-w-[1280px] mx-auto px-6 sm:px-10 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6 text-[11px] text-muted">
        <Link href="/" className="hover:text-dark transition-colors">Inicio</Link>
        <ChevronRight size={11} />
        <span className="text-dark">Probador virtual con IA</span>
      </nav>

      <div className="eyebrow mb-2">Probador virtual · IA</div>
      <h1 className="font-serif-display text-[32px] sm:text-[40px] text-dark mb-1.5">
        Mira cómo te queda la prenda.
      </h1>
      <p className="text-[13px] text-muted mb-8 max-w-lg">
        Sube tu foto de cuerpo completo, selecciona una prenda del catálogo y
        la IA generará una imagen realista de cómo te quedaría.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Columna 1: Foto del usuario ── */}
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-dark mb-3">
            1 · Tu foto
          </h2>

          {!personaPreview ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors
                h-72 ${isDragging ? "border-terracotta bg-terracotta/5" : "border-border-subtle hover:border-muted"}`}
            >
              <div className="w-14 h-14 rounded-full bg-cream-deep flex items-center justify-center">
                <Upload size={22} className="text-muted" />
              </div>
              <div className="text-center px-4">
                <p className="text-[13px] text-dark font-medium">Arrastra tu foto aquí</p>
                <p className="text-[11px] text-muted mt-1">o haz clic para seleccionarla</p>
                <p className="text-[10px] text-muted/60 mt-3">
                  JPG o PNG · Cuerpo completo · Fondo claro
                </p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden h-72 bg-cream-deep">
              <img
                src={personaPreview}
                alt="Tu foto"
                className="w-full h-full object-cover"
              />
              <button
                onClick={clearFoto}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-dark/70 text-cream flex items-center justify-center hover:bg-dark transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />

          <div className="mt-3 space-y-1.5">
            {[
              "Foto de cuerpo completo, de pie",
              "Fondo claro y buena iluminación",
              "Tu foto no se guarda en ningún servidor",
            ].map((tip) => (
              <p key={tip} className="flex gap-2 text-[11px] text-muted">
                <span className="text-gold flex-shrink-0">✦</span>
                {tip}
              </p>
            ))}
          </div>
        </div>

        {/* ── Columna 2: Selector de prenda ── */}
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-dark mb-3">
            2 · Elige una prenda
          </h2>

          <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {disponibles.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedProduct(p); reset(); }}
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                  selectedProduct.id === p.id
                    ? "border-dark"
                    : "border-transparent hover:border-border-subtle"
                }`}
              >
                <div className="aspect-[3/4] bg-cream-deep relative">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
                <div className="p-2 bg-cream text-left">
                  <p className="text-[11px] font-medium text-dark truncate">{p.name}</p>
                  <p className="text-[10px] text-terracotta">S/ {p.price}</p>
                </div>
                {selectedProduct.id === p.id && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-dark flex items-center justify-center">
                    <span className="text-cream text-[9px]">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Columna 3: Resultado ── */}
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-dark mb-3">
            3 · Resultado
          </h2>

          {/* Estado: idle */}
          {status === "idle" && (
            <div className="h-72 border border-border-subtle rounded-xl flex flex-col items-center justify-center gap-3 text-center px-6">
              <Sparkles size={28} className="text-gold" />
              <p className="text-[12px] text-muted">
                Sube tu foto y selecciona una prenda para generar la prueba virtual
              </p>
            </div>
          )}

          {/* Estado: loading */}
          {status === "loading" && (
            <div className="h-72 border border-border-subtle rounded-xl flex flex-col items-center justify-center gap-4">
              <div
                className="w-10 h-10 rounded-full border-2 animate-spin"
                style={{
                  borderColor: "rgba(201,168,118,0.2)",
                  borderTopColor: "#C9A876",
                }}
              />
              <div className="text-center">
                <p className="text-[13px] text-dark font-medium">Generando prueba virtual…</p>
                <p className="text-[11px] text-muted mt-1">Esto puede tomar 15–30 segundos</p>
              </div>
            </div>
          )}

          {/* Estado: error */}
          {status === "error" && (
            <div className="h-72 border border-status-low/30 bg-status-low/5 rounded-xl flex flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-[12px] text-status-low">{error}</p>
              <button
                onClick={reset}
                className="text-[11px] text-terracotta hover:text-dark transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={12} /> Intentar de nuevo
              </button>
            </div>
          )}

          {/* Estado: success */}
          {status === "success" && imagenResultado && (
            <div className="relative rounded-xl overflow-hidden h-72 bg-cream-deep">
              <img
                src={imagenResultado}
                alt="Resultado del probador virtual"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleDescargar}
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-dark/80 text-cream text-[11px] px-3 py-1.5 rounded-md hover:bg-dark transition-colors"
              >
                <Download size={12} /> Descargar
              </button>
            </div>
          )}

          {/* Botón generar */}
          <div className="mt-4 flex flex-col gap-2">
            <Button
              variant="primary"
              fullWidth
              onClick={handleGenerar}
              disabled={!personaFile || status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  Generando…
                </>
              ) : status === "success" ? (
                <>
                  <RotateCcw size={14} /> Generar con otra prenda
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Generar prueba virtual
                </>
              )}
            </Button>

            {status === "success" && (
              <Link href={`/producto/${selectedProduct.id}`}>
                <Button variant="outline" fullWidth>
                  Ver producto → Comprar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}