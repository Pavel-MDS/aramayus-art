// app/probador-ia/page.tsx
import { ProbadorIA } from "@/components/ProbadorIA";
import { products } from "@/lib/products";

export const metadata = {
  title: "Probador Virtual IA — Aramayu's Art",
};

export default async function ProbadorIAPage({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string }>;
}) {
  const { producto } = await searchParams;
  const initial = producto
    ? products.find((p) => p.id === producto)
    : undefined;

  return <ProbadorIA initialProduct={initial} />;
}