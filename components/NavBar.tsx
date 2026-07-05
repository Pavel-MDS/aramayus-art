import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/#historia", label: "Historia" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#contacto", label: "Contacto" },
];

export function NavBar() {
  return (
    <header className="border-b border-border-subtle bg-cream/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-[64px] flex items-center justify-between">
        <Link href="/" className="font-serif-display text-xl text-dark">
          Aramayu<span className="text-gold">&apos;s</span> Art
        </Link>

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

        <Link
          href="/catalogo"
          className="hidden sm:inline-flex bg-dark text-cream text-[11px] uppercase tracking-[0.05em] px-5 py-2.5 rounded-md hover:bg-[#352519] transition-colors"
        >
          Ver colección
        </Link>
      </div>
    </header>
  );
}
