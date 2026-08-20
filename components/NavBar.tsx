// components/NavBar.tsx
"use client";

import Link from "next/link";
import { Cart } from "@/components/Cart";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/#historia", label: "Historia" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#contacto", label: "Contacto" },
];

export function NavBar() {
  const { user, loading } = useAuth();

  return (
    <header className="border-b border-border-subtle bg-cream/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-[64px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif-display text-xl text-dark">
          Aramayu<span className="text-gold">&apos;s</span> Art
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] tracking-[0.05em] uppercase text-dark/80 hover:text-terracotta transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acciones: Ver colección + Carrito */}
        <div className="flex items-center gap-4">
          <Link
            href="/catalogo"
            className="hidden sm:inline-flex bg-dark text-cream text-[11px] uppercase tracking-[0.05em] px-5 py-2.5 rounded-md hover:bg-[#352519] transition-colors"
          >
            Ver colección
          </Link>
                  {/* Auth button */}
          {!loading && (
            user ? (
              <Link href="/perfil"
                className="p-2 text-muted hover:text-dark transition-colors" aria-label="Mi perfil">
                <User size={20} />
              </Link>
            ) : (
              <Link href="/login"
                className="text-[11px] text-dark border border-border-subtle px-4 py-2 rounded-md hover:bg-cream-deep transition-colors">
                Ingresar
              </Link>
            )
          )}
          <Cart />
        </div>
      </div>
    </header>
  );
}