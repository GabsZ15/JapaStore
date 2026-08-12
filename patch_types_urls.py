import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace('"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600"', '"/images/moletons.jpg"')
content = content.replace('"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"', '"/images/camisetas.jpg"')
content = content.replace('"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600"', '"/images/bermudas.jpg"')

with open('src/types.ts', 'w') as f:
    f.write(content)
