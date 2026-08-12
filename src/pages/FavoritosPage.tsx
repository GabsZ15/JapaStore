import { useFavorites } from '../contexts/FavoritesContext';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export function FavoritosPage() {
  const { settings } = useSettings();
  const texts = settings.siteContent.favoritesPage;
  const { favorites } = useFavorites();

  return (
    <main className="min-h-screen py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-6 text-red-500">
          <Heart className="h-8 w-8 fill-current" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-zinc-900 dark:text-white transition-colors duration-300">{texts.title}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg max-w-xl">{texts.emptyStateTitle}</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">{texts.emptyStateText}</div>
      )}
    </main>
  );
}
