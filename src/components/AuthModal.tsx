import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'O Login com Google requer configuração adicional no Supabase/Google Cloud (ID do cliente e segredo).');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-zinc-950 w-full max-w-md shadow-2xl overflow-hidden transition-colors duration-300 flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'login' 
                ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' 
                : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
            }`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >
            Entrar
          </button>
          <button
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'register' 
                ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' 
                : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
            }`}
            onClick={() => { setActiveTab('register'); setError(null); }}
          >
            Criar Conta
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
          {activeTab === 'login' ? (
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">E-mail</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="Seu e-mail"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Senha</label>
                  <a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline underline-offset-2">Esqueceu a senha?</a>
                </div>
                <input 
                  type="password" 
                  required
                  minLength={5}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="Sua senha"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? 'Aguarde...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">E-mail</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="Seu e-mail"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Senha</label>
                <input 
                  type="password" 
                  required
                  minLength={5}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="Crie uma senha"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? 'Aguarde...' : 'Criar Conta'}
              </button>
            </form>
          )}

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500 uppercase font-bold tracking-wider transition-colors duration-300">Ou acesse com</span>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
