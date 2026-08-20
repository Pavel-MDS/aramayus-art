// components/SizeSuggester.tsx
"use client";

import { useState, useEffect } from "react";
import { Ruler, Weight } from "lucide-react";

interface Props {
  availableSizes: string[];
  onSizeSelected: (size: string) => void;
}

// Tabla de medidas por talla (cm) — prendas de alpaca cusqueña
const SIZE_CHART: Record<string, { pecho: [number, number]; cintura: [number, number]; cadera: [number, number]; hombros: [number, number] }> = {
  XS: { pecho: [76, 82], cintura: [60, 66], cadera: [84, 90],  hombros: [36, 38] },
  S:  { pecho: [82, 88], cintura: [66, 72], cadera: [90, 96],  hombros: [38, 40] },
  M:  { pecho: [88, 94], cintura: [72, 78], cadera: [96, 102], hombros: [40, 42] },
  L:  { pecho: [94,100], cintura: [78, 84], cadera: [102,108], hombros: [42, 44] },
  XL: { pecho: [100,106],cintura: [84, 90], cadera: [108,114], hombros: [44, 46] },
  XXL:{ pecho: [106,114],cintura: [90, 98], cadera: [114,122], hombros: [46, 49] },
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

function getBestAvailable(talla: string, availableSizes: string[]): string {
  if (availableSizes.includes(talla)) return talla;
  const idx = SIZE_ORDER.indexOf(talla);
  for (let i = 1; i <= SIZE_ORDER.length; i++) {
    if (idx + i < SIZE_ORDER.length && availableSizes.includes(SIZE_ORDER[idx + i])) return SIZE_ORDER[idx + i];
    if (idx - i >= 0 && availableSizes.includes(SIZE_ORDER[idx - i])) return SIZE_ORDER[idx - i];
  }
  return availableSizes[0];
}

// Modo 1: Altura + Peso → talla estimada
function suggestByHeightWeight(altura: number, peso: number): string {
  const bmi = peso / ((altura / 100) ** 2);
  let talla: string;
  if (altura < 158) {
    talla = bmi < 20 ? "XS" : bmi < 24 ? "S" : bmi < 28 ? "M" : "L";
  } else if (altura < 168) {
    talla = bmi < 19 ? "XS" : bmi < 23 ? "S" : bmi < 27 ? "M" : bmi < 31 ? "L" : "XL";
  } else if (altura < 178) {
    talla = bmi < 19 ? "S" : bmi < 23 ? "M" : bmi < 27 ? "L" : bmi < 31 ? "XL" : "XXL";
  } else {
    talla = bmi < 21 ? "M" : bmi < 25 ? "L" : bmi < 29 ? "XL" : "XXL";
  }
  return talla;
}

// Modo 2: Medidas → talla por pecho (la más determinante en alpaca)
function suggestByMeasurements(pecho: number, cintura: number, cadera: number, hombros: number): string {
  let bestTalla = "M";
  let bestScore = Infinity;

  for (const [talla, ranges] of Object.entries(SIZE_CHART)) {
    // Score = suma de distancias al rango, 0 si está dentro
    const d = (val: number, [min, max]: [number, number]) =>
      val < min ? min - val : val > max ? val - max : 0;

    const score =
      d(pecho, ranges.pecho) * 2 +       // pecho tiene más peso
      d(cintura, ranges.cintura) * 1.5 +
      d(cadera, ranges.cadera) +
      d(hombros, ranges.hombros);

    if (score < bestScore) {
      bestScore = score;
      bestTalla = talla;
    }
  }
  return bestTalla;
}

type Mode = "rapido" | "medidas";

export function SizeSuggester({ availableSizes, onSizeSelected }: Props) {
  const [mode, setMode] = useState<Mode>("rapido");

  // Modo rápido
  const [altura, setAltura] = useState(165);
  const [peso, setPeso]     = useState(65);

  // Modo medidas
  const [pecho,   setPecho]   = useState(88);
  const [cintura, setCintura] = useState(72);
  const [cadera,  setCadera]  = useState(96);
  const [hombros, setHombros] = useState(40);

  const [sugerida, setSugerida] = useState<string | null>(null);

  useEffect(() => {
    const raw = mode === "rapido"
      ? suggestByHeightWeight(altura, peso)
      : suggestByMeasurements(pecho, cintura, cadera, hombros);
    const final = getBestAvailable(raw, availableSizes);
    setSugerida(final);
    onSizeSelected(final);
  }, [mode, altura, peso, pecho, cintura, cadera, hombros, availableSizes]);

  return (
    <div className="border border-border-subtle rounded-xl p-4 bg-cream space-y-4">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler size={15} className="text-terracotta" />
          <span className="text-[12px] font-medium text-dark">Guía de tallas</span>
        </div>

        {/* Toggle encendido/apagado entre los dos modos */}
        <div className="flex items-center gap-1 bg-cream-deep rounded-lg p-1">
          <button
            onClick={() => setMode("rapido")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium transition-all ${
              mode === "rapido"
                ? "bg-dark text-cream shadow-sm"
                : "text-muted hover:text-dark"
            }`}
          >
            <Weight size={11} />
            Rápido
          </button>
          <button
            onClick={() => setMode("medidas")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium transition-all ${
              mode === "medidas"
                ? "bg-dark text-cream shadow-sm"
                : "text-muted hover:text-dark"
            }`}
          >
            <Ruler size={11} />
            Medidas
          </button>
        </div>
      </div>

      {/* Modo rápido — Altura + Peso */}
      {mode === "rapido" && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[10px] text-muted">Altura</label>
              <span className="text-[10px] font-medium text-dark">{altura} cm</span>
            </div>
            <input type="range" min={140} max={200} value={altura}
              onChange={e => setAltura(Number(e.target.value))}
              className="w-full accent-terracotta h-1.5 cursor-pointer" />
            <div className="flex justify-between text-[9px] text-muted/60 mt-0.5">
              <span>140</span><span>200 cm</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[10px] text-muted">Peso</label>
              <span className="text-[10px] font-medium text-dark">{peso} kg</span>
            </div>
            <input type="range" min={40} max={130} value={peso}
              onChange={e => setPeso(Number(e.target.value))}
              className="w-full accent-terracotta h-1.5 cursor-pointer" />
            <div className="flex justify-between text-[9px] text-muted/60 mt-0.5">
              <span>40</span><span>130 kg</span>
            </div>
          </div>
        </div>
      )}

      {/* Modo medidas — campos numéricos */}
      {mode === "medidas" && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Pecho", value: pecho, setter: setPecho, min: 70, max: 130 },
            { label: "Cintura", value: cintura, setter: setCintura, min: 55, max: 110 },
            { label: "Cadera", value: cadera, setter: setCadera, min: 80, max: 130 },
            { label: "Hombros", value: hombros, setter: setHombros, min: 33, max: 52 },
          ].map(({ label, value, setter, min, max }) => (
            <div key={label}>
              <label className="text-[10px] text-muted block mb-1">{label} (cm)</label>
              <div className="flex items-center border border-border-subtle rounded-md overflow-hidden">
                <button
                  onClick={() => setter(v => Math.max(min, v - 1))}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:bg-cream-deep text-sm transition-colors flex-shrink-0"
                >−</button>
                <span className="flex-1 text-center text-[12px] font-medium text-dark">{value}</span>
                <button
                  onClick={() => setter(v => Math.min(max, v + 1))}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:bg-cream-deep text-sm transition-colors flex-shrink-0"
                >+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultado */}
      {sugerida && (
        <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
          <p className="text-[11px] text-muted">
            {mode === "rapido" ? "Basado en altura y peso" : "Basado en tus medidas"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted">Talla sugerida:</span>
            <span className="bg-dark text-cream text-[12px] font-medium px-3 py-1 rounded-md">
              {sugerida}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}