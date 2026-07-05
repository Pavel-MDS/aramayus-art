import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ProbadorVirtual3D } from "@/components/ProbadorVirtual3D";
import { products } from "@/lib/products";

export const metadata = {
  title: "Probador Virtual 3D — Aramayu's Art",
  description:
    "Visualiza las prendas de alpaca sobre un avatar 3D con tus medidas antes de comprar.",
};

export default function ProbadorPage({
  searchParams,
}: {
  searchParams: { producto?: string };
}) {
  const initial = searchParams.producto
    ? products.find((p) => p.id === searchParams.producto)
    : undefined;

  return (
    <>
      <NavBar />
      <ProbadorVirtual3D initialProduct={initial} />
      <Footer />
    </>
  );
}
