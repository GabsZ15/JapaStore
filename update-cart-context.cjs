const fs = require('fs');
let code = fs.readFileSync('src/contexts/CartContext.tsx', 'utf8');

code = code.replace(
  `removeFromCart: (productId: string, selectedSize?: string) => void;`,
  `removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;`
);

code = code.replace(
  `updateQuantity: (productId: string, selectedSize: string | undefined, quantity: number) => void;`,
  `updateQuantity: (productId: string, selectedSize: string | undefined, selectedColor: string | undefined, quantity: number) => void;`
);

code = code.replace(
  `const existing = prev.find((item) => item.id === product.id && item.selectedSize === product.selectedSize);`,
  `const existing = prev.find((item) => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor);`
);

code = code.replace(
  `item.id === product.id && item.selectedSize === product.selectedSize ? { ...item, quantity: item.quantity + 1 } : item`,
  `item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor ? { ...item, quantity: item.quantity + 1 } : item`
);

code = code.replace(
  `const removeFromCart = (productId: string, selectedSize?: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === selectedSize)));
  };`,
  `const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)));
  };`
);

code = code.replace(
  `const updateQuantity = (productId: string, selectedSize: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.id === productId && item.selectedSize === selectedSize) ? { ...item, quantity } : item
      )
    );
  };`,
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
  };`
);

fs.writeFileSync('src/contexts/CartContext.tsx', code);
