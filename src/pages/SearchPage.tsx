import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      setProducts([]);
    }
  }, [query]);

  const searchProducts = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;

      if (data) {
        const mappedProducts: Product[] = data.map(item => ({
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
        setProducts(mappedProducts);
      }
    } catch (err: any) {
      console.warn('Error searching products:', err);
      setError('Não foi possível realizar a busca no momento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full mb-6">
          <Search className="h-8 w-8 text-zinc-900 dark:text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-zinc-900 dark:text-white transition-colors duration-300">
          Resultados da busca
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">
          {query ? (
            <>Mostrando resultados para: <span className="font-bold text-zinc-900 dark:text-white">"{query}"</span></>
          ) : (
            'Digite algo para buscar em nossa loja.'
          )}
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-900 dark:text-white mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">Buscando produtos...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center text-red-500 py-12">
          {error}
        </div>
      )}

      {!loading && !error && query && products.length === 0 && (
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">
          Nenhum produto encontrado para sua busca no momento.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
