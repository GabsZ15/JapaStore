import os

pages = ['RoupasPage', 'LancamentosPage', 'TenisPage', 'SalePage']

for name in pages:
    filepath = f"src/pages/{name}.tsx"
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace("linkText={content.ctaText}", "linkText={content.ctaText} onLinkTextChange={(v) => handleUpdate('ctaText', v)}")
    
    with open(filepath, 'w') as f:
        f.write(content)
