import { useAdmin } from '../../contexts/AdminContext';
import { Settings, LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminToolbar() {
  const { isAdminMode, disableAdminMode } = useAdmin();
  const navigate = useNavigate();

  if (!isAdminMode) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-bottom-6 border border-zinc-800 dark:border-zinc-300">
      <div className="flex items-center gap-2 pr-4 border-r border-zinc-700 dark:border-zinc-300">
        <Settings className="w-4 h-4 animate-spin-slow" />
        <span className="text-sm font-bold tracking-wider uppercase">Modo Editor Visual</span>
      </div>
      
      <button 
        onClick={() => navigate('/admin')}
        className="text-xs font-bold uppercase hover:text-zinc-300 dark:hover:text-zinc-600 transition-colors flex items-center gap-1"
      >
        <Plus className="w-4 h-4" />
        Gerenciar Produtos
      </button>
      
      <button 
        onClick={() => {
          disableAdminMode();
          navigate('/');
        }}
        className="text-xs font-bold uppercase hover:text-zinc-300 dark:hover:text-zinc-600 transition-colors flex items-center gap-1 ml-2 text-red-400 dark:text-red-500"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </button>
    </div>
  );
}
