import re

with open('src/components/admin/ContentEditor.tsx', 'r') as f:
    content = f.read()

# Add simple update helper
update_helper = """
  const updateSection = (section: keyof SiteContent, field: string, value: string) => {
    setContent({
      ...content,
      [section]: {
        ...(content[section] as any),
        [field]: value
      }
    });
  };
"""
content = content.replace("  const updateAbout", update_helper + "\n  const updateAbout")

# Build the JSX for new sections
new_sections_jsx = """
        {/* Header */}
        <SectionHeader id="header" title="Componente: Cabeçalho & Menu" />
        {expandedSection === 'header' && (
          <div className="p-6 grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold mb-2">Busca (Placeholder)</label><input type="text" value={content.header.searchPlaceholder} onChange={e => updateSection('header', 'searchPlaceholder', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Login</label><input type="text" value={content.header.loginText} onChange={e => updateSection('header', 'loginText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Sair</label><input type="text" value={content.header.logoutText} onChange={e => updateSection('header', 'logoutText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Favoritos</label><input type="text" value={content.header.favoritesText} onChange={e => updateSection('header', 'favoritesText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Modo Claro</label><input type="text" value={content.header.lightModeText} onChange={e => updateSection('header', 'lightModeText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Modo Escuro</label><input type="text" value={content.header.darkModeText} onChange={e => updateSection('header', 'darkModeText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
          </div>
        )}

        {/* Product Card */}
        <SectionHeader id="productCard" title="Componente: Cartão de Produto" />
        {expandedSection === 'productCard' && (
          <div className="p-6 grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold mb-2">Badge Esgotado</label><input type="text" value={content.productCard.outOfStockBadge} onChange={e => updateSection('productCard', 'outOfStockBadge', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Botão Comprar</label><input type="text" value={content.productCard.buyButton} onChange={e => updateSection('productCard', 'buyButton', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Botão Indisponível</label><input type="text" value={content.productCard.unavailableButton} onChange={e => updateSection('productCard', 'unavailableButton', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Prefixo Parcelas (ex: "ou")</label><input type="text" value={content.productCard.installmentPrefix} onChange={e => updateSection('productCard', 'installmentPrefix', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Sufixo Parcelas (ex: "x de")</label><input type="text" value={content.productCard.installmentSuffix} onChange={e => updateSection('productCard', 'installmentSuffix', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Texto "À Vista"</label><input type="text" value={content.productCard.cashPrefix} onChange={e => updateSection('productCard', 'cashPrefix', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
          </div>
        )}

        {/* Search Page */}
        <SectionHeader id="searchPage" title="Página: Busca" />
        {expandedSection === 'searchPage' && (
          <div className="p-6 space-y-4">
            <div><label className="block text-xs font-bold mb-2">Título</label><input type="text" value={content.searchPage.title} onChange={e => updateSection('searchPage', 'title', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Prefixo de Resultados</label><input type="text" value={content.searchPage.showingResultsFor} onChange={e => updateSection('searchPage', 'showingResultsFor', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Texto Vazio</label><input type="text" value={content.searchPage.emptyStateText} onChange={e => updateSection('searchPage', 'emptyStateText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Carregando...</label><input type="text" value={content.searchPage.searchingText} onChange={e => updateSection('searchPage', 'searchingText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Erro</label><input type="text" value={content.searchPage.errorText} onChange={e => updateSection('searchPage', 'errorText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Nenhum Resultado</label><input type="text" value={content.searchPage.noResultsText} onChange={e => updateSection('searchPage', 'noResultsText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
          </div>
        )}

        {/* Favorites Page */}
        <SectionHeader id="favoritesPage" title="Página: Favoritos" />
        {expandedSection === 'favoritesPage' && (
          <div className="p-6 space-y-4">
            <div><label className="block text-xs font-bold mb-2">Título</label><input type="text" value={content.favoritesPage.title} onChange={e => updateSection('favoritesPage', 'title', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Título Vazio</label><input type="text" value={content.favoritesPage.emptyStateTitle} onChange={e => updateSection('favoritesPage', 'emptyStateTitle', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Texto Vazio</label><input type="text" value={content.favoritesPage.emptyStateText} onChange={e => updateSection('favoritesPage', 'emptyStateText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Botão Explorar</label><input type="text" value={content.favoritesPage.exploreButton} onChange={e => updateSection('favoritesPage', 'exploreButton', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
          </div>
        )}

        {/* Cart Drawer */}
        <SectionHeader id="cartDrawer" title="Componente: Sacola" />
        {expandedSection === 'cartDrawer' && (
          <div className="p-6 space-y-4">
            <div><label className="block text-xs font-bold mb-2">Título</label><input type="text" value={content.cartDrawer.title} onChange={e => updateSection('cartDrawer', 'title', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Título Vazio</label><input type="text" value={content.cartDrawer.emptyStateTitle} onChange={e => updateSection('cartDrawer', 'emptyStateTitle', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Texto Vazio</label><input type="text" value={content.cartDrawer.emptyStateText} onChange={e => updateSection('cartDrawer', 'emptyStateText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Botão Começar</label><input type="text" value={content.cartDrawer.startShoppingButton} onChange={e => updateSection('cartDrawer', 'startShoppingButton', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Rótulo Total</label><input type="text" value={content.cartDrawer.totalText} onChange={e => updateSection('cartDrawer', 'totalText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Botão Finalizar</label><input type="text" value={content.cartDrawer.checkoutButton} onChange={e => updateSection('cartDrawer', 'checkoutButton', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Mensagem WhatsApp (Início)</label><textarea value={content.cartDrawer.whatsappMessagePrefix} onChange={e => updateSection('cartDrawer', 'whatsappMessagePrefix', e.target.value)} className="w-full border p-2 text-sm rounded-md" rows={2} /></div>
            <div><label className="block text-xs font-bold mb-2">Mensagem WhatsApp (Fim / Total)</label><input type="text" value={content.cartDrawer.whatsappMessageTotal} onChange={e => updateSection('cartDrawer', 'whatsappMessageTotal', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
          </div>
        )}

        {/* Auth Modal */}
        <SectionHeader id="authModal" title="Componente: Modal Login/Cadastro" />
        {expandedSection === 'authModal' && (
          <div className="p-6 grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold mb-2">Aba Entrar</label><input type="text" value={content.authModal.loginTab} onChange={e => updateSection('authModal', 'loginTab', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Aba Criar Conta</label><input type="text" value={content.authModal.registerTab} onChange={e => updateSection('authModal', 'registerTab', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Botão Entrar</label><input type="text" value={content.authModal.loginButton} onChange={e => updateSection('authModal', 'loginButton', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Botão Criar Conta</label><input type="text" value={content.authModal.registerButton} onChange={e => updateSection('authModal', 'registerButton', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Rótulo E-mail</label><input type="text" value={content.authModal.emailLabel} onChange={e => updateSection('authModal', 'emailLabel', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Rótulo Senha</label><input type="text" value={content.authModal.passwordLabel} onChange={e => updateSection('authModal', 'passwordLabel', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Rótulo Nome</label><input type="text" value={content.authModal.nameLabel} onChange={e => updateSection('authModal', 'nameLabel', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
            <div><label className="block text-xs font-bold mb-2">Texto Esqueceu a Senha?</label><input type="text" value={content.authModal.forgotPasswordText} onChange={e => updateSection('authModal', 'forgotPasswordText', e.target.value)} className="w-full border p-2 text-sm rounded-md" /></div>
          </div>
        )}
"""

content = content.replace("{/* Lançamentos */}", new_sections_jsx + "\n        {/* Lançamentos */}")

# Fix generic class names in the appended content to match existing design
content = content.replace('className="w-full border p-2 text-sm rounded-md"', 'className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md"')
content = content.replace('className="block text-xs font-bold mb-2"', 'className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2"')

with open('src/components/admin/ContentEditor.tsx', 'w') as f:
    f.write(content)
