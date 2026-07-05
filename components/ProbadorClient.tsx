"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, Camera, RotateCcw, Sparkles, ChevronDown } from "lucide-react";
import { Product, products as allProducts } from "@/lib/products";
import { Button } from "@/components/Button";

// ── Tipos ────────────────────────────────────────────────────────────────────
type Stage =
  | "idle"          // pantalla inicial: pide foto
  | "photo-ready"   // foto cargada, esperando analizar
  | "analyzing"     // llamando a la IA (nivel 2)
  | "result";       // mostrando resultado

// ── Componente principal ─────────────────────────────────────────────────────
export function ProbadorClient({
  products,
  initialProduct,
}: {
  products: Product[];
  initialProduct: Product;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    initialProduct.sizes.find((s) => !initialProduct.unavailableSizes?.includes(s)) ?? initialProduct.sizes[0]
  );
  const [stage, setStage] = useState<Stage>("idle");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── Manejo de foto ──────────────────────────────────────────────────────────
  const loadPhoto = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUserPhoto(e.target?.result as string);
      setStage("photo-ready");
      setAiSuggestion(null);
    };
    reader.readAsDataURL(file);
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadPhoto(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadPhoto(file);
  }

  function reset() {
    setUserPhoto(null);
    setStage("idle");
    setAiSuggestion(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  // ── Análisis con IA (Nivel 2) ───────────────────────────────────────────────
  // Esta función está lista para conectar a tu backend cuando lo tengas.
  // Por ahora simula un análisis con un delay y devuelve una sugerencia de talla.
  async function analyzeWithAI() {
    if (!userPhoto) return;
    setStage("analyzing");

    // ── NIVEL 2: descomenta esto cuando tengas backend ──────────────────────
    // try {
    //   const response = await fetch("/api/probador", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       image: userPhoto,
    //       productId: selectedProduct.id,
    //       color: selectedProduct.colors[selectedColor],
    //     }),
    //   });
    //   const data = await response.json();
    //   setAiSuggestion(data.suggestion);
    // } catch (e) {
    //   setAiSuggestion("No pudimos analizar la imagen. Intenta con otra foto.");
    // }
    // ── Fin bloque Nivel 2 ──────────────────────────────────────────────────

    // Simulación Nivel 1 (quita esto cuando conectes el backend):
    await new Promise((r) => setTimeout(r, 2200));
    const suggestions = [
      `Basándonos en tus proporciones, te recomendamos la talla **M** en ${selectedProduct.name}. El corte es holgado, ideal para layering.`,
      `La ${selectedProduct.name} en talla **S** te dará una silueta más estructurada. Si prefieres más libertad de movimiento, prueba la M.`,
      `Para ${selectedProduct.name}, la talla **M** es perfecta. La fibra de alpaca tiene ligera elasticidad, así que talla fiel.`,
    ];
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    setStage("result");
  }

  // ── Cambio de producto ──────────────────────────────────────────────────────
  function handleProductChange(p: Product) {
    setSelectedProduct(p);
    setSelectedColor(0);
    setSelectedSize(
      p.sizes.find((s) => !p.unavailableSizes?.includes(s)) ?? p.sizes[0]
    );
    setShowProductPicker(false);
    // Si ya hay resultado, vuelve a foto-lista para re-analizar
    if (stage === "result") setStage("photo-ready");
  }

  return (
    <main className="max-w-[1280px] mx-auto px-6 sm:px-10 py-10">
      <div className="eyebrow mb-2">Probador virtual</div>
      <h1 className="font-serif-display text-[32px] sm:text-[40px] text-dark mb-1.5">
        Descubre cómo te queda.
      </h1>
      <p className="text-[13px] text-muted mb-10 max-w-lg">
        Sube una foto de cuerpo completo y nuestra IA te dará una recomendación
        personalizada de talla y ajuste.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">

        {/* ── Panel izquierdo: foto ── */}
        <div>
          {stage === "idle" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-5 py-20 transition-colors cursor-pointer ${
                isDragging
                  ? "border-terracotta bg-terracotta/5"
                  : "border-border-subtle hover:border-muted"
              }`}
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-full bg-cream-deep flex items-center justify-center">
                <Upload size={24} className="text-muted" />
              </div>
              <div className="text-center">
                <p className="text-[14px] text-dark font-medium">
                  Arrastra tu foto aquí
                </p>
                <p className="text-[12px] text-muted mt-1">
                  o haz clic para seleccionarla
                </p>
                <p className="text-[10px] text-muted/60 mt-3">
                  JPG, PNG · Cuerpo completo · Fondo claro
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFileChange}
              />
            </div>
          )}

          {(stage === "photo-ready" || stage === "analyzing" || stage === "result") &&
            userPhoto && (
            <div className="relative">
              {/* Vista lado a lado: foto usuario + prenda */}
              <div className="grid grid-cols-2 gap-4 rounded-xl overflow-hidden border border-border-subtle">

                {/* Foto del usuario */}
                <div className="relative aspect-[3/4] bg-cream-deep">
                  <img
                    src={userPhoto}
                    alt="Tu foto"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/60 to-transparent py-2 px-3">
                    <p className="text-[10px] text-cream">Tu foto</p>
                  </div>
                </div>

                {/* Prenda seleccionada */}
                <div className="relative aspect-[3/4] flex flex-col items-center justify-center"
                  style={{ background: selectedProduct.gradient }}>
                  {stage === "analyzing" && (
                    <div className="absolute inset-0 bg-dark/30 flex items-center justify-center">
                      <div className="text-center text-cream">
                        <div className="w-8 h-8 border-2 border-cream/30 border-t-cream rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-[11px]">Analizando…</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/60 to-transparent py-2 px-3">
                    <p className="text-[10px] text-cream">{selectedProduct.name}</p>
                  </div>
                </div>
              </div>

              {/* Barra de acciones */}
              <div className="flex gap-2.5 mt-3">
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 text-[11px] text-muted hover:text-dark transition-colors px-3 py-2 rounded-md border border-border-subtle"
                >
                  <RotateCcw size={12} /> Nueva foto
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-[11px] text-muted hover:text-dark transition-colors px-3 py-2 rounded-md border border-border-subtle"
                >
                  <Camera size={12} /> Cambiar foto
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onFileChange}
                />
              </div>

              {/* Resultado IA */}
              {stage === "result" && aiSuggestion && (
                <div className="mt-4 bg-cream-deep border border-border-subtle rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-gold" />
                    <span className="text-[11px] font-medium text-dark uppercase tracking-wide">
                      Recomendación personalizada
                    </span>
                  </div>
                  <p className="text-[13px] text-muted leading-relaxed">
                    {aiSuggestion.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Panel derecho: controles ── */}
        <div className="bg-cream-deep rounded-xl p-6 h-fit">

          {/* Selector de prenda */}
          <div className="mb-6">
            <p className="eyebrow mb-2.5">Prenda a probar</p>
            <div className="relative">
              <button
                onClick={() => setShowProductPicker(!showProductPicker)}
                className="w-full flex items-center justify-between gap-2 border border-border-subtle bg-cream rounded-lg px-3.5 py-3 text-[12px] text-dark"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="w-6 h-6 rounded flex-shrink-0"
                    style={{ background: selectedProduct.gradient }}
                  />
                  {selectedProduct.name}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-muted transition-transform ${showProductPicker ? "rotate-180" : ""}`}
                />
              </button>

              {showProductPicker && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-cream border border-border-subtle rounded-lg shadow-lg z-20 max-h-56 overflow-y-auto">
                  {allProducts
                    .filter((p) => p.stock !== "agotado")
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleProductChange(p)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-left transition-colors hover:bg-cream-deep ${
                          p.id === selectedProduct.id ? "bg-cream-deep font-medium" : ""
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded flex-shrink-0"
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
          <div className="mb-5">
            <p className="text-[11px] text-dark mb-2.5">Color</p>
            <div className="flex gap-2 flex-wrap">
              {selectedProduct.colors.map((hex, i) => (
                <button
                  key={hex}
                  onClick={() => setSelectedColor(i)}
                  aria-label={`Color ${i + 1}`}
                  className={`w-7 h-7 rounded-full transition-all ${
                    selectedColor === i ? "ring-2 ring-offset-2 ring-dark" : "hover:scale-110"
                  }`}
                  style={{ background: hex, border: "0.5px solid #E0D7C8" }}
                />
              ))}
            </div>
          </div>

          {/* Talla */}
          <div className="mb-6">
            <p className="text-[11px] text-dark mb-2.5">Talla</p>
            <div className="flex gap-2 flex-wrap">
              {selectedProduct.sizes.map((size) => {
                const disabled = selectedProduct.unavailableSizes?.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => !disabled && setSelectedSize(size)}
                    disabled={disabled}
                    className={`min-w-[38px] h-9 px-2.5 rounded-md text-[11px] border transition-colors ${
                      disabled
                        ? "border-border-subtle text-muted/40 cursor-not-allowed line-through"
                        : selectedSize === size
                        ? "bg-dark text-cream border-dark"
                        : "border-border-subtle text-dark hover:border-dark bg-cream"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA análisis */}
          {stage === "idle" && (
            <div className="bg-cream border border-border-subtle rounded-lg p-4 text-center mb-4">
              <p className="text-[12px] text-muted leading-relaxed">
                Sube una foto primero para activar el análisis de talla.
              </p>
            </div>
          )}

          {stage === "photo-ready" && (
            <Button
              variant="primary"
              fullWidth
              onClick={analyzeWithAI}
            >
              <Sparkles size={14} />
              Analizar talla con IA
            </Button>
          )}

          {stage === "analyzing" && (
            <Button variant="primary" fullWidth disabled>
              <div className="w-3.5 h-3.5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
              Analizando…
            </Button>
          )}

          {stage === "result" && (
            <>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  window.location.href = `/producto/${selectedProduct.id}`;
                }}
              >
                Ver producto → Comprar
              </Button>
              <button
                onClick={() => stage === "result" && setStage("photo-ready")}
                className="w-full mt-2 text-[11px] text-terracotta hover:text-dark transition-colors py-2"
              >
                Cambiar prenda y re-analizar
              </button>
            </>
          )}

          {/* Info */}
          <div className="mt-6 pt-5 border-t border-border-subtle space-y-2.5">
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
      </div>
    </main>
  );
}
