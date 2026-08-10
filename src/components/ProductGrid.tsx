import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { EditableText } from './EditableText';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../lib/supabase';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Camiseta Oversized Heavyweight Preta',
    price: 129.90,
    installments: 3,
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600',
    category: 'Roupas'
  },
  {
    id: '2',
    name: 'Moletom Essential Canguru Cinza',
    price: 259.90,
    originalPrice: 299.90,
    discount: 15,
    installments: 6,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
    category: 'Roupas'
  },
  {
    id: '3',
    name: 'Calça Cargo Utility Khaki',
    price: 199.90,
    installments: 4,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d1ead6bb246d?auto=format&fit=crop&q=80&w=600',
    outOfStock: true,
    category: 'Roupas'
  },
  {
    id: '4',
    name: 'Tênis Casual Retro Branco',
    price: 349.90,
    installments: 12,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
    category: 'Tenis'
  },
  {
    id: '5',
    name: 'Boné Dad Hat Logo Minimal',
    price: 89.90,
    installments: 2,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
    category: 'Acessorios'
  }
];

interface ProductGridProps {
  title?: string;
  onTitleChange?: (newTitle: string) => void;
  category?: string;
  linkText?: string;
  linkTo?: string;
}

export function ProductGrid({ 
  title = "Camisetas Para Todos os Momentos",
  onTitleChange,
  category, 
  linkText = "Ver tudo", 
  linkTo = "/lancamentos" 
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase not connected or error fetching products:', JSON.stringify(error));
        return;
      }

      let allProducts = [...MOCK_PRODUCTS];

      if (data && data.length > 0) {
        // Map Supabase columns to Product type
        const supabaseProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          installments: item.installments,
          discount: item.discount,
          category: item.category,
          imageUrl: item.image_url,
          outOfStock: item.out_of_stock,
          description: item.description
        }));
        
        allProducts = [...supabaseProducts, ...MOCK_PRODUCTS];
      }

      if (category) {
        if (category.toLowerCase() === 'sale') {
          setProducts(allProducts.filter(p => p.discount));
        } else {
          setProducts(allProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase() || p.category?.toLowerCase() === 'acessorios'));
        }
      } else {
        setProducts(allProducts);
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
      
      <div className="mt-4 flex justify-center">
        <Link to={linkTo} className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 underline underline-offset-4 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
          {linkText}
        </Link>
      </div>
    </section>
  );
}
