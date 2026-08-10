import React from 'react';
import { useState, useEffect, FormEvent, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, Save, Store, UploadCloud, X, Settings, ShoppingBag, Lock, LogIn } from 'lucide-react';
import { Product } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../lib/supabase';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  
  const [products, setProducts] = useState<Product[]>([]);
  const { settings, updateSettings } = useSettings();
  
  // Settings form state
  useEffect(() => {
    setTopBarText(settings.topBarText);
    setHeroTitle(settings.heroTitle);
    setHeroSubtitle(settings.heroSubtitle);
    setCarouselTitle(settings.carouselTitle);
    setWhatsappNumber(settings.whatsappNumber || '5511999999999');
  }, [settings]);

  const [topBarText, setTopBarText] = useState(settings.topBarText);
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [carouselTitle, setCarouselTitle] = useState(settings.carouselTitle);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [allowInstallments, setAllowInstallments] = useState(true);
  const [maxInstallments, setMaxInstallments] = useState('10');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (err) {
      console.warn('Failed to load products from Supabase', err);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (secretKey === 'admin123') { // Simple hardcoded secret key for demonstration
      setIsAuthenticated(true);
      sessionStorage.setItem('@JapaStore:admin_auth', 'true');
    } else {
      alert('Chave de acesso incorreta!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('@JapaStore:admin_auth');
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        topBarText,
        heroTitle,
        heroSubtitle,
        carouselTitle,
        whatsappNumber,
        navLink1: settings.navLink1,
        navLink2: settings.navLink2,
        navLink3: settings.navLink3,
        navLink4: settings.navLink4,
      });
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
    
    try {
      if (editingId) {
        // Update existing in Supabase
        const { error } = await supabase
          .from('products')
          .update({
            name,
            price: priceNum,
            installments: installmentsNum,
            category,
            image_url: imageUrl,
            description
          })
          .eq('id', editingId);

        if (error) throw error;
        
      } else {
        // Create new in Supabase
        const { error } = await supabase
          .from('products')
          .insert({
            name,
            price: priceNum,
            installments: installmentsNum,
            image_url: imageUrl,
            category,
            description
          });

        if (error) throw error;
      }
      
      // Refresh products list
      await fetchProducts();
      resetForm();
    } catch (err) {
      console.warn('Error saving product:', err);
      alert('Ocorreu um erro ao salvar o produto.');
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
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await fetchProducts();
        
        if (editingId === id) {
          resetForm();
        }
        alert('Produto excluído com sucesso.');
      } catch (err: any) {
        console.warn('Error deleting product:', err);
        alert('Não foi possível excluir o produto. ' + (err.message || ''));
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setAllowInstallments(true);
    setMaxInstallments('10');
    setCategory('');
    setImageUrl('');
    setDescription('');
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
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
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
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-zinc-500">Banner Principal (Hero)</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Principal</label>
                    <input 
                      type="text" 
                      value={heroTitle}
                      onChange={e => setHeroTitle(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Subtítulo</label>
                    <textarea 
                      rows={3}
                      value={heroSubtitle}
                      onChange={e => setHeroSubtitle(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md resize-none"
                    />
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
            <section className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
              {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? 'Editar Produto' : 'Adicionar Produto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Preço (R$) *</label>
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
                    <option value="Tenis">Tênis</option>
                    <option value="Roupas">Roupas</option>
                    <option value="Acessorios">Acessórios</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={allowInstallments}
                      onChange={(e) => setAllowInstallments(e.target.checked)}
                      className="w-4 h-4 text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded focus:ring-zinc-900 dark:focus:ring-white"
                    />
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Permite parcelamento?</span>
                  </label>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${allowInstallments ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'}`}>Número Máx. de Parcelas</label>
                  <input 
                    type="number" 
                    min="1"
                    max="12"
                    disabled={!allowInstallments}
                    value={maxInstallments}
                    onChange={e => setMaxInstallments(e.target.value)}
                    className={`w-full border p-3 text-sm focus:outline-none rounded-md transition-colors ${allowInstallments ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'}`}
                    placeholder="Ex: 10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagem do Produto *</label>
                <div 
                  className={`relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    isDragging 
                      ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800' 
                      : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
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
                    <div className="relative w-full aspect-square max-h-48 flex items-center justify-center">
                      <img src={imageUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-md shadow-sm" />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <div className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-full mb-3">
                        <UploadCloud className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                        Toque ou arraste a imagem aqui
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        PNG, JPG ou WEBP (Max. 5MB)
                      </p>
                    </div>
                  )}
                </div>
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

              <div className="flex gap-3 mt-4">
                {editingId && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-xs py-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors rounded-md"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-xs py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-md flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* List Section */}
        <section className="w-full lg:w-2/3">
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
                        <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                          {formatCurrency(product.price)}
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
    </div>
  );
}
