import re
import os

pages = {
    'src/pages/LancamentosPage.tsx': 'lancamentos',
    'src/pages/RoupasPage.tsx': 'roupas',
    'src/pages/TenisPage.tsx': 'tenis',
    'src/pages/SalePage.tsx': 'sale'
}

for filename, page_key in pages.items():
    with open(filename, 'r') as f:
        content = f.read()
    
    # Let's just fix the h1 tag
    if page_key == 'lancamentos':
        content = re.sub(r'<h1 className="[^"]*">\{content\.title\}</h1>', r'<h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-zinc-900 dark:text-white transition-colors duration-300">{content.title}</h1>', content)
    elif page_key == 'sale':
        content = re.sub(r'<h1 className="[^"]*">\{content\.title\}</h1>', r'<h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-red-600 dark:text-red-500 transition-colors duration-300">{content.title}</h1>', content)
    else:
        content = re.sub(r'<h1 className="[^"]*">\{content\.title\}</h1>', r'<h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-zinc-900 dark:text-white transition-colors duration-300">{content.title}</h1>', content)
        
    with open(filename, 'w') as f:
        f.write(content)
