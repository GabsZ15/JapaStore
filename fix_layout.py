import os
import re

pages = ['RoupasPage.tsx', 'LancamentosPage.tsx', 'TenisPage.tsx', 'SalePage.tsx']

for page in pages:
    filepath = os.path.join('src/pages', page)
    with open(filepath, 'r') as f:
        content = f.read()

    # Change the container div to flex column
    old_div = '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">'
    new_div = '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 flex flex-col items-center justify-center text-center">'
    
    if old_div in content:
        content = content.replace(old_div, new_div)
    
    # Remove ' inline-block' from the EditableText classes
    content = content.replace(' inline-block"', '"')

    with open(filepath, 'w') as f:
        f.write(content)

