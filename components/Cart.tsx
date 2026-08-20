// components/Cart.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "./Button";

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalItems, subtotal, total, shipping, tax, clearCart } = useCart();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <button className="relative p-2 text-muted hover:text-dark transition-colors" aria-label="Abrir carrito">
        <ShoppingCart size={20} />
      </button>
    );
  }

  const cartPanel = isOpen ? (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 99999 }}>
      {/* Overlay oscuro */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[400px] h-full shadow-2xl flex flex-col overflow-hidden"
        style={{ backgroundColor: '#FBF8F0' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle flex-shrink-0">
          <h2 className="text-lg font-serif-display text-dark">Carrito</h2>
          <button onClick={() => setIsOpen(false)}
            className="text-muted hover:text-dark transition-colors p-2 hover:bg-cream-deep rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Items — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted pt-20">
              <ShoppingCart size={48} className="opacity-20 mb-4" />
              <p className="text-sm">Tu carrito está vacío</p>
              <Link href="/catalogo" className="text-terracotta text-sm hover:underline mt-2"
                onClick={() => setIsOpen(false)}>
                Ver catálogo →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-border-subtle pb-3">
                <div className="relative w-16 h-20 rounded-md overflow-hidden flex-shrink-0 bg-cream-deep">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-dark truncate">{item.name}</p>
                  <p className="text-[10px] text-muted">{item.color} · {item.size}</p>
                  <p className="text-[11px] text-terracotta font-medium">S/ {item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeItem(item.id)}
                    className="text-muted hover:text-red-400 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-1 border border-border-subtle rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-dark hover:bg-cream-deep transition-colors">
                      <Minus size={10} />
                    </button>
                    <span className="text-[11px] w-5 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-dark hover:bg-cream-deep transition-colors">
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen — siempre al fondo */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-border-subtle px-6 py-5 space-y-2"
            style={{ backgroundColor: '#FBF8F0' }}>
            <div className="flex justify-between text-[12px] text-muted">
              <span>Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[12px] text-muted">
              <span>Envío</span>
              <span>{shipping > 0 ? `S/ ${shipping.toFixed(2)}` : "Gratis"}</span>
            </div>
            <div className="flex justify-between text-[12px] text-muted">
              <span>IGV (18%)</span>
              <span>S/ {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[16px] font-serif-display text-dark pt-2 border-t border-border-subtle">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-2 mt-3">
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button variant="primary" fullWidth>
                  Ir a pagar
                </Button>
              </Link>
              <Button variant="outline" fullWidth onClick={() => setIsOpen(false)}>Seguir comprando</Button>
            </div>
            <button onClick={clearCart}
              className="text-[10px] text-muted hover:text-red-400 transition-colors text-center w-full py-1">
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Botón en el navbar */}
      <button onClick={() => setIsOpen(true)}
        className="relative p-2 text-muted hover:text-dark transition-colors"
        aria-label="Abrir carrito">
        <ShoppingCart size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-terracotta text-cream text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {totalItems}
          </span>
        )}
      </button>

      {/* Panel renderizado en document.body — escapa el stacking context del NavBar */}
      {mounted && createPortal(cartPanel, document.body)}
    </>
  );
}