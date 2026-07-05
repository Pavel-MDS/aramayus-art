"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products as allProducts, Product } from "@/lib/products";

const SIZES = ["S", "M", "L", "XL", "Única"];
const COLOR_GROUPS: { label: string; hex: string }[] = [
  { label: "Tierra", hex: "#a08e6c" },
  { label: "Verde", hex: "#3a4032" },
  { label: "Negro", hex: "#1d1611" },
  { label: "Gris", hex: "#7A7066" },
  { label: "Dorado", hex: "#C9A876" },
];
const TYPES = [
  "Chompa",
  "Poncho",
  "Bufanda",
  "Saco",
  "Gorro",
  "Manta",
  "Chalina",
  "Casaca",
  "Vincha",
];

type SortOption = "recientes" | "precio-asc" | "precio-desc";

const PAGE_SIZE = 6;

function productType(p: Product) {
  return p.name.split(" ")[0];
}

export function CatalogClient() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("recientes");
  const [page, setPage] = useState(1);

  function toggle(value: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    setPage(1);
  }

  const filtered = useMemo(() => {
    let result = allProducts.filter((p) => {
      const sizeMatch =
        selectedSizes.length === 0 || p.sizes.some((s) => selectedSizes.includes(s));
      const colorMatch =
        selectedColors.length === 0 ||
        p.colors.some((c) => selectedColors.includes(c));
      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(productType(p));
      return sizeMatch && colorMatch && typeMatch;
    });

    if (sort === "precio-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [selectedSizes, selectedColors, selectedTypes, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount =
    selectedSizes.length + selectedColors.length + selectedTypes.length;

  function clearAll() {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedTypes([]);
    setPage(1);
  }

  const sortLabels: Record<SortOption, string> = {
    recientes: "Más recientes",
    "precio-asc": "Precio: menor a mayor",
    "precio-desc": "Precio: mayor a menor",
  };

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-2.5 py-5 border-b border-border-subtle relative">
        <FilterDropdown
          label="Talla"
          isOpen={openFilter === "talla"}
          onToggle={() => setOpenFilter(openFilter === "talla" ? null : "talla")}
          count={selectedSizes.length}
        >
          <div className="flex flex-wrap gap-2 p-3 w-56">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggle(size, selectedSizes, setSelectedSizes)}
                className={`text-[11px] px-3 py-1.5 rounded-md border transition-colors ${
                  selectedSizes.includes(size)
                    ? "bg-dark text-cream border-dark"
                    : "border-border-subtle text-dark hover:border-dark"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown
          label="Color"
          isOpen={openFilter === "color"}
          onToggle={() => setOpenFilter(openFilter === "color" ? null : "color")}
          count={selectedColors.length}
        >
          <div className="flex flex-col gap-1 p-2 w-48">
            {COLOR_GROUPS.map((c) => (
              <button
                key={c.hex}
                onClick={() => toggle(c.hex, selectedColors, setSelectedColors)}
                className={`flex items-center gap-2.5 text-[11px] px-2.5 py-2 rounded-md transition-colors ${
                  selectedColors.includes(c.hex) ? "bg-cream-deep" : "hover:bg-cream-deep"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-border-subtle"
                  style={{ background: c.hex }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown
          label="Tipo de prenda"
          isOpen={openFilter === "tipo"}
          onToggle={() => setOpenFilter(openFilter === "tipo" ? null : "tipo")}
          count={selectedTypes.length}
        >
          <div className="flex flex-col gap-0.5 p-2 w-48 max-h-64 overflow-y-auto">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggle(type, selectedTypes, setSelectedTypes)}
                className={`text-left text-[11px] px-2.5 py-2 rounded-md transition-colors ${
                  selectedTypes.includes(type) ? "bg-cream-deep font-medium" : "hover:bg-cream-deep"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[11px] text-terracotta hover:text-dark transition-colors flex items-center gap-1 ml-1"
          >
            <X size={12} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* ── Results bar ── */}
      <div className="flex items-center justify-between py-4">
        <p className="text-[11px] text-muted">
          Mostrando {paginated.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
        </p>

        <FilterDropdown
          label={`Ordenar: ${sortLabels[sort]}`}
          isOpen={openFilter === "sort"}
          onToggle={() => setOpenFilter(openFilter === "sort" ? null : "sort")}
          align="right"
        >
          <div className="flex flex-col p-1.5 w-52">
            {(Object.keys(sortLabels) as SortOption[]).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setSort(key);
                  setOpenFilter(null);
                }}
                className={`text-left text-[11px] px-3 py-2 rounded-md transition-colors ${
                  sort === key ? "bg-cream-deep font-medium" : "hover:bg-cream-deep"
                }`}
              >
                {sortLabels[key]}
              </button>
            ))}
          </div>
        </FilterDropdown>
      </div>

      {/* ── Grid ── */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-7 pb-10">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-[14px] text-muted">
            No hay prendas que coincidan con esos filtros.
          </p>
          <button
            onClick={clearAll}
            className="text-[12px] text-terracotta mt-2 hover:text-dark transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 pb-16">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-current={page === n ? "page" : undefined}
              className={`w-8 h-8 rounded-md text-[11px] flex items-center justify-center transition-colors ${
                page === n
                  ? "bg-dark text-cream"
                  : "border border-border-subtle text-dark hover:border-dark"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  isOpen,
  onToggle,
  count,
  align = "left",
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  count?: number;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1.5 text-[11px] px-3.5 py-2 rounded-full border transition-colors ${
          isOpen || (count ?? 0) > 0
            ? "bg-dark text-cream border-dark"
            : "border-border-subtle text-dark hover:border-dark"
        }`}
      >
        {label}
        {count ? <span className="opacity-70">({count})</span> : null}
        <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-30 bg-cream border border-border-subtle rounded-lg shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
