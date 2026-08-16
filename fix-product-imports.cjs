const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');

code = code.replace(
  `import { Heart, ChevronLeft, ShoppingBag } from 'lucide-react';`,
  `import { Heart, ChevronLeft, ShoppingBag, Minus, Plus } from 'lucide-react';`
);

fs.writeFileSync('src/pages/ProductPage.tsx', code);
