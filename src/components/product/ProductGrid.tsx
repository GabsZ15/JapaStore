import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { mapSupabaseProduct } from '../../utils/productUtils';
import { EditableText } from '../admin/EditableText';
import { useSettings } from '../../contexts/SettingsContext';
import { supabase } from '../../lib/supabase';

interface ProductGridProps {
  title?: string;
  onTitleChange?: (newTitle: string) => void;
  category?: string;
  linkText?: string;
  onLinkTextChange?: (newText: string) => void;
  linkTo?: string;
  layout?: 'grid' | 'carousel';
}

export function ProductGrid({ 
  title = "Camisetas Para Todos os Momentos",
  onTitleChange,
  category, 
  linkText = "Ver tudo", 
  linkTo = "/lancamentos",
  onLinkTextChange,
  layout = 'carousel'
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      let query = supabase.from('products').select('*');
      
      // Optimização: filtra direto no banco de dados se houver categoria
      // Isso evita baixar centenas de produtos desnecessários.
      if (category) {
        query = query.ilike('category', `%${category}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase not connected or error fetching products:', JSON.stringify(error));
        return;
      }

      if (data) {
        // Map Supabase columns to Product type
        let supabaseProducts: Product[] = data.map(mapSupabaseProduct);
        
        // Mantém o filtro local por precaução contra acentos que possam não ter sido pegos pelo ilike
        if (category) {
          supabaseProducts = supabaseProducts.filter(p => {
            const prodCat = p.category?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") || "";
            const targetCat = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            return prodCat.includes(targetCat) || targetCat.includes(prodCat);
          });
        }
        
        setProducts(supabaseProducts);
      }
    } catch (err) {
      console.warn('Failed to fetch products (probably no Supabase backend)', err);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors duration-300">
        {onTitleChange ? (
          <EditableText 
            as="h2"
            value={title}
            onSave={onTitleChange}
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white transition-colors duration-300 inline-block"
          />
        ) : (
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white transition-colors duration-300">
            {title}
          </h2>
        )}
      </div>
      
      {layout === 'carousel' ? (
        <div className="relative group">
          <button 
            onClick={scrollLeft}
            className="absolute top-[35%] left-2 md:left-4 -translate-y-1/2 z-10 p-3 bg-white/80 hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button 
            onClick={scrollRight}
            className="absolute top-[35%] right-2 md:right-4 -translate-y-1/2 z-10 p-3 bg-white/80 hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div 
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-8 snap-x snap-mandatory hide-scrollbar relative z-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {products.map((product) => (
              <div key={product.id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] md:min-w-[260px] md:max-w-[260px] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-center">
        {onLinkTextChange ? (
          <EditableText 
            as="span"
            value={linkText}
            onSave={onLinkTextChange}
            className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 underline underline-offset-4 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors cursor-pointer"
          />
        ) : (
          <Link to={linkTo} className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 underline underline-offset-4 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
            {linkText}
          </Link>
        )}
      </div>
    </section>
  );
}
