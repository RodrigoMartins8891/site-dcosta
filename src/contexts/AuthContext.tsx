import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API = 'http://localhost:3001';

interface User {
  id: number;
  nome: string;
  email: string;
  estado?: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLogged: boolean;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,  setUser]  = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Carrega sessão salva
  useEffect(() => {
    const savedToken = localStorage.getItem('@OrdenhaParts:token');
    const savedUser  = localStorage.getItem('@OrdenhaParts:user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  async function login(email: string, senha: string) {
    const res = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, senha }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao fazer login');
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('@OrdenhaParts:token', data.token);
    localStorage.setItem('@OrdenhaParts:user',  JSON.stringify(data.user));
  }

  async function register(formData: RegisterData) {
    const res = await fetch(`${API}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao cadastrar');
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('@OrdenhaParts:token', data.token);
    localStorage.setItem('@OrdenhaParts:user',  JSON.stringify(data.user));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@OrdenhaParts:token');
    localStorage.removeItem('@OrdenhaParts:user');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLogged: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
