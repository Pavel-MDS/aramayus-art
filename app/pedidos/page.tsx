import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Package } from 'lucide-react';

interface ItemPedido {
  id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

const ESTADOS: Record<string, { label: string; className: string }> = {
  pendiente: { label: 'Pendiente de pago', className: 'text-amber-600 bg-amber-50' },
  pagado:    { label: 'Pagado',            className: 'text-green-600 bg-green-50' },
  enviado:   { label: 'Enviado',           className: 'text-blue-600 bg-blue-50' },
  entregado: { label: 'Entregado',         className: 'text-gray-600 bg-gray-100' },
  cancelado: { label: 'Cancelado',         className: 'text-red-600 bg-red-50' },
};

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/pedidos');

  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif-display text-[28px] text-dark mb-8">Mis pedidos</h1>

      {!pedidos || pedidos.length === 0 ? (
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
            const items = pedido.items as ItemPedido[];
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

                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-12 h-14 rounded-md overflow-hidden flex-shrink-0 bg-cream-deep">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-dark truncate">{item.name}</p>
                        <p className="text-[10px] text-muted">Talla {item.size} · x{item.quantity}</p>
                      </div>
                      <p className="text-[12px] text-terracotta font-medium">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
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