import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { Benefits } from '../components/Benefits';
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
      <Benefits />
    </main>
  );
}
