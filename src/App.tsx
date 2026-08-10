/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { LancamentosPage } from './pages/LancamentosPage';
import { RoupasPage } from './pages/RoupasPage';
import { TenisPage } from './pages/TenisPage';
import { SalePage } from './pages/SalePage';
import { SobrePage } from './pages/SobrePage';
import { FaqPage } from './pages/FaqPage';
import { ContatoPage } from './pages/ContatoPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritosPage } from './pages/FavoritosPage';
import { AdminPage } from './pages/AdminPage';

// Contexts
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AdminProvider } from './contexts/AdminContext';
import { AdminToolbar } from './components/AdminToolbar';

function StoreLayout({ 
  toggleTheme, 
  isDarkMode, 
  setIsAuthModalOpen, 
  setIsCartOpen 
}: { 
  toggleTheme: () => void, 
  isDarkMode: boolean, 
  setIsAuthModalOpen: (v: boolean) => void, 
  setIsCartOpen: (v: boolean) => void 
}) {
  return (
    <>
      <AdminToolbar />
      <TopBar />
      <Header 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lancamentos" element={<LancamentosPage />} />
          <Route path="/roupas" element={<RoupasPage />} />
          <Route path="/tenis" element={<TenisPage />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/favoritos" element={<FavoritosPage />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

function StoreApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isCartOpen, setIsCartOpen } = useCart();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <FavoritesProvider>
      <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-50 dark:selection:text-zinc-900 transition-colors duration-300">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <StoreLayout 
              toggleTheme={toggleTheme} 
              isDarkMode={isDarkMode} 
              setIsAuthModalOpen={setIsAuthModalOpen} 
              setIsCartOpen={setIsCartOpen} 
            />
          } />
        </Routes>
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />

        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </BrowserRouter>
    </FavoritesProvider>
  );
}

import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <SettingsProvider>
          <CartProvider>
            <StoreApp />
          </CartProvider>
        </SettingsProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
