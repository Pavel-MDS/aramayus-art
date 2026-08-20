import Link from 'next/link';
import { Button } from '@/components/Button';
import { XCircle } from 'lucide-react';

export default function CheckoutCanceladoPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={32} className="text-red-400" />
        </div>
        <h1 className="font-serif-display text-[28px] text-dark mb-2">Pago cancelado</h1>
        <p className="text-[13px] text-muted mb-8">
          No se realizó ningún cargo. Tu carrito sigue guardado.
        </p>
        <Link href="/checkout">
          <Button variant="primary" fullWidth>Volver a intentar</Button>
        </Link>
      </div>
    </div>
  );
}