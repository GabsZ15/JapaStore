import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { X, Lock, LogIn } from 'lucide-react';

export function Footer() {
  const { enableAdminMode } = useAdmin();
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrompt(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      enableAdminMode();
      setShowPrompt(false);
      setPassword('');
      setError('');
    } else {
      setError("Senha incorreta!");
    }
  };

  return (
    <>
      <footer className="bg-zinc-950 dark:bg-black text-zinc-300 py-16 border-t border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link to="/" className="flex flex-col items-start mb-6">
              <img src="/logo.jpg" alt="JAPA STORE" className="h-16 w-auto object-contain rounded-md" />
            </Link>
            <p className="text-sm text-zinc-400 mb-6 max-w-xs leading-relaxed">
              Streetwear e moda casual para quem busca atitude e minimalismo. O melhor do design contemporâneo focado em qualidade e exclusividade.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Institucional</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre a Marca</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Dúvidas Frequentes</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trabalhe Conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Ajuda</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/faq" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Prazos de Entrega</Link></li>
              <li><Link to="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Rastrear Pedido</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Contato</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/contato" className="hover:text-white transition-colors">Atendimento via WhatsApp</Link></li>
              <li><Link to="/contato" className="hover:text-white transition-colors">contato@japastore.com.br</Link></li>
              <li className="pt-4 border-t border-zinc-800/50 mt-4">
                <span className="block text-xs text-zinc-500 mb-1">Horário de Atendimento:</span>
                Seg. a Sex. das 09h às 18h
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 font-medium">
            &copy; {new Date().getFullYear()} <span onClick={handleAdminClick} className="cursor-pointer hover:text-zinc-400 transition-colors">JapaStore</span>. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400">
            <span className="border border-zinc-800 px-3 py-1.5 rounded-sm">PIX</span>
            <span className="border border-zinc-800 px-3 py-1.5 rounded-sm">VISA</span>
            <span className="border border-zinc-800 px-3 py-1.5 rounded-sm">MASTERCARD</span>
            <span className="border border-zinc-800 px-3 py-1.5 rounded-sm">SECURE</span>
          </div>
        </div>
      </div>
    </footer>

      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => {
                setShowPrompt(false);
                setError('');
                setPassword('');
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col items-center mb-6 mt-2">
              <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-3 rounded-xl mb-3"> 
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black tracking-tighter uppercase text-zinc-900 dark:text-white">Acesso Restrito</h3>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if(error) setError('');
                  }}
                  autoFocus
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-lg text-center font-mono tracking-widest"
                  placeholder="Senha"
                />
                {error && <p className="text-red-500 text-xs mt-2 text-center font-bold">{error}</p>}
              </div>
              <button 
                type="submit" 
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-xs py-3 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-lg flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Acessar Edição Visual
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
