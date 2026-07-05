import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ProbadorClient } from "@/components/ProbadorClient";
import { products } from "@/lib/products";

export const metadata = {
  title: "Probador Virtual — Aramayu's Art",
};

export default async function ProbadorPage({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string }>;
}) {
  const { producto } = await searchParams;
  const initial = producto
    ? products.find((p) => p.id === producto) ?? products[0]
    : products[0];

  return (
    <>
      <NavBar />
      <ProbadorClient products={products} initialProduct={initial} />
      <Footer />
    </>
  );
}