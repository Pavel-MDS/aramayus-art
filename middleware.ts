// Aramayus-Art/aramayus-nextjs/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const RUTAS_PROTEGIDAS = ['/perfil', '/pedidos', '/probador-ia'];
const RUTAS_AUTH = ['/login', '/registro'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Redirigir a login si no está autenticado en rutas protegidas
  if (!user && RUTAS_PROTEGIDAS.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
  }

  // Redirigir al perfil si ya está autenticado e intenta ir a login/registro
  if (user && RUTAS_AUTH.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/perfil', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};