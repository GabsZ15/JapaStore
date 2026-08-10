import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { EditableText } from './EditableText';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  onOpenAuth: () => void;
  onOpenCart: () => void;
}

export function Header({ toggleTheme, isDarkMode, onOpenAuth, onOpenCart }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { cartCount } = useCart();
  const { settings, updateSettings } = useSettings();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* Mobile menu button (Left) */}
            <div className="flex-1 flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo (Center on mobile, Left on desktop) */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <Link to="/" className="flex flex-col items-center">
                <img src="/logo.jpg" alt="JAPA STORE" className="h-12 md:h-16 w-auto object-contain rounded-md" />
              </Link>
            </div>

            {/* Desktop Navigation & Search */}
            <div className="hidden md:flex flex-1 items-center justify-center px-8">
              <nav className="flex space-x-8 text-sm font-bold tracking-wide uppercase mr-8">
                <Link to="/lancamentos" className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
                  <EditableText value={settings.navLink1} onSave={(v) => updateSettings({ ...settings, navLink1: v })} />
                </Link>
                <Link to="/roupas" className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
                  <EditableText value={settings.navLink2} onSave={(v) => updateSettings({ ...settings, navLink2: v })} />
                </Link>
                <Link to="/tenis" className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
                  <EditableText value={settings.navLink3} onSave={(v) => updateSettings({ ...settings, navLink3: v })} />
                </Link>
                <Link to="/sale" className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors">
                  <EditableText value={settings.navLink4} onSave={(v) => updateSettings({ ...settings, navLink4: v })} />
                </Link>
              </nav>

              <form onSubmit={handleSearch} className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="O que você procura?"
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent rounded-full py-2 pl-4 pr-10 text-sm focus:bg-white dark:focus:bg-zinc-800 focus:border-zinc-300 dark:focus:border-zinc-700 focus:ring-0 transition-all outline-none border text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Icons (Right) */}
            <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-5 text-zinc-900 dark:text-zinc-100">
              <button onClick={toggleTheme} className="hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors hidden sm:block" aria-label="Toggle Dark Mode">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={onOpenAuth} className="hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors hidden sm:block">
                <User className="h-5 w-5" />
              </button>
              <Link to="/favoritos" className="hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors hidden sm:block relative">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <button onClick={onOpenCart} className="hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMobileMenu}
      />
      
      <div 
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white dark:bg-zinc-950 z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <img src="/logo.jpg" alt="JAPA STORE" className="h-8 w-auto rounded-sm" />
          <button 
            onClick={closeMobileMenu}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você procura?"
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent rounded-lg py-3 pl-4 pr-10 text-sm focus:bg-white dark:focus:bg-zinc-800 focus:border-zinc-300 dark:focus:border-zinc-700 focus:ring-0 transition-all outline-none border text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col space-y-1 px-4">
            <Link 
              to="/lancamentos" 
              onClick={closeMobileMenu}
              className="py-3 text-sm font-bold tracking-wide uppercase text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900"
            >
              {settings.navLink1 || 'Lançamentos'}
            </Link>
            <Link 
              to="/roupas" 
              onClick={closeMobileMenu}
              className="py-3 text-sm font-bold tracking-wide uppercase text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900"
            >
              {settings.navLink2 || 'Roupas'}
            </Link>
            <Link 
              to="/tenis" 
              onClick={closeMobileMenu}
              className="py-3 text-sm font-bold tracking-wide uppercase text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900"
            >
              {settings.navLink3 || 'Tênis'}
            </Link>
            <Link 
              to="/sale" 
              onClick={closeMobileMenu}
              className="py-3 text-sm font-bold tracking-wide uppercase text-red-600 dark:text-red-500 border-b border-zinc-100 dark:border-zinc-900"
            >
              {settings.navLink4 || 'Sale'}
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { closeMobileMenu(); onOpenAuth(); }}
              className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-bold"
            >
              <User className="h-5 w-5" />
              <span className="text-sm uppercase tracking-wide">Entrar / Cadastrar</span>
            </button>
            <Link 
              to="/favoritos" 
              onClick={closeMobileMenu}
              className="flex items-center justify-between text-zinc-900 dark:text-zinc-100 font-bold"
            >
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5" />
                <span className="text-sm uppercase tracking-wide">Meus Favoritos</span>
              </div>
              {favorites.length > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-bold mt-2 pt-4 border-t border-zinc-200 dark:border-zinc-800"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="text-sm uppercase tracking-wide">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
