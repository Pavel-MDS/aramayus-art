import { CatalogClient } from "@/components/CatalogClient";
import { fetchProductos } from "@/lib/products";

export const metadata = {
  title: "Catálogo — Aramayu's Art",
  description: "Explora nuestra colección de prendas de alpaca cusqueña.",
};

export default async function CatalogoPage() {
  const { productos, total } = await fetchProductos({ pageSize: 50 });

  return (
    <main className="max-w-[1280px] mx-auto px-6 sm:px-10">
      <div className="pt-10">
        <p className="text-[10px] text-muted mb-4">
          Inicio / <span className="text-dark">Catálogo</span>
        </p>
        <div className="eyebrow mb-3">Colección completa</div>
        <h1 className="font-serif-display text-[32px] sm:text-[40px] text-dark mb-1.5">
          Prendas de alpaca cusqueña
        </h1>
        <p className="text-[12px] text-muted">
          {total} productos disponibles
        </p>
      </div>

      <CatalogClient initialProducts={productos} />
    </main>
  );
}