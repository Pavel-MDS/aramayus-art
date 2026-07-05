import { notFound } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { products } from "@/lib/products";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
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
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const related = products
    .filter((p) => p.id !== product.id && p.stock !== "agotado")
    .slice(0, 3);

  return (
    <>
      <NavBar />
      <ProductDetailClient product={product} related={related} />
      <Footer />
    </>
  );
}