"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/Button';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutExitoPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && !cleared) {
      clearCart();
      setCleared(true);
    }
  }, [sessionId, cleared, clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h1 className="font-serif-display text-[28px] text-dark mb-2">¡Pago exitoso!</h1>
        <p className="text-[13px] text-muted mb-8">
          Tu pedido ha sido confirmado. Recibirás un correo con los detalles del envío.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/pedidos">
            <Button variant="primary" fullWidth>Ver mis pedidos</Button>
          </Link>
          <Link href="/catalogo">
            <Button variant="outline" fullWidth>Seguir comprando</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}