import React from 'react';
import { useState, useEffect, FormEvent, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ContentEditor } from '../components';
import { ArrowLeft, Edit, Trash2, Plus, Save, Store, UploadCloud, Upload, X, ImagePlus, Settings, ShoppingBag, Lock, LogIn, Loader2, AlertTriangle, CheckCircle2, Truck } from "lucide-react";
import { Product, ProductVariant } from '../types';
import { mapSupabaseProduct, stringifyProductDescription } from '../utils/productUtils';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../lib/supabase';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'content'>('products');
  
  const [products, setProducts] = useState<Product[]>([]);
  const { settings, updateSettings } = useSettings();
  
  // Settings form state
  useEffect(() => {
    setTopBarText(settings.topBarText);
    setHeroTitle(settings.heroTitle);
    setHeroSubtitle(settings.heroSubtitle);
    setCarouselTitle(settings.carouselTitle);
    setWhatsappNumber(settings.whatsappNumber || '5511999999999');
    setSfCep(settings.siteContent?.superfrete?.originCep || '');
    setSfToken(settings.siteContent?.superfrete?.token || '');
  }, [settings]);

  const [heroBanner1, setHeroBanner1] = useState(settings.siteContent?.heroBanners?.banner1 || '/images/japastorebanner1.jpeg');
  const [heroBanner2, setHeroBanner2] = useState(settings.siteContent?.heroBanners?.banner2 || '/images/japastorebanner2.jpeg');
  const [topBarText, setTopBarText] = useState(settings.topBarText);
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [carouselTitle, setCarouselTitle] = useState(settings.carouselTitle);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');
  const [sfCep, setSfCep] = useState(settings.siteContent?.superfrete?.originCep || '');
  const [sfToken, setSfToken] = useState(settings.siteContent?.superfrete?.token || '');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('');
  const [allowInstallments, setAllowInstallments] = useState(true);
  const [maxInstallments, setMaxInstallments] = useState('10');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<string>('');
  const [colors, setColors] = useState<string>('');
  const [useAdvancedInventory, setUseAdvancedInventory] = useState(false);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newColorInput, setNewColorInput] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFilesInputRef = useRef<HTMLInputElement>(null);

  const handleExtraFilesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => handleExtraFileSelect(file));
    }
  };

  const handleExtraFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione arquivos de imagem válidos.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setExtraImages(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const removeExtraImage = (index: number) => {
    setExtraImages(prev => prev.filter((_, i) => i !== index));
  };


  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Load auth state
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('@JapaStore:admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load products from Supabase on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching products:', error);
        return;
      }

      if (data) {
        const mappedProducts: Product[] = data.map(mapSupabaseProduct);
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.warn('Failed to load products from Supabase', err);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (secretKey) {
      setIsAuthenticated(true);
      sessionStorage.setItem('@JapaStore:admin_auth', 'true');
      sessionStorage.setItem('@JapaStore:admin_secret', secretKey);
    } else {
      alert('Chave de acesso incorreta!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('@JapaStore:admin_auth');
    sessionStorage.removeItem('@JapaStore:admin_secret');
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newSettings = {
        topBarText,
        heroTitle,
        heroSubtitle,
        carouselTitle,
        whatsappNumber,
        navLink1: settings.navLink1,
        navLink2: settings.navLink2,
        navLink3: settings.navLink3,
        navLink4: settings.navLink4,
        siteContent: {
          ...settings.siteContent,
          heroBanners: {
            banner1: heroBanner1,
            banner2: heroBanner2
          },
          superfrete: {
            originCep: sfCep,
            token: sfToken
          }
        },
      };
      await updateSettings(newSettings);
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      alert('Erro ao salvar as configurações. Verifique o banco de dados.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !category || !imageUrl) {
      alert('Por favor, preencha todos os campos obrigatórios e adicione uma imagem.');
      return;
    }

    const priceNum = parseFloat(price.replace(',', '.'));
    const installmentsNum = allowInstallments ? parseInt(maxInstallments) : 1;
    
    const parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    const parsedColors = colors.split(',').map(c => c.trim()).filter(c => c !== '');
    const finalVariants = useAdvancedInventory ? variants : [];
    
    // Auto-generate colors/sizes from variants for backward compatibility
    const fallbackSizes = useAdvancedInventory 
      ? Array.from(new Set(variants.flatMap(v => v.sizes.map(s => s.name))))
      : parsedSizes;
    const fallbackColors = useAdvancedInventory 
      ? variants.map(v => v.color).filter(c => c !== '')
      : parsedColors;
    const parsedExtraImages = extraImages;
    const discountValue = hasDiscount && discountPercent ? parseInt(discountPercent) : undefined;

    const finalDescription = stringifyProductDescription(
      description, fallbackSizes, fallbackColors, parsedExtraImages, 
      weight ? parseFloat(weight.replace(',', '.')) : undefined,
      height ? parseFloat(height.replace(',', '.')) : undefined,
      width ? parseFloat(width.replace(',', '.')) : undefined,
      length ? parseFloat(length.replace(',', '.')) : undefined,
      finalVariants,
      discountValue
    );
    
    try {
      const adminSecret = sessionStorage.getItem('@JapaStore:admin_secret') || secretKey || '';
      
      if (editingId) {
        // Update existing via admin API endpoint
        const response = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Secret': adminSecret
          },
          body: JSON.stringify({
            id: editingId,
            name,
            price: priceNum,
            installments: installmentsNum,
            category,
            image_url: imageUrl,
            description: finalDescription
          })
        });

        const resData = await response.json();
        if (!response.ok) throw new Error(resData.error || 'Erro ao atualizar produto.');
        
      } else {
        // Create new via admin API endpoint
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Secret': adminSecret
          },
          body: JSON.stringify({
            name,
            price: priceNum,
            installments: installmentsNum,
            image_url: imageUrl,
            category,
            description: finalDescription
          })
        });

        const resData = await response.json();
        if (!response.ok) throw new Error(resData.error || 'Erro ao cadastrar produto.');
      }
      
      // Refresh products list
      await fetchProducts();
      resetForm();
    } catch (err: any) {
      console.warn('Error saving product:', err);
      alert('Ocorreu um erro ao salvar o produto: ' + (err.message || ''));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setAllowInstallments(product.installments > 1);
    setMaxInstallments(product.installments > 1 ? product.installments.toString() : '10');
    setCategory(product.category || '');
    setImageUrl(product.imageUrl);
    setDescription(product.description || '');
    setSizes((product.sizes || []).join(', '));
    setColors((product.colors || []).join(', '));
    setHasDiscount(!!product.discount && product.discount > 0);
    setDiscountPercent(product.discount ? product.discount.toString() : '');
    setUseAdvancedInventory(!!product.variants && product.variants.length > 0);
    setVariants(product.variants || []);
    setExtraImages(product.extraImages || []);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteFeedback(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    setDeleteFeedback(null);
    
    try {
      const adminSecret = sessionStorage.getItem('@JapaStore:admin_secret') || secretKey || '';
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': adminSecret
        },
        body: JSON.stringify({
          id: productToDelete
        })
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Erro ao excluir produto.');
      
      await fetchProducts();
      
      if (editingId === productToDelete) {
        resetForm();
      }
      
      setProductToDelete(null);
      setDeleteFeedback({ type: 'success', message: 'Produto excluído com sucesso.' });
      
      setTimeout(() => setDeleteFeedback(null), 3000);
    } catch (err: any) {
      console.warn('Error deleting product:', err);
      setDeleteFeedback({ type: 'error', message: 'Não foi possível excluir o produto. ' + (err.message || '') });
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setHasDiscount(false);
    setDiscountPercent('');
    setAllowInstallments(true);
    setMaxInstallments('10');
    setCategory('');
    setImageUrl('');
    setDescription('');
      setSizes('');
      setColors('');
      setUseAdvancedInventory(false);
      setVariants([]);
      setExtraImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-3 rounded-xl mb-4">
               <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white">Acesso Restrito</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center">
              Insira sua chave de administrador para acessar o painel de controle.
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Chave Secreta</label>
              <input 
                type="password" 
                required
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-lg text-center font-mono text-lg tracking-widest"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              className="mt-2 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-lg flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Acessar Painel
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline underline-offset-4 transition-colors">Voltar para a loja</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col">
      {/* Admin Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-2 rounded-lg">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">JapaStore <span className="text-zinc-400 font-medium tracking-normal capitalize ml-1">- Painel Admin</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLogout}
              className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Sair
            </button>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
              Ver Loja
            </Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 mt-4">
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'products' ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            <ShoppingBag className="h-4 w-4" />
            Produtos
          </button>
                      <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-3 font-bold uppercase tracking-wider text-xs transition-colors ${
                activeTab === 'settings' 
                  ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {activeTab === 'settings' ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Personalização do Site
            </h2>
            <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Mensagem da Barra de Topo</label>
                <input 
                  type="text" 
                  value={topBarText}
                  onChange={e => setTopBarText(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                />
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-zinc-500">Imagens do Carrossel (Hero)</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagem 1 (URL ou Base64)</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setHeroBanner1(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md mb-2"
                    />
                    <input 
                      type="text" 
                      value={heroBanner1}
                      onChange={e => setHeroBanner1(e.target.value)}
                      placeholder="/images/japastorebanner1.jpeg"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    />
                    {heroBanner1 && <img src={heroBanner1} alt="Banner 1" className="mt-2 h-20 w-auto rounded-md object-cover" />}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagem 2 (URL ou Base64)</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setHeroBanner2(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md mb-2"
                    />
                    <input 
                      type="text" 
                      value={heroBanner2}
                      onChange={e => setHeroBanner2(e.target.value)}
                      placeholder="/images/japastorebanner2.jpeg"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    />
                    {heroBanner2 && <img src={heroBanner2} alt="Banner 2" className="mt-2 h-20 w-auto rounded-md object-cover" />}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-zinc-500">Vitrine de Produtos</h3>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título do Carrossel Inicial</label>
                  <input 
                    type="text" 
                    value={carouselTitle}
                    onChange={e => setCarouselTitle(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-zinc-500">Contato</h3>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Número do WhatsApp (Contato)</label>
                  <input 
                    type="text" 
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    placeholder="Ex: 5511999999999"
                  />
                  <p className="text-xs text-zinc-500 mt-2">Usado nos botões de compra. Formato: 55 + DDD + Número. Apenas números.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-zinc-500 flex items-center gap-2"><Truck className="w-4 h-4" /> Integração SuperFrete</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">CEP de Origem (Remetente)</label>
                    <input 
                      type="text" 
                      value={sfCep} 
                      onChange={(e) => setSfCep(e.target.value)} 
                      placeholder="00000-000" 
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Token (API Key)</label>
                    <input 
                      type="password" 
                      value={sfToken} 
                      onChange={(e) => setSfToken(e.target.value)} 
                      placeholder="Deixe em branco para usar a env" 
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md" 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="mt-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-xs py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-md flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Configurações
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <section className="w-full lg:w-[45%]">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
              {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? 'Editar Produto' : 'Adicionar Produto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Informações Principais */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Informações Principais
                </h3>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Nome do Produto *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    placeholder="Ex: Tênis Nike Air Max"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Preço Original (R$) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      required
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                      placeholder="Ex: 299.99"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Categoria *</label>
                    <select 
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md appearance-none"
                    >
                      <option value="" disabled>Selecione</option>
                      <option value="Camiseta">Camisetas</option>
                      <option value="Bermuda">Bermudas</option>
                      <option value="Moletom">Moletons</option>
                      <option value="Acessorios">Acessórios</option>
                      {category && !['Camiseta', 'Bermuda', 'Moletom', 'Acessorios'].includes(category) && (
                        <option value={category}>{category} (Antigo)</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* DESCONTO */}
                <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950/50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Produto em promoção</span>
                  </label>
                  
                  {hasDiscount && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Porcentagem de desconto (%) *</label>
                      <input 
                        type="number" 
                        min="1"
                        max="99"
                        required={hasDiscount}
                        value={discountPercent}
                        onChange={e => setDiscountPercent(e.target.value)}
                        className="w-full sm:w-1/3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                        placeholder="Ex: 10"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Descrição Curta</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md resize-none"
                    placeholder="Breve descrição do produto..."
                  />
                </div>
              </div>

              {/* Imagens */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Imagens do Produto
                </h3>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagem Principal *</label>
                  <div 
                    className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                      isDragging 
                        ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800' 
                        : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                    style={{ minHeight: '240px' }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileInput}
                    />
                    
                    {imageUrl ? (
                      <div className="relative w-full aspect-square max-h-56 flex items-center justify-center group">
                        <img src={imageUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-md shadow-sm" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageUrl('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition-colors shadow-md"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
                          <Upload className="w-6 h-6 text-zinc-400" />
                        </div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                          Arraste ou clique para enviar
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          PNG, JPG, WEBP (Max. 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Imagens Adicionais</label>
                  </div>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    ref={extraFilesInputRef}
                    onChange={handleExtraFilesInput}
                  />
                  
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {extraImages.map((img, index) => (
                      <div key={index} className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden group shadow-sm border border-zinc-200 dark:border-zinc-700">
                        <img src={img} alt={`Extra ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeExtraImage(index)}
                            className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => extraFilesInputRef.current?.click()}
                      className="aspect-square rounded-md border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Adicionar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Variações */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 gap-4 sm:gap-0">
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                    Variações do Produto
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 cursor-pointer bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
                    <input 
                      type="checkbox" 
                      checked={useAdvancedInventory}
                      onChange={(e) => setUseAdvancedInventory(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    Estoque Avançado
                  </label>
                </div>

                {useAdvancedInventory ? (
                  <div className="space-y-6">
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-4">
                        Gerencie o estoque para cada combinação de cor e tamanho.
                      </p>
                      
                      <div className="space-y-4">
                        {variants.map((variant, vIndex) => (
                          <div key={vIndex} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                              <div className="flex items-center gap-3 w-full max-w-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Cor:</span>
                                <input 
                                  type="text" 
                                  placeholder="Ex: Branco, Preto..."
                                  value={variant.color}
                                  onChange={e => {
                                    const newVariants = [...variants];
                                    newVariants[vIndex].color = e.target.value;
                                    setVariants(newVariants);
                                  }}
                                  className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-sm font-bold text-zinc-900 dark:text-white rounded-md focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                                />
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newVariants = [...variants];
                                  newVariants.splice(vIndex, 1);
                                  setVariants(newVariants);
                                }}
                                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                title="Remover Cor"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid grid-cols-12 gap-4 mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <div className="col-span-5">Tamanho</div>
                                <div className="col-span-5">Estoque</div>
                                <div className="col-span-2"></div>
                              </div>
                              
                              <div className="space-y-2">
                                {variant.sizes.map((size, sIndex) => (
                                  <div key={sIndex} className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-5">
                                      <input 
                                        type="text" 
                                        placeholder="Ex: M, 40"
                                        value={size.name}
                                        onChange={e => {
                                          const newVariants = [...variants];
                                          newVariants[vIndex].sizes[sIndex].name = e.target.value.toUpperCase();
                                          setVariants(newVariants);
                                        }}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm font-bold focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                                      />
                                    </div>
                                    <div className="col-span-5 relative">
                                      <input 
                                        type="number" 
                                        min="0"
                                        placeholder="0"
                                        value={size.stock}
                                        onChange={e => {
                                          const newVariants = [...variants];
                                          newVariants[vIndex].sizes[sIndex].stock = parseInt(e.target.value) || 0;
                                          setVariants(newVariants);
                                        }}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                                      />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const newVariants = [...variants];
                                          newVariants[vIndex].sizes.splice(sIndex, 1);
                                          setVariants(newVariants);
                                        }}
                                        className="text-zinc-400 hover:text-red-500 transition-colors p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md border border-zinc-200 dark:border-zinc-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <button 
                                type="button"
                                onClick={() => {
                                  const newVariants = [...variants];
                                  newVariants[vIndex].sizes.push({ name: '', stock: 0 });
                                  setVariants(newVariants);
                                }}
                                className="mt-4 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 transition-colors border border-dashed border-zinc-300 dark:border-zinc-700 py-2 w-full rounded-md"
                              >
                                <Plus className="h-4 w-4" />
                                Adicionar Tamanho
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => setVariants([...variants, { color: '', sizes: [{ name: '', stock: 0 }] }])}
                        className="mt-4 w-full py-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-white dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900 transition-colors rounded-lg text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Adicionar Nova Cor
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Cores Básicas */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">Cores (Opcional)</label>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {colors.split(',').map(c => c.trim()).filter(Boolean).map((color, index) => (
                          <div key={index} className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-md text-sm font-bold shadow-sm border border-zinc-200 dark:border-zinc-700">
                            <span>{color}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                const newColors = colors.split(',').map(c => c.trim()).filter(Boolean);
                                newColors.splice(index, 1);
                                setColors(newColors.join(', '));
                              }}
                              className="ml-1 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 max-w-sm">
                        <input 
                          type="text" 
                          value={newColorInput}
                          onChange={e => setNewColorInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = newColorInput.trim();
                              if (val) {
                                const currentColors = colors.split(',').map(c => c.trim()).filter(Boolean);
                                if (!currentColors.includes(val)) {
                                  setColors([...currentColors, val].join(', '));
                                }
                                setNewColorInput('');
                              }
                            }
                          }}
                          className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                          placeholder="Ex: Branco, Preto..."
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const val = newColorInput.trim();
                            if (val) {
                              const currentColors = colors.split(',').map(c => c.trim()).filter(Boolean);
                              if (!currentColors.includes(val)) {
                                setColors([...currentColors, val].join(', '));
                              }
                              setNewColorInput('');
                            }
                          }}
                          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider px-4 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center text-xs shadow-sm"
                        >
                          Adicionar Cor
                        </button>
                      </div>
                    </div>
                    
                    {/* Tamanhos Básicos */}
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">Tamanhos Disponíveis</label>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {sizes.split(',').map(s => s.trim()).filter(Boolean).map((size, index) => (
                          <div key={index} className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-md text-sm font-bold shadow-sm border border-zinc-200 dark:border-zinc-700">
                            <span>{size}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                const newSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                                newSizes.splice(index, 1);
                                setSizes(newSizes.join(', '));
                              }}
                              className="ml-1 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 max-w-sm">
                        <input 
                          type="text" 
                          value={newSizeInput}
                          onChange={e => setNewSizeInput(e.target.value.toUpperCase())}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = newSizeInput.trim();
                              if (val) {
                                const currentSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                                if (!currentSizes.includes(val)) {
                                  setSizes([...currentSizes, val].join(', '));
                                }
                                setNewSizeInput('');
                              }
                            }
                          }}
                          className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                          placeholder="Ex: P, 40, Único"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const val = newSizeInput.trim();
                            if (val) {
                              const currentSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                              if (!currentSizes.includes(val)) {
                                setSizes([...currentSizes, val].join(', '));
                              }
                              setNewSizeInput('');
                            }
                          }}
                          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider px-4 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center text-xs shadow-sm"
                        >
                          Adicionar Tamanho
                        </button>
                      </div>
                      
                      <div className="mt-4 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 max-w-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Adicionar Rápido:</p>
                        <div className="flex flex-wrap gap-2">
                          {['P', 'M', 'G', 'GG', 'XG', '38', '39', '40', '41', '42'].map(preset => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                const currentSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                                if (!currentSizes.includes(preset)) {
                                  setSizes([...currentSizes, preset].join(', '));
                                }
                              }}
                              className="text-xs font-bold bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-md transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Configurações */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Configurações
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md">
                      <input 
                        type="checkbox"
                        checked={allowInstallments}
                        onChange={(e) => setAllowInstallments(e.target.checked)}
                        className="w-5 h-5 text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded focus:ring-zinc-900 dark:focus:ring-white"
                      />
                      <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Permitir parcelamento</span>
                    </label>
                  </div>
                  <div className={`flex flex-col gap-2 transition-opacity duration-200 ${allowInstallments ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Número Máximo de Parcelas</label>
                    <input 
                      type="number" 
                      min="1"
                      max="12"
                      disabled={!allowInstallments}
                      value={maxInstallments}
                      onChange={e => setMaxInstallments(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm font-bold focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                      placeholder="Ex: 10"
                    />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-2">
                {editingId && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-sm py-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-xl flex items-center justify-center gap-2 shadow-md border border-transparent"
                >
                  <Save className="h-5 w-5" />
                  {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* List Section */}
        <section className="w-full lg:w-[55%]">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-lg font-black uppercase tracking-tight">Produtos Cadastrados</h2>
              <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold px-3 py-1 rounded-full">
                {products.length} {products.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Produto</th>
                    <th className="px-6 py-4 font-bold">Categoria</th>
                    <th className="px-6 py-4 font-bold">Preço</th>
                    <th className="px-6 py-4 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                        Nenhum produto cadastrado. Adicione seu primeiro produto!
                      </td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-zinc-400"><Store className="h-5 w-5"/></div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-zinc-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">{product.name}</div>
                              {product.description && (
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[150px] sm:max-w-xs">{product.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                            {product.category || 'Sem categoria'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {formatCurrency(product.discount ? product.price * (1 - product.discount / 100) : product.price)}
                            </span>
                            {product.discount && (
                              <span className="text-xs text-zinc-500 line-through">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold">Excluir Produto</h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </p>
            
            {deleteFeedback && deleteFeedback.type === 'error' && (
              <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {deleteFeedback.message}
              </div>
            )}
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteFeedback(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center gap-2 transition-colors"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Toast */}
      {deleteFeedback && deleteFeedback.type === 'success' && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-md shadow-lg animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">{deleteFeedback.message}</span>
        </div>
      )}
    </div>
  );
}
