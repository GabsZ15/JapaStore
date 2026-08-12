import re

with open('src/components/CartDrawer.tsx', 'r') as f:
    content = f.read()

content = content.replace("removeFromCart(item.id)", "removeFromCart(item.id, item.selectedSize)")
content = content.replace("updateQuantity(item.id, item.quantity - 1)", "updateQuantity(item.id, item.selectedSize, item.quantity - 1)")
content = content.replace("updateQuantity(item.id, item.quantity + 1)", "updateQuantity(item.id, item.selectedSize, item.quantity + 1)")

# Show selected size if it exists
# We can append it to the name or add a new span
name_jsx = "{item.name}"
name_jsx_new = "{item.name} {item.selectedSize ? `(Tam: ${item.selectedSize})` : ''}"
content = content.replace(name_jsx, name_jsx_new)

# Also update the WhatsApp message to include size
wa_msg = "message += `${item.quantity}x ${item.name} - ${formatCurrency(price)}\\n`;"
wa_msg_new = "message += `${item.quantity}x ${item.name} ${item.selectedSize ? `(Tam: ${item.selectedSize})` : ''} - ${formatCurrency(price)}\\n`;"
content = content.replace(wa_msg, wa_msg_new)

# CartItems need a unique key. Instead of item.id, use item.id + item.selectedSize
content = content.replace("key={item.id}", "key={`${item.id}-${item.selectedSize || ''}`}")

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(content)
