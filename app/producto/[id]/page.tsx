import { notFound } from "next/navigation";
import { fetchProducto, fetchProductos } from "@/lib/products";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProducto(id);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: `${product.name} — Aramayu's Art`,
    description: product.description,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProducto(id);
  if (!product) notFound();

  const { productos: todos } = await fetchProductos({ pageSize: 50 });
  const related = todos
    .filter((p) => p.id !== product.id && p.stock !== "agotado")
    .slice(0, 3);

  return <ProductDetailClient product={product} related={related} />;
}