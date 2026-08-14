import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { SiteContent, defaultSiteContent } from '../types';

export interface SiteSettings {
  topBarText: string;
  heroTitle: string;
  heroSubtitle: string;
  carouselTitle: string;
  whatsappNumber: string;
  navLink1: string;
  navLink2: string;
  navLink3: string;
  navLink4: string;
  siteContent: SiteContent;
}

const defaultSettings: SiteSettings = {
  topBarText: "FRETE GRÁTIS PARA TODO BRASIL ACIMA DE R$ 299",
  heroTitle: "NOVA COLEÇÃO ESTELAR",
  heroSubtitle: "O futuro do streetwear já chegou. Peças exclusivas com design minimalista e conforto máximo para o seu dia a dia.",
  carouselTitle: "Camisetas Para Todos os Momentos",
  whatsappNumber: "5511999999999",
  navLink1: "Camisetas",
  navLink2: "Bermudas",
  navLink3: "Moletons",
  navLink4: "Acessórios",
  siteContent: defaultSiteContent,
};

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.warn('Supabase not connected or error fetching settings:', JSON.stringify(error));
        return;
      }
      
      if (data) {
        let dbSiteContent = data.site_content;
        if (!dbSiteContent) {
          const localStr = localStorage.getItem('siteContent_fallback');
          if (localStr) {
            try {
              dbSiteContent = JSON.parse(localStr);
            } catch (e) {}
          }
        }
        
        
        const mergedSiteContent = dbSiteContent ? { 
          ...defaultSiteContent, 
          ...dbSiteContent,
          pages: {
            ...defaultSiteContent.pages,
            ...(dbSiteContent.pages || {})
          },
          homeCategories: {
            ...defaultSiteContent.homeCategories,
            ...(dbSiteContent.homeCategories || {})
          }
        } : defaultSiteContent;


        setSettings({
          topBarText: data.top_bar_text || defaultSettings.topBarText,
          heroTitle: data.hero_title || defaultSettings.heroTitle,
          heroSubtitle: data.hero_subtitle || defaultSettings.heroSubtitle,
          carouselTitle: data.carousel_title || defaultSettings.carouselTitle,
          whatsappNumber: data.whatsapp_number || defaultSettings.whatsappNumber,
          navLink1: data.nav_link1 || defaultSettings.navLink1,
          navLink2: data.nav_link2 || defaultSettings.navLink2,
          navLink3: data.nav_link3 || defaultSettings.navLink3,
          navLink4: data.nav_link4 || defaultSettings.navLink4,
          siteContent: mergedSiteContent,
        });
      }
    } catch (err) {
      console.warn('Failed to fetch settings (probably no Supabase backend)', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 1,
          top_bar_text: newSettings.topBarText,
          hero_title: newSettings.heroTitle,
          hero_subtitle: newSettings.heroSubtitle,
          carousel_title: newSettings.carouselTitle,
          whatsapp_number: newSettings.whatsappNumber,
          nav_link1: newSettings.navLink1,
          nav_link2: newSettings.navLink2,
          nav_link3: newSettings.navLink3,
          nav_link4: newSettings.navLink4,
          site_content: newSettings.siteContent,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        if (error.code === '42703') {
          console.warn('Column site_content missing in DB! Using localStorage as fallback.');
          localStorage.setItem('siteContent_fallback', JSON.stringify(newSettings.siteContent));
          const { error: fallbackError } = await supabase
            .from('settings')
            .upsert({
              id: 1,
              top_bar_text: newSettings.topBarText,
              hero_title: newSettings.heroTitle,
              hero_subtitle: newSettings.heroSubtitle,
              carousel_title: newSettings.carouselTitle,
              whatsapp_number: newSettings.whatsappNumber,
              nav_link1: newSettings.navLink1,
              nav_link2: newSettings.navLink2,
              nav_link3: newSettings.navLink3,
              nav_link4: newSettings.navLink4,
              updated_at: new Date().toISOString(),
            });
          if (fallbackError) throw fallbackError;
        } else {
          throw error;
        }
      } else {
        localStorage.removeItem('siteContent_fallback');
      }

      setSettings(newSettings);
    } catch (err) {
      console.warn('Failed to update settings', err);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
