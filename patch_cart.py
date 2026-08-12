import re

with open('src/contexts/CartContext.tsx', 'r') as f:
    content = f.read()

# Make removeFromCart handle composite ID if needed, but wait! The items in the cart are identified by item.id
# If we add selectedSize, we might need a unique cartItemId, or just use item.id + (item.selectedSize ? '-' + item.selectedSize : '')
# Let's change the CartItem interface to have a unique cartItemId. But wait, `removeFromCart` takes `productId`. 
# If we change `removeFromCart(productId)` to `removeFromCart(cartItemId)`, we have to change `CartDrawer.tsx` too.

# Actually, to be simple, let's just make `existing` check for BOTH id and selectedSize.
content = content.replace("const existing = prev.find((item) => item.id === product.id);", "const existing = prev.find((item) => item.id === product.id && item.selectedSize === product.selectedSize);")
content = content.replace("item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item", "item.id === product.id && item.selectedSize === product.selectedSize ? { ...item, quantity: item.quantity + 1 } : item")

# Wait, `removeFromCart(productId)` will remove ALL sizes of that product if they share the same ID!
# We can change removeFromCart to `removeFromCart(productId: string, selectedSize?: string)`
content = content.replace("removeFromCart: (productId: string) => void;", "removeFromCart: (productId: string, selectedSize?: string) => void;")
content = content.replace("const removeFromCart = (productId: string) => {", "const removeFromCart = (productId: string, selectedSize?: string) => {")
content = content.replace("item.id !== productId", "!(item.id === productId && item.selectedSize === selectedSize)")

# updateQuantity
content = content.replace("updateQuantity: (productId: string, quantity: number) => void;", "updateQuantity: (productId: string, selectedSize: string | undefined, quantity: number) => void;")
content = content.replace("const updateQuantity = (productId: string, quantity: number) => {", "const updateQuantity = (productId: string, selectedSize: string | undefined, quantity: number) => {")
content = content.replace("removeFromCart(productId);", "removeFromCart(productId, selectedSize);")
content = content.replace("item.id === productId ?", "(item.id === productId && item.selectedSize === selectedSize) ?")

with open('src/contexts/CartContext.tsx', 'w') as f:
    f.write(content)
