import Link from "next/link";
import { AtSign, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-cream/70">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 sm:grid-cols-4 gap-10">
        <div>
          <div className="font-serif-display text-xl text-cream mb-3">
            Aramayu<span className="text-gold">&apos;s</span> Art
          </div>
          <p className="text-[12px] leading-relaxed max-w-[220px]">
            Prendas de alpaca cusqueña tejidas a mano por comunidades
            andinas.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4 text-cream/40">Explorar</div>
          <ul className="space-y-2.5 text-[12px]">
            <li><Link href="/" className="hover:text-cream transition-colors">Home</Link></li>
            <li><Link href="/catalogo" className="hover:text-cream transition-colors">Catálogo</Link></li>
            <li><Link href="/#historia" className="hover:text-cream transition-colors">Nuestra historia</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4 text-cream/40">Ayuda</div>
          <ul className="space-y-2.5 text-[12px]">
            <li><Link href="/#contacto" className="hover:text-cream transition-colors">Contacto</Link></li>
            <li><Link href="/#" className="hover:text-cream transition-colors">Envíos</Link></li>
            <li><Link href="/#" className="hover:text-cream transition-colors">Cambios y devoluciones</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4 text-cream/40">Síguenos</div>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-cream/50 transition-colors">
              <AtSign size={15} />
            </a>
            <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-cream/50 transition-colors">
              <MessageCircle size={15} />
            </a>
            <a href="#" aria-label="Correo" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:border-cream/50 transition-colors">
              <Mail size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-[10px] text-cream/40">
        © 2026 Aramayu&apos;s Art — Cusco, Perú
      </div>
    </footer>
  );
}
