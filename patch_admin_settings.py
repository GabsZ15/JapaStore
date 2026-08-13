import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    content = f.read()

target_state = """  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');"""
replacement_state = """  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');
  const [sfCep, setSfCep] = useState(settings.siteContent?.superfrete?.originCep || '');
  const [sfToken, setSfToken] = useState(settings.siteContent?.superfrete?.token || '');"""
content = content.replace(target_state, replacement_state)

target_effect = """    setWhatsappNumber(settings.whatsappNumber || '5511999999999');
  }, [settings]);"""
replacement_effect = """    setWhatsappNumber(settings.whatsappNumber || '5511999999999');
    setSfCep(settings.siteContent?.superfrete?.originCep || '');
    setSfToken(settings.siteContent?.superfrete?.token || '');
  }, [settings]);"""
content = content.replace(target_effect, replacement_effect)

target_save = """    try {
      await updateSettings({
        ...settings,
        topBarText,
        heroTitle,
        heroSubtitle,
        carouselTitle,
        whatsappNumber,
      });"""
replacement_save = """    try {
      const newSettings = {
        ...settings,
        topBarText,
        heroTitle,
        heroSubtitle,
        carouselTitle,
        whatsappNumber,
      };
      
      // Update superfrete in siteContent
      newSettings.siteContent = {
        ...newSettings.siteContent,
        superfrete: {
          originCep: sfCep,
          token: sfToken
        }
      };
      
      await updateSettings(newSettings);"""
content = content.replace(target_save, replacement_save)

target_html = """              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Número do WhatsApp (apenas números)
                </label>"""
replacement_html = """              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100 flex items-center"><ShoppingBag className="w-5 h-5 mr-2" /> Integração SuperFrete</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">CEP de Origem (Remetente)</label>
                    <input type="text" value={sfCep} onChange={(e) => setSfCep(e.target.value)} placeholder="00000-000" className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Token (API Key)</label>
                    <input type="password" value={sfToken} onChange={(e) => setSfToken(e.target.value)} placeholder="Token da SuperFrete" className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Número do WhatsApp (apenas números)
                </label>"""
content = content.replace(target_html, replacement_html)

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(content)
