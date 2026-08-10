import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { EditableText } from './EditableText';

export function Hero() {
  const { settings, updateSettings } = useSettings();
  
  return (
    <section className="relative h-[70vh] bg-zinc-900 flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523398002811-999aa8e9f5b9?auto=format&fit=crop&q=80" 
          alt="Coleção" 
          className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent dark:from-black/80"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left">
        <EditableText 
          as="h1"
          value={settings.heroTitle}
          onSave={(newValue) => updateSettings({ ...settings, heroTitle: newValue })}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase max-w-3xl leading-tight inline-block"
        />
        <div className="mt-6">
          <EditableText 
            as="p"
            value={settings.heroSubtitle}
            onSave={(newValue) => updateSettings({ ...settings, heroSubtitle: newValue })}
            className="text-lg text-zinc-200 dark:text-zinc-300 max-w-xl md:mx-0 mx-auto font-medium"
          />
        </div>
        <div className="mt-10">
          <Link 
            to="/lancamentos" 
            className="inline-block bg-white dark:bg-zinc-100 text-black px-6 py-3 sm:px-10 sm:py-4 font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-zinc-200 dark:hover:bg-white transition-colors"
          >
            Comprar Agora
          </Link>
        </div>
      </div>
    </section>
  );
}
