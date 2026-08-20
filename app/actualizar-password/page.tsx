"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/Button';
import { Eye, EyeOff } from 'lucide-react';

export default function ActualizarPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const supabase = createClient();

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError('Error al actualizar la contraseña');
      setLoading(false);
      return;
    }

    router.push('/perfil');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-sm">
        <h2 className="font-serif-display text-2xl text-dark mb-1">Nueva contraseña</h2>
        <p className="text-[12px] text-muted mb-6">Elige una contraseña segura.</p>

        <form onSubmit={handleActualizar} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[11px] font-medium text-dark mb-1.5">Nueva contraseña</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8} placeholder="••••••••"
                className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors pr-10" />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <Button variant="primary" fullWidth disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>
        </form>
      </div>
    </div>
  );
}