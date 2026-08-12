import re

with open('src/components/CartDrawer.tsx', 'r') as f:
    content = f.read()

# Fix the alt attribute
content = content.replace("alt={item.name} ${item.selectedSize ? `(Tam: ${item.selectedSize})` : ''}", "alt={item.name}")

# Fix the JSX element for name
content = content.replace("{item.name} ${item.selectedSize ? `(Tam: ${item.selectedSize})` : ''}", "{item.name} {item.selectedSize ? `(Tam: ${item.selectedSize})` : ''}")

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(content)
