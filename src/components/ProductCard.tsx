import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const texts = settings?.siteContent?.productCard;
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, setIsCartOpen } = useCart();
  const favorited = isFavorite(product.id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  const installmentValue = finalPrice / product.installments;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.outOfStock) {
      addToCart(product);
      setIsCartOpen(true);
    }
  };

  return (
    <div onClick={() => navigate(`/produto/${product.id}`)} className="group cursor-pointer flex flex-col h-full">
      <div className="relative bg-zinc-100 dark:bg-zinc-900 aspect-[3/4] overflow-hidden mb-4 transition-colors duration-300">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply dark:mix-blend-normal ${product.outOfStock ? 'opacity-50 grayscale' : ''}`}
        />
        
        {product.outOfStock ? (
          <div className="absolute top-3 left-3 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">{texts.outOfStockBadge}</div>
        ) : product.discount ? (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-wide">
            -{product.discount}%
          </div>
        ) : null}

        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product); }}
          className={`absolute top-3 right-3 transition-colors ${favorited ? 'text-red-500 opacity-100' : 'text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-500 opacity-0 group-hover:opacity-100'}`}
        >
          <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-1 uppercase tracking-tight transition-colors duration-300 min-h-[40px]">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-1">
          {product.discount && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 line-through transition-colors duration-300">
              {formatCurrency(product.price)}
            </span>
          )}
          <span className="text-base font-black text-zinc-900 dark:text-white transition-colors duration-300">
            {formatCurrency(finalPrice)}
          </span>
        </div>
        
        {product.installments > 1 ? (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-300 mb-4 block">
            {texts.installmentPrefix} {product.installments}{texts.installmentSuffix} {formatCurrency(installmentValue)}
          </span>
        ) : (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-300 mb-4 block h-[18px]">{texts.cashPrefix}</span>
        )}

        <div className="mt-auto pt-2">
          <button 
            disabled={product.outOfStock}
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs py-3 transition-colors ${
              product.outOfStock 
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {product.outOfStock ? texts.unavailableButton : texts.buyButton}
          </button>
        </div>
      </div>
    </div>
  );
}
