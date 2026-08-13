import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    content = f.read()

# Add state variables
state_target = "  const [topBarText, setTopBarText] = useState(settings.topBarText);"
state_replacement = """  const [heroBanner1, setHeroBanner1] = useState(settings.siteContent?.heroBanners?.banner1 || '/images/japastorebanner1.jpeg');
  const [heroBanner2, setHeroBanner2] = useState(settings.siteContent?.heroBanners?.banner2 || '/images/japastorebanner2.jpeg');
  const [topBarText, setTopBarText] = useState(settings.topBarText);"""
content = content.replace(state_target, state_replacement)

# Update save payload
save_target = """        siteContent: {
          ...settings.siteContent,
          superfrete: {
            originCep: sfCep,
            token: sfToken
          }
        },"""
save_replacement = """        siteContent: {
          ...settings.siteContent,
          heroBanners: {
            banner1: heroBanner1,
            banner2: heroBanner2
          },
          superfrete: {
            originCep: sfCep,
            token: sfToken
          }
        },"""
content = content.replace(save_target, save_replacement)

# Update form JSX
jsx_target = """              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
              </div>"""

jsx_replacement = """              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
              </div>"""

content = content.replace(jsx_target, jsx_replacement)

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(content)
