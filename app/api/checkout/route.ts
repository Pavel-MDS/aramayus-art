import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

const SHIPPING = 25;
const TAX_RATE = 0.18;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const shipping = SHIPPING;
    const total = subtotal + tax + shipping;

    // Crear pedido pendiente en la DB
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        usuario_id: user.id,
        items,
        subtotal,
        envio: shipping,
        igv: tax,
        total,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (pedidoError || !pedido) {
      console.error(pedidoError);
      return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
    }

    // Line items para Stripe (en centavos)
    const line_items = items.map((item: { name: string; price: number; quantity: number; image: string; size: string; color: string }) => ({
      price_data: {
        currency: 'pen',
        product_data: {
          name: item.name,
          description: `Talla: ${item.size} · Color: ${item.color}`,
          images: item.image.startsWith('http') ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Agregar envío como línea aparte
    line_items.push({
      price_data: {
        currency: 'pen',
        product_data: { name: 'Envío' },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    });

    // Agregar IGV como línea aparte
    line_items.push({
      price_data: {
        currency: 'pen',
        product_data: { name: 'IGV (18%)' },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancelado`,
      metadata: {
        pedido_id: pedido.id,
        usuario_id: user.id,
      },
    });

    // Guardar el session_id en el pedido
    await supabase
      .from('pedidos')
      .update({ stripe_session_id: session.id })
      .eq('id', pedido.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 });
  }
}