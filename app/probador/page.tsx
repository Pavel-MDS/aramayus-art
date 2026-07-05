import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ProbadorClient } from "@/components/ProbadorClient";
import { products } from "@/lib/products";

export const metadata = {
  title: "Probador Virtual — Aramayu's Art",
};

export default function ProbadorPage({
  searchParams,
}: {
  searchParams: { producto?: string };
}) {
  const initial = searchParams.producto
    ? products.find((p) => p.id === searchParams.producto) ?? products[0]
    : products[0];

  return (
    <>
      <NavBar />
      <ProbadorClient products={products} initialProduct={initial} />
      <Footer />
    </>
  );
}
