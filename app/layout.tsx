import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aramayu's Art — Lujo que regenera",
  description:
    "Prendas de alpaca cusqueña que protegen ecosistemas andinos y apoyan comunidades del Cusco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
