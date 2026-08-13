import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'review'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const formatCpf = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
  };

  const formatCep = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    return v;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') formattedValue = formatCpf(value);
    if (name === 'cep') formattedValue = formatCep(value);

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    // clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (formData.cpf.replace(/\D/g, '').length !== 11) errors.cpf = 'CPF inválido';
    if (formData.cep.replace(/\D/g, '').length !== 8) errors.cep = 'CEP inválido';
    if (!formData.street.trim()) errors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) errors.number = 'Número é obrigatório';
    if (!formData.neighborhood.trim()) errors.neighborhood = 'Bairro é obrigatório';
    if (!formData.city.trim()) errors.city = 'Cidade é obrigatória';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToForm = () => {
    setCheckoutStep('form');
  };

  const goToReview = async () => {
    if (validateForm()) {
      if (user) {
        await supabase.auth.updateUser({ data: { address: formData } });
      } else {
        localStorage.setItem('deliveryAddress', JSON.stringify(formData));
      }
      setCheckoutStep('review');
    }
  };

  const goBackToCart = () => {
    setCheckoutStep('cart');
  };

  const goBackToForm = () => {
    setCheckoutStep('form');
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    onClose();
  };

  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { settings } = useSettings();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      if (user && user.user_metadata?.address) {
        setFormData(user.user_metadata.address);
      } else if (!user) {
        const saved = localStorage.getItem('deliveryAddress');
        if (saved) {
          try {
            setFormData(JSON.parse(saved));
          } catch (e) {}
        }
      } else if (user && !user.user_metadata?.address && user.user_metadata?.full_name) {
        setFormData(prev => ({ ...prev, name: user.user_metadata.full_name }));
      }
    }
  }, [isOpen, user]);

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
    
    message += `\n*Dados para entrega:*\n`;
    message += `Nome: ${formData.name}\n`;
    message += `CPF: ${formData.cpf}\n`;
    message += `CEP: ${formData.cep}\n`;
    message += `Rua: ${formData.street}, ${formData.number}\n`;
    message += `Bairro: ${formData.neighborhood}\n`;
    message += `Cidade: ${formData.city}\n\n`;
    
    message += `${texts.whatsappMessageTotal} ${formatCurrency(cartTotal)}*`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    handleClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-zinc-950 z-[101] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">{texts.title}</h2>
          <button 
            onClick={handleClose}
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
              onClick={handleClose}
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-xs px-8 py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >{texts.startShoppingButton}</Link>
          </div>
        ) : checkoutStep === 'cart' ? (
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
                onClick={goToForm}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold uppercase tracking-wider text-sm py-4 transition-colors"
              >
                Continuar
              </button>
            </div>
          </>
        ) : checkoutStep === 'form' ? (
          <div className="flex-1 flex flex-col h-full">
            <div className="flex items-center gap-3 p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0">
              <button onClick={goBackToCart} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-sm">Dados de Entrega</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Nome Completo</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange} 
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.name ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">CPF</label>
                  <input 
                    type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00"
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.cpf ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">CEP</label>
                  <input 
                    type="text" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000"
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.cep ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.cep && <p className="text-red-500 text-xs mt-1">{formErrors.cep}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Rua</label>
                <input 
                  type="text" name="street" value={formData.street} onChange={handleInputChange} 
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.street ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.street && <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Número</label>
                  <input 
                    type="text" name="number" value={formData.number} onChange={handleInputChange} 
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.number ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.number && <p className="text-red-500 text-xs mt-1">{formErrors.number}</p>}
                </div>
                <div className="w-full sm:flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Bairro</label>
                  <input 
                    type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} 
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.neighborhood ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.neighborhood && <p className="text-red-500 text-xs mt-1">{formErrors.neighborhood}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Cidade - UF</label>
                <input 
                  type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ex: São Paulo - SP"
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.city ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>
            </div>
            
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0">
              <button 
                onClick={goToReview}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold uppercase tracking-wider text-sm py-4 transition-colors"
              >
                Revisar e Enviar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            <div className="flex items-center gap-3 p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0">
              <button onClick={goBackToForm} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-sm">Revisar Pedido</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                <h4 className="font-bold uppercase tracking-wider text-xs mb-3 text-zinc-500 dark:text-zinc-400">Resumo dos Itens</h4>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize || ''}`} className="flex justify-between text-sm">
                      <span className="text-zinc-900 dark:text-white">{item.quantity}x {item.name} {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-bold text-zinc-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <h4 className="font-bold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Dados de Entrega</h4>
                </div>
                <div className="space-y-1 text-sm text-zinc-900 dark:text-white">
                  <p><span className="font-medium text-zinc-500 dark:text-zinc-400">Nome:</span> {formData.name}</p>
                  <p><span className="font-medium text-zinc-500 dark:text-zinc-400">CPF:</span> {formData.cpf}</p>
                  <p><span className="font-medium text-zinc-500 dark:text-zinc-400">Endereço:</span> {formData.street}, {formData.number}</p>
                  <p><span className="font-medium text-zinc-500 dark:text-zinc-400">Bairro:</span> {formData.neighborhood}</p>
                  <p><span className="font-medium text-zinc-500 dark:text-zinc-400">Cidade:</span> {formData.city} - {formData.cep}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0">
              <button 
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold uppercase tracking-wider text-sm py-4 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {texts.checkoutButton}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
