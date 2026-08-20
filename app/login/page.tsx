// Aramayus-Art/aramayus-nextjs/app/login/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Mensaje de registro exitoso
    if (searchParams.get('registro') === 'exitoso') {
      setSuccess('¡Cuenta creada! Ya puedes iniciar sesión.');
    }
    // Mensaje de cierre de sesión
    if (searchParams.get('logout') === 'exitoso') {
      setSuccess('Has cerrado sesión correctamente.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Correo o contraseña incorrectos'
        : 'Error al iniciar sesión'
      );
      setLoading(false);
      return;
    }

    // Redirigir a la página que intentaba acceder o al perfil
    const redirect = searchParams.get('redirect') || '/perfil';
    router.push(redirect);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif-display text-2xl text-dark">
            Aramayu<span className="text-gold">&apos;s</span> Art
          </Link>
          <p className="text-[12px] text-muted mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-[12px] px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-dark mb-1.5">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-dark mb-1.5">Contraseña</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/recuperar-password"
              className="text-[11px] text-terracotta hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button variant="primary" fullWidth type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        <p className="text-center text-[11px] text-muted mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-terracotta hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}