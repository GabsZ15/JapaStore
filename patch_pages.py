import glob

default_content = {
    'MoletonsPage.tsx': "{ title: 'Moletons', subtitle: '', gridTitle: 'Moletons', ctaText: '' }",
    'CamisetasPage.tsx': "{ title: 'Camisetas', subtitle: '', gridTitle: 'Camisetas', ctaText: '' }",
    'BermudasPage.tsx': "{ title: 'Bermudas', subtitle: '', gridTitle: 'Bermudas', ctaText: '' }"
}

for filepath in glob.glob('src/pages/*Page.tsx'):
    filename = filepath.split('/')[-1]
    if filename in default_content:
        with open(filepath, 'r') as f:
            content = f.read()
        
        category = filename.replace('Page.tsx', '').lower()
        target = f"const content = settings.siteContent.pages.{category};"
        replacement = f"const content = settings.siteContent?.pages?.{category} || {default_content[filename]};"
        
        content = content.replace(target, replacement)
        
        with open(filepath, 'w') as f:
            f.write(content)
