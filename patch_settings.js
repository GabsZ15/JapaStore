const fs = require('fs');

let content = fs.readFileSync('src/contexts/SettingsContext.tsx', 'utf-8');

// Add import for SiteContent
content = content.replace("import { supabase } from '../lib/supabase';", "import { supabase } from '../lib/supabase';\nimport { SiteContent, defaultSiteContent } from '../types';");

// Add siteContent to SiteSettings interface
content = content.replace(
  "navLink4: string;\n}",
  "navLink4: string;\n  siteContent: SiteContent;\n}"
);

// Add siteContent to defaultSettings
content = content.replace(
  'navLink4: "Sale",\n};',
  'navLink4: "Sale",\n  siteContent: defaultSiteContent,\n};'
);

// Fetch: add logic for siteContent fallback to localStorage
const fetchReplacement = `
      if (data) {
        // Fallback to localStorage if the DB doesn't have the column yet
        let dbSiteContent = data.site_content;
        if (!dbSiteContent) {
          const localStr = localStorage.getItem('siteContent_fallback');
          if (localStr) {
            try {
              dbSiteContent = JSON.parse(localStr);
            } catch (e) {}
          }
        }
        
        // Deep merge to ensure all properties exist
        const mergedSiteContent = dbSiteContent ? { ...defaultSiteContent, ...dbSiteContent } : defaultSiteContent;

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
`;
content = content.replace("if (data) {", fetchReplacement.trim());
content = content.replace("navLink4: data.nav_link4 || defaultSettings.navLink4,\n        });", ""); // Remove old setSettings block

// Update: handle 42703 error
const updateReplacement = `
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
          console.warn('Column site_content missing in DB! Using localStorage as fallback. PLEASE RUN THE ALTER TABLE SQL.');
          localStorage.setItem('siteContent_fallback', JSON.stringify(newSettings.siteContent));
          // We must update the rest of the settings without site_content to persist them
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
        // Successful save to DB, clear local storage fallback
        localStorage.removeItem('siteContent_fallback');
      }

      setSettings(newSettings);
    } catch (err) {
      console.warn('Failed to update settings', err);
      throw err;
    }
  };
`;
content = content.replace(/const updateSettings = async.*?};/s, updateReplacement.trim());

fs.writeFileSync('src/contexts/SettingsContext.tsx', content);
