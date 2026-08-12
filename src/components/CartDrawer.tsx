import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { settings } = useSettings();
  const texts = settings.siteContent.cartDrawer;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCheckout = () => {
    const phoneNumber = settings.whatsappNumber || '5511999999999';
    
    let message = texts.whatsappMessagePrefix;
    
    cartItems.forEach(item => {
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      message += `${item.quantity}x ${item.name} ${item.selectedSize ? `(Tam: ${item.selectedSize})` : ''} - ${formatCurrency(price)}\n`;
    });
    
    message += `${texts.whatsappMessageTotal} ${formatCurrency(cartTotal)}*`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Clear cart or not? Depends on preference. For now just redirect.
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-zinc-950 z-[101] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">{texts.title}</h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-zinc-100 dark:bg-zinc-900 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">{texts.emptyStateTitle}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-[200px]">{texts.emptyStateText}</p>
            <Link 
              to="/camisetas"
              onClick={onClose}
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-xs px-8 py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >{texts.startShoppingButton}</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize || ''}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight line-clamp-2">
                          {item.name} {item.selectedSize ? `(Tam: ${item.selectedSize})` : ''}
                        </h4>
                        <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-zinc-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-1">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          {formatCurrency(item.discount ? item.price * (1 - item.discount / 100) : item.price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="px-2 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 py-1 text-xs font-bold text-zinc-900 dark:text-white min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="px-2 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{texts.totalText}</span>
                <span className="text-lg font-black text-zinc-900 dark:text-white">{formatCurrency(cartTotal)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold uppercase tracking-wider text-sm py-4 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />{texts.checkoutButton}</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
