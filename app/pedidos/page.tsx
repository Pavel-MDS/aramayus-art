"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ItemPedido {
  id: number;
  producto_id: string;
  nombre_producto: string;
  talla: string;
  color: string | null;
  cantidad: number;
  precio_unitario: string;
}

interface Pedido {
  id: string;
  subtotal: string;
  envio: string;
  igv: string;
  total: string;
  estado: string;
  created_at: string;
  items?: ItemPedido[];
}

const ESTADOS: Record<string, { label: string; className: string }> = {
  pendiente: { label: 'Pendiente de pago', className: 'text-amber-600 bg-amber-50' },
  pagado:    { label: 'Pagado',            className: 'text-green-600 bg-green-50' },
  enviado:   { label: 'Enviado',           className: 'text-blue-600 bg-blue-50' },
  entregado: { label: 'Entregado',         className: 'text-gray-600 bg-gray-100' },
  cancelado: { label: 'Cancelado',         className: 'text-red-600 bg-red-50' },
};

export default function PedidosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/pedidos');
      return;
    }
    if (user) {
      apiFetch('/pedidos')
        .then(setPedidos)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="max-w-3xl mx-auto px-6 py-12 text-center text-muted text-sm">Cargando...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif-display text-[28px] text-dark mb-8">Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="text-center py-20">
          <Package size={40} className="text-muted/30 mx-auto mb-4" />
          <p className="text-[13px] text-muted mb-4">Aún no tienes pedidos</p>
          <Link href="/catalogo" className="text-terracotta text-[13px] hover:underline">
            Explorar catálogo →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const estado = ESTADOS[pedido.estado] ?? ESTADOS.pendiente;
            return (
              <div key={pedido.id} className="border border-border-subtle rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] text-muted">
                      Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-muted">
                      {new Date(pedido.created_at).toLocaleDateString('es-PE', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium px-3 py-1 rounded-full ${estado.className}`}>
                    {estado.label}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-border-subtle">
                  <span className="text-[11px] text-muted">Total</span>
                  <span className="text-[16px] font-serif-display text-dark">
                    S/ {Number(pedido.total).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}