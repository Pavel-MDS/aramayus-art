"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, shipping, tax, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePagar = async () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Error al procesar el pago');
        setLoading(false);
      }
    } catch {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-[13px] text-muted mb-4">Tu carrito está vacío</p>
        <Button variant="primary" onClick={() => router.push('/catalogo')}>
          Ver catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif-display text-[28px] text-dark mb-8">Finalizar compra</h1>

      {/* Resumen de items */}
      <div className="space-y-3 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex gap-3 border-b border-border-subtle pb-3">
            <div className="relative w-16 h-20 rounded-md overflow-hidden flex-shrink-0 bg-cream-deep">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-dark">{item.name}</p>
              <p className="text-[11px] text-muted">{item.color} · {item.size} · x{item.quantity}</p>
            </div>
            <p className="text-[13px] text-terracotta font-medium">
              S/ {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="border-t border-border-subtle pt-4 space-y-2 mb-8">
        <div className="flex justify-between text-[13px] text-muted">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[13px] text-muted">
          <span>Envío</span>
          <span>S/ {shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[13px] text-muted">
          <span>IGV (18%)</span>
          <span>S/ {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[18px] font-serif-display text-dark pt-2 border-t border-border-subtle">
          <span>Total</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <Button variant="primary" fullWidth onClick={handlePagar} disabled={loading}>
        <span className="flex items-center justify-center gap-2">
          <CreditCard size={15} />
          {loading ? 'Procesando...' : `Pagar S/ ${total.toFixed(2)}`}
        </span>
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted mt-4">
        <ShieldCheck size={12} />
        Pago seguro procesado por Stripe
      </p>
    </div>
  );
}