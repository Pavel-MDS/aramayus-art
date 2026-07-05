"use client"
import Image from "next/image";  
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/lib/products";
import { Badge } from "./Badge";

const stockLabel: Record<Product["stock"], { text: string; className: string }> = {
  disponible: { text: "En stock", className: "text-status-ok" },
  "ultimas-unidades": { text: "Últimas unidades", className: "text-status-low" },
  agotado: { text: "Agotado", className: "text-status-low" },
};

export function ProductCard({ product }: { product: Product }) {
  const isSoldOut = product.stock === "agotado";
  const stock = stockLabel[product.stock];
  const hasRealImage = product.image && !product.image.includes("placeholder");

  return (
    <Link
      href={`/producto/${product.id}`}
      className={`group block ${isSoldOut ? "pointer-events-none" : ""}`}
      aria-disabled={isSoldOut}
    >
      <div className="relative h-44 sm:h-48 rounded-lg mb-3 overflow-hidden">

        {/* Imagen real o fallback con gradiente */}
        {hasRealImage ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div
            className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
            style={{ background: product.gradient }}
          />
        )}

        {/* Badge "Nuevo" */}
        {product.isNew && !isSoldOut && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge tone="terracotta">Nuevo</Badge>
          </div>
        )}

        {/* Favorito */}
        {!isSoldOut && (
          <button
            type="button"
            aria-label={`Agregar ${product.name} a favoritos`}
            onClick={(e) => e.preventDefault()}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-cream/85 flex items-center justify-center text-dark opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Heart size={14} />
          </button>
        )}

        {/* Overlay agotado */}
        {isSoldOut && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream/40">
            <span className="text-[11px] bg-cream/95 text-muted px-3 py-1.5 rounded">
              Agotado
            </span>
          </div>
        )}
      </div>

      <h3 className={`text-[13px] font-medium ${isSoldOut ? "text-dark/40" : "text-dark"}`}>
        {product.name}
      </h3>
      <p className={`text-[11px] mt-0.5 ${isSoldOut ? "text-muted/40" : "text-muted"}`}>
        {product.subtitle}
      </p>
      <p className={`text-[12px] mt-1.5 font-serif-display ${isSoldOut ? "text-terracotta/40" : "text-terracotta"}`}>
        S/ {product.price}
      </p>
      <p className={`text-[10px] mt-1 ${stock.className}`}>
        ● {stock.text}
        {product.stock === "ultimas-unidades" && product.stockCount
          ? ` — quedan ${product.stockCount}`
          : ""}
      </p>
    </Link>
  );
}