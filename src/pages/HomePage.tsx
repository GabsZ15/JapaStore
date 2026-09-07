import { Hero } from '../components';
import { ProductGrid } from '../components';
import { HomeCategories } from '../components';
import { Benefits } from '../components';
import { useSettings } from '../contexts/SettingsContext';

export function HomePage() {
  const { settings, updateSettings } = useSettings();
  
  return (
    <main>
      <Hero />
      <ProductGrid 
        title={settings.carouselTitle} 
        onTitleChange={(newTitle) => updateSettings({ ...settings, carouselTitle: newTitle })}
      />
      <HomeCategories />
      <Benefits />
    </main>
  );
}
