"use client";

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';
import { ArrowLeft, Check } from 'lucide-react';

export default function RecuperarPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const supabase = createClient();

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    });

    if (error) {
      setError('Error al enviar el correo. Verifica tu email.');
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="font-serif-display text-2xl text-dark mb-2">Correo enviado</h2>
          <p className="text-[13px] text-muted mb-6">
            Revisa <strong>{email}</strong> y sigue las instrucciones para restablecer tu contraseña.
          </p>
          <Link href="/login">
            <Button variant="outline" fullWidth>Volver al login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-sm">
        <Link href="/login" className="flex items-center gap-1.5 text-[11px] text-muted hover:text-dark transition-colors mb-8">
          <ArrowLeft size={13} /> Volver al login
        </Link>

        <h2 className="font-serif-display text-2xl text-dark mb-1">Recuperar contraseña</h2>
        <p className="text-[12px] text-muted mb-6">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>

        <form onSubmit={handleRecuperar} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[11px] font-medium text-dark mb-1.5">Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="tu@correo.com"
              className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors" />
          </div>
          <Button variant="primary" fullWidth disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Button>
        </form>
      </div>
    </div>
  );
}