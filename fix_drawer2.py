import re

with open('src/components/CartDrawer.tsx', 'r') as f:
    content = f.read()

# Fix line 30
content = content.replace("message += `${item.quantity}x ${item.name} {item.selectedSize ? `(Tam: ${item.selectedSize})` : ''} - ${formatCurrency(price)}\\n`;", "message += `${item.quantity}x ${item.name} ${item.selectedSize ? `(Tam: ${item.selectedSize})` : ''} - ${formatCurrency(price)}\\n`;")

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(content)
