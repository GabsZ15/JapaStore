import os

files = ['src/pages/AdminPage.tsx', 'src/pages/SearchPage.tsx', 'src/components/ProductGrid.tsx']

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Import mapSupabaseProduct
    content = content.replace("import { Product } from '../types';", "import { Product } from '../types';\nimport { mapSupabaseProduct } from '../utils/productUtils';")
    
    # Replace the mapping logic
    import re
    # AdminPage and SearchPage mapping
    content = re.sub(r'const (mappedProducts|supabaseProducts): Product\[\] = data\.map\(item => \(\{\s*id: item\.id,[\s\S]*?description: item\.description\s*\}\)\);', r'const \1: Product[] = data.map(mapSupabaseProduct);', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
