// Aramayus-Art/aramayus-nextjs/app/registro/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre]     = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const { registro: registrarUsuario } = useAuth();

  const validaciones = [
    { label: 'Al menos 8 caracteres', ok: password.length >= 8 },
    { label: 'Una letra mayúscula', ok: /[A-Z]/.test(password) },
    { label: 'Un número', ok: /\d/.test(password) },
  ];

  const handleRegistro = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  if (!validaciones.every(v => v.ok)) {
    setError('La contraseña no cumple los requisitos');
    setLoading(false);
    return;
  }

  try {
    await registrarUsuario(nombre, email, password);
    setSuccess(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
  }
  setLoading(false);
};

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="font-serif-display text-2xl text-dark mb-2">¡Cuenta creada!</h2>
          <p className="text-[13px] text-muted mb-6">
            Revisa tu correo <strong>{email}</strong> y confirma tu cuenta para continuar.
          </p>
          <Link href="/login">
            <Button variant="primary" fullWidth>Ir a iniciar sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif-display text-2xl text-dark">
            Aramayu<span className="text-gold">&apos;s</span> Art
          </Link>
          <p className="text-[12px] text-muted mt-1">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleRegistro} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-dark mb-1.5">Nombre completo</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
              required placeholder="Tu nombre"
              className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors" />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-dark mb-1.5">Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="tu@correo.com"
              className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors" />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-dark mb-1.5">Contraseña</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors pr-10" />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Requisitos de contraseña */}
            {password && (
              <ul className="mt-2 space-y-1">
                {validaciones.map(v => (
                  <li key={v.label} className={`flex items-center gap-1.5 text-[10px] transition-colors ${v.ok ? 'text-green-600' : 'text-muted'}`}>
                    <Check size={10} className={v.ok ? 'opacity-100' : 'opacity-30'} />
                    {v.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button variant="primary" fullWidth disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="text-center text-[11px] text-muted mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-terracotta hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}