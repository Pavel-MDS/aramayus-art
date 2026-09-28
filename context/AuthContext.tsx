// Aramayus-Art/aramayus-nextjs/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiFetch, setTokenCookie, clearTokenCookie } from '@/lib/api';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface Perfil extends Usuario {
  altura?: number;
  peso?: number;
  pecho?: number;
  cintura?: number;
  cadera?: number;
  hombros?: number;
  talla_usual?: string;
}

interface AuthContextType {
  user: Usuario | null;
  perfil: Perfil | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registro: (nombre: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshPerfil: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarPerfil = async () => {
    try {
      const data = await apiFetch('/usuarios/perfil');
      setUser({ id: data.id, nombre: data.nombre, email: data.email, rol: data.rol });
      setPerfil(data);
    } catch {
      setUser(null);
      setPerfil(null);
      localStorage.removeItem('token');
      clearTokenCookie();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      cargarPerfil().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    setTokenCookie(data.token);
    await cargarPerfil();
  };

  const registro = async (nombre: string, email: string, password: string) => {
    const data = await apiFetch('/usuarios/registro', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    });
    localStorage.setItem('token', data.token);
    setTokenCookie(data.token);
    setUser(data.usuario);
  };

  const signOut = () => {
    localStorage.removeItem('token');
    clearTokenCookie();
    setUser(null);
    setPerfil(null);
  };

  const refreshPerfil = async () => {
    await cargarPerfil();
  };

  return (
    <AuthContext.Provider value={{ user, perfil, loading, login, registro, signOut, refreshPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}