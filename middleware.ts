// Aramayus-Art/aramayus-nextjs/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const RUTAS_PROTEGIDAS = ['/perfil', '/pedidos', '/probador-ia'];
const RUTAS_AUTH = ['/login', '/registro'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  if (!token && RUTAS_PROTEGIDAS.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
  }

  if (token && RUTAS_AUTH.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/perfil', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};