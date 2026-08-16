import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { mapSupabaseProduct } from '../utils/productUtils';
import { useCart } from '../contexts/CartContext';
import { ShippingCalculator } from '../components/ShippingCalculator';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, ChevronLeft, ShoppingBag, Minus, Plus } from 'lucide-react';
import { TopBar } from '../components/TopBar';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');
  
  const { addToCart, setIsCartOpen } = useCart();
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
        if (mapped.colors && mapped.colors.length > 0) {
          setSelectedColor(mapped.colors[0]);
        }
        if (mapped.variants && mapped.variants.length > 0) {
          setSelectedColor(mapped.variants[0].color || '');
          if (mapped.variants[0].sizes && mapped.variants[0].sizes.length > 0) {
             const firstAvailable = mapped.variants[0].sizes.find(s => s.stock > 0);
             if (firstAvailable) {
               setSelectedSize(firstAvailable.name);
             } else {
               setSelectedSize(mapped.variants[0].sizes[0].name);
             }
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load product', err);
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = product ? (product.discount ? product.price * (1 - product.discount / 100) : product.price) : 0;
  const isFav = product ? isFavorite(product.id) : false;

  // Derived state for variants
  const hasVariants = !!(product?.variants && product.variants.length > 0);
  const activeVariant = hasVariants ? product.variants!.find(v => v.color === selectedColor) : null;
  const availableSizesForColor = hasVariants 
    ? (activeVariant?.sizes || [])
    : (product?.sizes?.map(s => ({ name: s, stock: 999 })) || []);
  
  const currentSizeObj = availableSizesForColor.find(s => s.name === selectedSize);
  const maxStock = currentSizeObj ? currentSizeObj.stock : (hasVariants ? 0 : 999);
  const isOutOfStock = hasVariants ? maxStock === 0 : !!product?.outOfStock;

  // Sync selected size if color changes
  useEffect(() => {
    if (activeVariant && activeVariant.sizes && activeVariant.sizes.length > 0) {
       const hasCurrentSize = activeVariant.sizes.find(s => s.name === selectedSize);
       if (!hasCurrentSize) {
         const firstAvailable = activeVariant.sizes.find(s => s.stock > 0);
         setSelectedSize(firstAvailable ? firstAvailable.name : activeVariant.sizes[0].name);
       }
    }
  }, [selectedColor, activeVariant, selectedSize]);

  // Cap quantity
  useEffect(() => {
    if (quantity > maxStock && maxStock > 0) {
      setQuantity(maxStock);
    }
  }, [maxStock, quantity]);

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

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined
    }, quantity);
    setIsCartOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-8 group">
          <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          
          {/* Images Section */}
          <div className="w-full lg:w-1/2 min-w-0 flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24">
            {allImages.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] hide-scrollbar pb-2 md:pb-0 shrink-0">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-24 md:w-24 md:h-32 bg-zinc-100 dark:bg-zinc-900 border-2 transition-colors ${activeImage === img ? 'border-zinc-900 dark:border-white' : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                  >
                    <img src={img} alt={`${product.name} - Vista ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-1" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 w-full min-w-0 bg-zinc-100 dark:bg-zinc-900 aspect-square md:aspect-[3/4] relative overflow-hidden">
              <img src={activeImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal absolute inset-0 p-2 md:p-4" />
              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                  -{product.discount}% OFF
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                  Esgotado
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 min-w-0 flex flex-col pt-4">
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
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalPrice)}
              </div>
              {product.discount && (
                <div className="text-xl text-zinc-400 line-through mb-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </div>
              )}
            </div>

            {product.installments > 0 && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                Em até {product.installments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalPrice / product.installments)} sem juros
              </div>
            )}

                        {/* Colors */}
            {((product.colors && product.colors.length > 0) || hasVariants) && (
              <div className="mb-6">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Cor</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(hasVariants ? (product.variants || []).map(v => v.color).filter(Boolean) : (product.colors || [])).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 h-12 flex items-center justify-center border font-bold transition-all ${
                        selectedColor === color 
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' 
                          : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sizes */}
            {availableSizesForColor.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Tamanho</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizesForColor.map((sizeObj) => {
                    const size = sizeObj.name;
                    const stock = sizeObj.stock;
                    const disabled = hasVariants && stock === 0;
                    return (
                    <button
                      key={size}
                      disabled={disabled}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 w-12 flex items-center justify-center border font-bold transition-all ${
                        disabled ? 'opacity-30 cursor-not-allowed bg-zinc-100 dark:bg-zinc-900' :
                        selectedSize === size 
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' 
                          : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  )})}
                </div>
              </div>
            )}


            
            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="flex gap-4">
                <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-sm h-14 bg-white dark:bg-zinc-950 px-2 w-32 justify-between">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= maxStock}
                    className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 h-14 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isOutOfStock ? 'Indisponível' : 'Adicionar à Sacola'}
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
              {hasVariants && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                  Estoque disponível: {maxStock}
                </div>
              )}
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
