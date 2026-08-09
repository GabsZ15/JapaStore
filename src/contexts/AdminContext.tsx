import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdminMode: boolean;
  enableAdminMode: () => void;
  disableAdminMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  useEffect(() => {
    // Check URL params for admin secret
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'admin123') { // Simple secret key
      setIsAdminMode(true);
      sessionStorage.setItem('@JapaStore:inline_admin', 'true');
      // Remove param from URL to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check session storage
      const saved = sessionStorage.getItem('@JapaStore:inline_admin');
      if (saved === 'true') {
        setIsAdminMode(true);
      }
    }
  }, []);

  const enableAdminMode = () => {
    setIsAdminMode(true);
    sessionStorage.setItem('@JapaStore:inline_admin', 'true');
  };

  const disableAdminMode = () => {
    setIsAdminMode(false);
    sessionStorage.removeItem('@JapaStore:inline_admin');
  };

  return (
    <AdminContext.Provider value={{ isAdminMode, enableAdminMode, disableAdminMode }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
