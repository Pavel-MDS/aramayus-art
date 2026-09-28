"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
//import { createClient } from '@/lib/supabase/client';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/Button';
import { User, Ruler, LogOut, Check } from 'lucide-react';

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function PerfilPage() {
  const { user, perfil, signOut, refreshPerfil } = useAuth();
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    nombre:      perfil?.nombre      ?? '',
    altura:      perfil?.altura      ?? '',
    peso:        perfil?.peso        ?? '',
    pecho:       perfil?.pecho       ?? '',
    cintura:     perfil?.cintura     ?? '',
    cadera:      perfil?.cadera      ?? '',
    hombros:     perfil?.hombros     ?? '',
    talla_usual: perfil?.talla_usual ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);
  setError('');

  try {
    await apiFetch('/usuarios/perfil', {
      method: 'PUT',
      body: JSON.stringify({
        nombre: form.nombre,
        altura: form.altura || null,
        peso: form.peso || null,
        pecho: form.pecho || null,
        cintura: form.cintura || null,
        cadera: form.cadera || null,
        hombros: form.hombros || null,
        talla_usual: form.talla_usual || null,
      }),
    });
    await refreshPerfil();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  } catch {
    setError('Error al guardar los cambios');
  }

  setSaving(false);
};

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif-display text-[32px] text-dark">Mi perfil</h1>
          <p className="text-[12px] text-muted mt-1">{user?.email}</p>
        </div>
        <button onClick={signOut}
          className="flex items-center gap-2 text-[11px] text-muted hover:text-dark border border-border-subtle px-4 py-2 rounded-lg transition-colors">
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Datos personales */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <User size={15} className="text-terracotta" />
            <h2 className="text-[13px] font-medium text-dark">Datos personales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-muted mb-1.5">Nombre completo</label>
              <input name="nombre" value={form.nombre} onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors" />
            </div>
          </div>
        </section>

        {/* Medidas corporales */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <Ruler size={15} className="text-terracotta" />
            <h2 className="text-[13px] font-medium text-dark">Medidas corporales</h2>
          </div>
          <p className="text-[11px] text-muted mb-4 ml-5">
            Tus medidas se usan para sugerir tallas automáticamente en el catálogo.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: 'altura', label: 'Altura (cm)',  placeholder: '165' },
              { name: 'peso',   label: 'Peso (kg)',    placeholder: '65'  },
              { name: 'pecho',  label: 'Pecho (cm)',   placeholder: '88'  },
              { name: 'cintura',label: 'Cintura (cm)', placeholder: '72'  },
              { name: 'cadera', label: 'Cadera (cm)',  placeholder: '96'  },
              { name: 'hombros',label: 'Hombros (cm)', placeholder: '40'  },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-[11px] text-muted mb-1.5">{field.label}</label>
                <input
                  type="number" name={field.name}
                  value={(form as Record<string, string | number>)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  min={0} step={0.1}
                  className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-[13px] text-dark bg-cream focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Talla usual */}
          <div className="mt-4">
            <label className="block text-[11px] text-muted mb-1.5">Talla usual</label>
            <div className="flex gap-2 flex-wrap">
              {TALLAS.map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(prev => ({ ...prev, talla_usual: t }))}
                  className={`px-4 py-2 rounded-md border text-[11px] font-medium transition-colors ${
                    form.talla_usual === t
                      ? 'bg-dark text-cream border-dark'
                      : 'border-border-subtle text-dark hover:border-dark'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Guardar */}
        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-[12px] text-green-600">
              <Check size={13} /> Cambios guardados
            </span>
          )}
        </div>
      </form>
    </div>
  );
}