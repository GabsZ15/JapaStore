const fs = require('fs');
let code = fs.readFileSync('src/contexts/CartContext.tsx', 'utf8');

code = code.replace(
  `const updateQuantity = (productId: string, selectedSize: string | undefined, selectedColor: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor) ? { ...item, quantity } : item
      )
    );
  };`,
  `const updateQuantity = (productId: string, selectedSize: string | undefined, selectedColor: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor) {
           let maxStock = 999;
           if (item.variants && item.variants.length > 0 && selectedColor && selectedSize) {
              const activeVariant = item.variants.find(v => v.color === selectedColor);
              if (activeVariant) {
                 const sizeObj = activeVariant.sizes.find(s => s.name === selectedSize);
                 if (sizeObj) maxStock = sizeObj.stock;
              }
           }
           const finalQty = Math.min(quantity, maxStock);
           return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };`
);

fs.writeFileSync('src/contexts/CartContext.tsx', code);
