import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Save, Loader2, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { SiteContent } from '../../types';

export function ContentEditor() {
  const { settings, updateSettings } = useSettings();
  const [content, setContent] = useState<SiteContent>(settings.siteContent);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('lancamentos');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({ ...settings, siteContent: content });
      alert('Conteúdo salvo com sucesso!');
    } catch (err) {
      alert('Erro ao salvar conteúdo.');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePage = (page: keyof SiteContent['pages'], field: string, value: string) => {
    setContent({
      ...content,
      pages: {
        ...content.pages,
        [page]: { ...content.pages[page], [field]: value }
      }
    });
  };


  const updateSection = (section: keyof SiteContent, field: string, value: string) => {
    setContent({
      ...content,
      [section]: {
        ...(content[section] as any),
        [field]: value
      }
    });
  };

  const updateAbout = (field: string, value: any) => {
    setContent({ ...content, about: { ...content.about, [field]: value } });
  };

  const updateFaq = (field: string, value: any) => {
    setContent({ ...content, faq: { ...content.faq, [field]: value } });
  };

  const updateContact = (field: string, value: string) => {
    setContent({ ...content, contact: { ...content.contact, [field]: value } });
  };

  const updateFooter = (field: string, value: string) => {
    setContent({ ...content, footer: { ...content.footer, [field]: value } });
  };

  const SectionHeader = ({ id, title }: { id: string, title: string }) => (
    <div 
      className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer border-b border-zinc-200 dark:border-zinc-800"
      onClick={() => setExpandedSection(expandedSection === id ? null : id)}
    >
      <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-sm">{title}</h3>
      {expandedSection === id ? <ChevronDown className="h-5 w-5 text-zinc-500" /> : <ChevronRight className="h-5 w-5 text-zinc-500" />}
    </div>
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <h2 className="text-lg font-black uppercase tracking-tight">Conteúdo das Páginas</h2>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-xs px-6 py-3 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-md flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Conteúdo
        </button>
      </div>
      
      <div className="overflow-y-auto max-h-[70vh]">
        
        {/* Header */}
        <SectionHeader id="header" title="Componente: Cabeçalho & Menu" />
        {expandedSection === 'header' && (
          <div className="p-6 grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Busca (Placeholder)</label><input type="text" value={content.header.searchPlaceholder} onChange={e => updateSection('header', 'searchPlaceholder', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Login</label><input type="text" value={content.header.loginText} onChange={e => updateSection('header', 'loginText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Sair</label><input type="text" value={content.header.logoutText} onChange={e => updateSection('header', 'logoutText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Favoritos</label><input type="text" value={content.header.favoritesText} onChange={e => updateSection('header', 'favoritesText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Modo Claro</label><input type="text" value={content.header.lightModeText} onChange={e => updateSection('header', 'lightModeText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Modo Escuro</label><input type="text" value={content.header.darkModeText} onChange={e => updateSection('header', 'darkModeText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
          </div>
        )}

        {/* Product Card */}
        <SectionHeader id="productCard" title="Componente: Cartão de Produto" />
        {expandedSection === 'productCard' && (
          <div className="p-6 grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Badge Esgotado</label><input type="text" value={content.productCard.outOfStockBadge} onChange={e => updateSection('productCard', 'outOfStockBadge', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Botão Comprar</label><input type="text" value={content.productCard.buyButton} onChange={e => updateSection('productCard', 'buyButton', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Botão Indisponível</label><input type="text" value={content.productCard.unavailableButton} onChange={e => updateSection('productCard', 'unavailableButton', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Prefixo Parcelas (ex: "ou")</label><input type="text" value={content.productCard.installmentPrefix} onChange={e => updateSection('productCard', 'installmentPrefix', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Sufixo Parcelas (ex: "x de")</label><input type="text" value={content.productCard.installmentSuffix} onChange={e => updateSection('productCard', 'installmentSuffix', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto "À Vista"</label><input type="text" value={content.productCard.cashPrefix} onChange={e => updateSection('productCard', 'cashPrefix', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
          </div>
        )}

        {/* Search Page */}
        <SectionHeader id="searchPage" title="Página: Busca" />
        {expandedSection === 'searchPage' && (
          <div className="p-6 space-y-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título</label><input type="text" value={content.searchPage.title} onChange={e => updateSection('searchPage', 'title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Prefixo de Resultados</label><input type="text" value={content.searchPage.showingResultsFor} onChange={e => updateSection('searchPage', 'showingResultsFor', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto Vazio</label><input type="text" value={content.searchPage.emptyStateText} onChange={e => updateSection('searchPage', 'emptyStateText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Carregando...</label><input type="text" value={content.searchPage.searchingText} onChange={e => updateSection('searchPage', 'searchingText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Erro</label><input type="text" value={content.searchPage.errorText} onChange={e => updateSection('searchPage', 'errorText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Nenhum Resultado</label><input type="text" value={content.searchPage.noResultsText} onChange={e => updateSection('searchPage', 'noResultsText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
          </div>
        )}

        {/* Favorites Page */}
        <SectionHeader id="favoritesPage" title="Página: Favoritos" />
        {expandedSection === 'favoritesPage' && (
          <div className="p-6 space-y-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título</label><input type="text" value={content.favoritesPage.title} onChange={e => updateSection('favoritesPage', 'title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Vazio</label><input type="text" value={content.favoritesPage.emptyStateTitle} onChange={e => updateSection('favoritesPage', 'emptyStateTitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto Vazio</label><input type="text" value={content.favoritesPage.emptyStateText} onChange={e => updateSection('favoritesPage', 'emptyStateText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Botão Explorar</label><input type="text" value={content.favoritesPage.exploreButton} onChange={e => updateSection('favoritesPage', 'exploreButton', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
          </div>
        )}

        {/* Cart Drawer */}
        <SectionHeader id="cartDrawer" title="Componente: Sacola" />
        {expandedSection === 'cartDrawer' && (
          <div className="p-6 space-y-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título</label><input type="text" value={content.cartDrawer.title} onChange={e => updateSection('cartDrawer', 'title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Vazio</label><input type="text" value={content.cartDrawer.emptyStateTitle} onChange={e => updateSection('cartDrawer', 'emptyStateTitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto Vazio</label><input type="text" value={content.cartDrawer.emptyStateText} onChange={e => updateSection('cartDrawer', 'emptyStateText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Botão Começar</label><input type="text" value={content.cartDrawer.startShoppingButton} onChange={e => updateSection('cartDrawer', 'startShoppingButton', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Rótulo Total</label><input type="text" value={content.cartDrawer.totalText} onChange={e => updateSection('cartDrawer', 'totalText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Botão Finalizar</label><input type="text" value={content.cartDrawer.checkoutButton} onChange={e => updateSection('cartDrawer', 'checkoutButton', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Mensagem WhatsApp (Início)</label><textarea value={content.cartDrawer.whatsappMessagePrefix} onChange={e => updateSection('cartDrawer', 'whatsappMessagePrefix', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Mensagem WhatsApp (Fim / Total)</label><input type="text" value={content.cartDrawer.whatsappMessageTotal} onChange={e => updateSection('cartDrawer', 'whatsappMessageTotal', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
          </div>
        )}

        {/* Auth Modal */}
        <SectionHeader id="authModal" title="Componente: Modal Login/Cadastro" />
        {expandedSection === 'authModal' && (
          <div className="p-6 grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Aba Entrar</label><input type="text" value={content.authModal.loginTab} onChange={e => updateSection('authModal', 'loginTab', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Aba Criar Conta</label><input type="text" value={content.authModal.registerTab} onChange={e => updateSection('authModal', 'registerTab', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Botão Entrar</label><input type="text" value={content.authModal.loginButton} onChange={e => updateSection('authModal', 'loginButton', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Botão Criar Conta</label><input type="text" value={content.authModal.registerButton} onChange={e => updateSection('authModal', 'registerButton', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Rótulo E-mail</label><input type="text" value={content.authModal.emailLabel} onChange={e => updateSection('authModal', 'emailLabel', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Rótulo Senha</label><input type="text" value={content.authModal.passwordLabel} onChange={e => updateSection('authModal', 'passwordLabel', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Rótulo Nome</label><input type="text" value={content.authModal.nameLabel} onChange={e => updateSection('authModal', 'nameLabel', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto Esqueceu a Senha?</label><input type="text" value={content.authModal.forgotPasswordText} onChange={e => updateSection('authModal', 'forgotPasswordText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" /></div>
          </div>
        )}

        {/* Lançamentos */}
        <SectionHeader id="lancamentos" title="Página: Lançamentos" />
        {expandedSection === 'lancamentos' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Principal</label>
              <input type="text" value={content.pages.lancamentos.title} onChange={e => updatePage('lancamentos', 'title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Subtítulo</label>
              <textarea value={content.pages.lancamentos.subtitle} onChange={e => updatePage('lancamentos', 'subtitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título do Grid</label>
                <input type="text" value={content.pages.lancamentos.gridTitle} onChange={e => updatePage('lancamentos', 'gridTitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto do Botão (CTA)</label>
                <input type="text" value={content.pages.lancamentos.ctaText} onChange={e => updatePage('lancamentos', 'ctaText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
            </div>
          </div>
        )}

        {/* Roupas */}
        <SectionHeader id="roupas" title="Página: Roupas" />
        {expandedSection === 'roupas' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Principal</label>
              <input type="text" value={content.pages.roupas.title} onChange={e => updatePage('roupas', 'title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Subtítulo</label>
              <textarea value={content.pages.roupas.subtitle} onChange={e => updatePage('roupas', 'subtitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título do Grid</label>
                <input type="text" value={content.pages.roupas.gridTitle} onChange={e => updatePage('roupas', 'gridTitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto do Botão (CTA)</label>
                <input type="text" value={content.pages.roupas.ctaText} onChange={e => updatePage('roupas', 'ctaText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
            </div>
          </div>
        )}

        {/* Tênis */}
        <SectionHeader id="tenis" title="Página: Tênis" />
        {expandedSection === 'tenis' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Principal</label>
              <input type="text" value={content.pages.tenis.title} onChange={e => updatePage('tenis', 'title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Subtítulo</label>
              <textarea value={content.pages.tenis.subtitle} onChange={e => updatePage('tenis', 'subtitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título do Grid</label>
                <input type="text" value={content.pages.tenis.gridTitle} onChange={e => updatePage('tenis', 'gridTitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto do Botão (CTA)</label>
                <input type="text" value={content.pages.tenis.ctaText} onChange={e => updatePage('tenis', 'ctaText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
            </div>
          </div>
        )}

        {/* Acessórios */}
        <SectionHeader id="acessorios" title="Página: Acessórios" />
        {expandedSection === 'acessorios' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Principal</label>
              <input type="text" value={content.pages.acessorios.title} onChange={e => updatePage('acessorios', 'title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Subtítulo</label>
              <textarea value={content.pages.acessorios.subtitle} onChange={e => updatePage('acessorios', 'subtitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título do Grid</label>
                <input type="text" value={content.pages.acessorios.gridTitle} onChange={e => updatePage('acessorios', 'gridTitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto do Botão (CTA)</label>
                <input type="text" value={content.pages.acessorios.ctaText} onChange={e => updatePage('acessorios', 'ctaText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
            </div>
          </div>
        )}

        {/* Sobre */}
        <SectionHeader id="sobre" title="Página: Sobre a JapaStore" />
        {expandedSection === 'sobre' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Principal</label>
              <input type="text" value={content.about.title} onChange={e => updateAbout('title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Slogan Final</label>
              <input type="text" value={content.about.slogan} onChange={e => updateAbout('slogan', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagem de Fundo (URL)</label>
              <input type="text" value={content.about.imageUrl} onChange={e => updateAbout('imageUrl', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2 flex justify-between">
                <span>Parágrafos</span>
                <button onClick={() => updateAbout('paragraphs', [...content.about.paragraphs, ''])} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Adicionar</button>
              </label>
              {content.about.paragraphs.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <textarea value={p} onChange={e => {
                    const newP = [...content.about.paragraphs];
                    newP[i] = e.target.value;
                    updateAbout('paragraphs', newP);
                  }} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
                  <button onClick={() => {
                    const newP = content.about.paragraphs.filter((_, idx) => idx !== i);
                    updateAbout('paragraphs', newP);
                  }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <SectionHeader id="faq" title="Página: FAQ" />
        {expandedSection === 'faq' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Principal</label>
              <input type="text" value={content.faq.title} onChange={e => updateFaq('title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Subtítulo</label>
              <textarea value={content.faq.subtitle} onChange={e => updateFaq('subtitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2 flex justify-between">
                <span>Perguntas e Respostas</span>
                <button onClick={() => updateFaq('items', [...content.faq.items, { question: '', answer: '' }])} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Adicionar</button>
              </label>
              {content.faq.items.map((item, i) => (
                <div key={i} className="flex gap-2 mb-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="Pergunta" value={item.question} onChange={e => {
                      const newItems = [...content.faq.items];
                      newItems[i].question = e.target.value;
                      updateFaq('items', newItems);
                    }} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-sm focus:outline-none transition-colors dark:text-white rounded-md font-bold" />
                    <textarea placeholder="Resposta" value={item.answer} onChange={e => {
                      const newItems = [...content.faq.items];
                      newItems[i].answer = e.target.value;
                      updateFaq('items', newItems);
                    }} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
                  </div>
                  <button onClick={() => {
                    const newItems = content.faq.items.filter((_, idx) => idx !== i);
                    updateFaq('items', newItems);
                  }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md self-start">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contato */}
        <SectionHeader id="contato" title="Página: Contato" />
        {expandedSection === 'contato' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título Principal</label>
                <input type="text" value={content.contact.title} onChange={e => updateContact('title', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Subtítulo</label>
                <input type="text" value={content.contact.subtitle} onChange={e => updateContact('subtitle', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">E-mail</label>
                <input type="email" value={content.contact.email} onChange={e => updateContact('email', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Telefone Visível</label>
                <input type="text" value={content.contact.phone} onChange={e => updateContact('phone', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Endereço Linha 1</label>
                <input type="text" value={content.contact.addressLine1} onChange={e => updateContact('addressLine1', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Endereço Linha 2</label>
                <input type="text" value={content.contact.addressLine2} onChange={e => updateContact('addressLine2', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Horário de Atendimento</label>
                <input type="text" value={content.contact.businessHours} onChange={e => updateContact('businessHours', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
              </div>
            </div>
          </div>
        )}

                {/* Benefits */}
        <SectionHeader id="benefits" title="Componente: Benefícios (Home)" />
        {expandedSection === 'benefits' && (
          <div className="p-6 space-y-4">
            {content.benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4 mb-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título do Benefício {i + 1}</label>
                    <input type="text" value={benefit.title} onChange={e => {
                      const newBenefits = [...content.benefits];
                      newBenefits[i].title = e.target.value;
                      setContent({ ...content, benefits: newBenefits });
                    }} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Descrição</label>
                    <textarea value={benefit.desc} onChange={e => {
                      const newBenefits = [...content.benefits];
                      newBenefits[i].desc = e.target.value;
                      setContent({ ...content, benefits: newBenefits });
                    }} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <SectionHeader id="footer" title="Componente: Footer" />
        {expandedSection === 'footer' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Texto Institucional</label>
              <textarea value={content.footer.aboutText} onChange={e => updateFooter('aboutText', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={3} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
