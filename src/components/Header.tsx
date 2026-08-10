import React from 'react';
import { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, Moon, Sun } from 'lucide-react';
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
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { cartCount } = useCart();
  const { settings, updateSettings } = useSettings();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Mobile menu button */}
          <div className="flex-1 flex items-center md:hidden">
            <button className="p-2 -ml-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link to="/" className="flex flex-col items-center">
              <img src="/logo.jpg" alt="JAPA STORE" className="h-16 w-auto object-contain rounded-md" />
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

          {/* Icons */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-5 text-zinc-900 dark:text-zinc-100">
            <button onClick={toggleTheme} className="hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors" aria-label="Toggle Dark Mode">
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
  );
}
