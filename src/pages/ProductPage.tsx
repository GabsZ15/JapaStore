import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { mapSupabaseProduct } from '../utils/productUtils';
import { useCart } from '../contexts/CartContext';
import { ShippingCalculator } from '../components/ShippingCalculator';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, ChevronLeft, ShoppingBag } from 'lucide-react';
import { TopBar } from '../components/TopBar';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.warn('Error fetching product:', error);
        setProduct(null);
      } else if (data) {
        const mapped = mapSupabaseProduct(data);
        setProduct(mapped);
        setActiveImage(mapped.imageUrl);
        if (mapped.sizes && mapped.sizes.length > 0) {
          setSelectedSize(mapped.sizes[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load product', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 dark:border-white"></div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-black uppercase mb-4 dark:text-white">Produto não encontrado</h1>
        <p className="text-zinc-500 mb-8">O produto que você está procurando não existe ou foi removido.</p>
        <button onClick={() => navigate(-1)} className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
          Voltar
        </button>
      </main>
    );
  }

  const allImages = [product.imageUrl, ...(product.extraImages || [])];
  
  const originalPrice = product.originalPrice || (product.discount ? product.price / (1 - product.discount / 100) : product.price);
  const isFav = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize: selectedSize || undefined
    });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-8 group">
          <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Images Section */}
          <div className="lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            {allImages.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] hide-scrollbar pb-2 md:pb-0">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-24 md:w-24 md:h-32 bg-zinc-100 dark:bg-zinc-900 border-2 transition-colors ${activeImage === img ? 'border-zinc-900 dark:border-white' : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                  >
                    <img src={img} alt={`${product.name} - Vista ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 aspect-[3/4] relative">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal absolute inset-0" />
              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                  -{product.discount}% OFF
                </div>
              )}
              {product.outOfStock && (
                <div className="absolute top-4 left-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                  Esgotado
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 flex flex-col pt-4">
            <div className="mb-2">
              <Link to={`/${product.category?.toLowerCase() || 'lancamentos'}`} className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                {product.category}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-4 mb-8">
              <div className="text-3xl md:text-4xl font-light text-zinc-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </div>
              {product.discount && (
                <div className="text-xl text-zinc-400 line-through mb-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalPrice)}
                </div>
              )}
            </div>

            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
              Em até {product.installments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / product.installments)} sem juros
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Tamanho</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 w-12 flex items-center justify-center border font-bold transition-all ${
                        selectedSize === size 
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' 
                          : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={product.outOfStock}
                className="flex-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 h-14 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-5 w-5" />
                {product.outOfStock ? 'Indisponível' : 'Adicionar à Sacola'}
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
                className={`h-14 w-14 flex items-center justify-center border transition-colors ${
                  isFav 
                    ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-500/10' 
                    : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                }`}
              >
                <Heart className={`h-6 w-6 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">Descrição do Produto</h3>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>
              </div>
            )}
            
            <ShippingCalculator product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
