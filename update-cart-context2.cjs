const fs = require('fs');
let code = fs.readFileSync('src/contexts/CartContext.tsx', 'utf8');

code = code.replace(
  `addToCart: (product: Product) => void;`,
  `addToCart: (product: Product, quantity?: number) => void;`
);

code = code.replace(
  `const addToCart = (product: Product) => {`,
  `const addToCart = (product: Product, quantity: number = 1) => {`
);

code = code.replace(
  `? { ...item, quantity: item.quantity + 1 } : item`,
  `? { ...item, quantity: item.quantity + quantity } : item`
);

code = code.replace(
  `return [...prev, { ...product, quantity: 1 }];`,
  `return [...prev, { ...product, quantity }];`
);

fs.writeFileSync('src/contexts/CartContext.tsx', code);
