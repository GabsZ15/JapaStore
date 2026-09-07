import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useSettings } from '../../contexts/SettingsContext';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { settings } = useSettings();
  const texts = settings.siteContent.authModal;
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'auth' | 'address'>('auth');
  const [addressData, setAddressData] = useState({
    name: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: ''
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { address: addressData }
      });
      if (error) throw error;
      setStep('auth');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar endereço.');
    } finally {
      setLoading(false);
    }
  };

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
      setAddressData(prev => ({ ...prev, name: fullName }));
      setStep('address');
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
      setAddressData(prev => ({ ...prev, name: fullName }));
      setStep('address');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
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
          onClick={() => { setStep('auth'); onClose(); }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'auth' ? (
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'login' 
                  ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' 
                  : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
              }`}
              onClick={() => { setActiveTab('login'); setError(null); }}
            >{texts.loginTab}</button>
            <button
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'register' 
                  ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' 
                  : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
              }`}
              onClick={() => { setActiveTab('register'); setError(null); }}
            >{texts.registerTab}</button>
          </div>
        ) : (
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center shrink-0">
            <h3 className="font-bold uppercase tracking-wider text-sm text-zinc-900 dark:text-white">Dados de Entrega (Opcional)</h3>
          </div>
        )}

        <div className="p-8 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
          {step === 'address' ? (
            <form className="flex flex-col gap-4" onSubmit={handleSaveAddress}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">CPF</label>
                <input type="text" value={addressData.cpf} onChange={e => setAddressData(p => ({ ...p, cpf: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" placeholder="000.000.000-00" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">CEP</label>
                  <input type="text" value={addressData.cep} onChange={e => setAddressData(p => ({ ...p, cep: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" placeholder="00000-000" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cidade - UF</label>
                  <input type="text" value={addressData.city} onChange={e => setAddressData(p => ({ ...p, city: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Rua</label>
                <input type="text" value={addressData.street} onChange={e => setAddressData(p => ({ ...p, street: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Número</label>
                  <input type="text" value={addressData.number} onChange={e => setAddressData(p => ({ ...p, number: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Bairro</label>
                  <input type="text" value={addressData.neighborhood} onChange={e => setAddressData(p => ({ ...p, neighborhood: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? 'Salvando...' : 'Salvar Endereço'}
              </button>
              <button type="button" onClick={() => { setStep('auth'); onClose(); }} className="w-full text-zinc-500 text-xs font-bold uppercase hover:text-zinc-900 dark:hover:text-white transition-colors text-center mt-2">
                Pular
              </button>
            </form>
          ) : activeTab === 'login' ? (
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">{texts.emailLabel}</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder={texts.emailPlaceholder}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">{texts.passwordLabel}</label>
                  <a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline underline-offset-2">{texts.forgotPasswordText}</a>
                </div>
                <input 
                  type="password" 
                  required
                  minLength={5}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder={texts.passwordPlaceholder}
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? texts.loadingButton : texts.loginButton}
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">{texts.nameLabel}</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder={texts.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">{texts.emailLabel}</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder={texts.emailPlaceholder}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">{texts.passwordLabel}</label>
                <input 
                  type="password" 
                  required
                  minLength={5}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder={texts.createPasswordPlaceholder}
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? texts.loadingButton : texts.registerButton}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
