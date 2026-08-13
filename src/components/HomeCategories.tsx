import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export function HomeCategories() {
  const { settings } = useSettings();
  const categoriesRaw = settings?.siteContent?.homeCategories?.items || [];
  const order = ['camisetas', 'bermudas', 'moletons'];
  const categories = [...categoriesRaw].sort((a, b) => {
    const idxA = order.indexOf(a.id);
    const idxB = order.indexOf(b.id);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  if (categories.length === 0) return null;

  return (
    <section className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={category.id === "moletons" ? "/moletons" : category.id === "camisetas" ? "/camisetas" : category.id === "bermudas" ? "/bermudas" : category.linkTo}
            className="group relative block aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <img 
              src={category.imageUrl} 
              alt={category.title} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

          </Link>
        ))}
      </div>
    </section>
  );
}
