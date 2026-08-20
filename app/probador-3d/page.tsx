// app/probador-3d/page.tsx
import { ProbadorVirtual3D } from "@/components/ProbadorVirtual3D";
import { products } from "@/lib/products";

export const metadata = {
  title: "Probador Virtual 3D — Aramayu's Art",
  description:
    "Visualiza las prendas de alpaca sobre un avatar 3D con tus medidas antes de comprar.",
};

export default async function Probador3DPage({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string }>;
}) {
  const { producto } = await searchParams;
  const initial = producto
    ? products.find((p) => p.id === producto)
    : undefined;

  return <ProbadorVirtual3D initialProduct={initial} />;
}