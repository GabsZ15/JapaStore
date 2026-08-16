const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');

// Imports
code = code.replace(
  `import { Heart, ShoppingBag, ChevronLeft } from 'lucide-react';`,
  `import { Heart, ShoppingBag, ChevronLeft, Minus, Plus } from 'lucide-react';`
);

// State
code = code.replace(
  `const [selectedColor, setSelectedColor] = useState<string>('');`,
  `const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);`
);

// Logic
code = code.replace(
  `if (mapped.colors && mapped.colors.length > 0) {
          setSelectedColor(mapped.colors[0]);
        }`,
  `if (mapped.colors && mapped.colors.length > 0) {
          setSelectedColor(mapped.colors[0]);
        }
        if (mapped.variants && mapped.variants.length > 0) {
          setSelectedColor(mapped.variants[0].color);
          if (mapped.variants[0].sizes.length > 0) {
             const firstAvailable = mapped.variants[0].sizes.find(s => s.stock > 0);
             if (firstAvailable) {
               setSelectedSize(firstAvailable.name);
             } else {
               setSelectedSize(mapped.variants[0].sizes[0].name);
             }
          }
        }`
);

// Reset quantity when color/size changes? Let's use effects
code = code.replace(
  `const handleAddToCart = () => {`,
  `
  // Derived state for variants
  const hasVariants = product?.variants && product.variants.length > 0;
  const activeVariant = hasVariants ? product.variants.find(v => v.color === selectedColor) : null;
  const availableSizesForColor = activeVariant ? activeVariant.sizes : (product?.sizes ? product.sizes.map(s => ({ name: s, stock: 999 })) : []);
  
  const currentSizeObj = availableSizesForColor.find(s => s.name === selectedSize);
  const maxStock = currentSizeObj ? currentSizeObj.stock : (hasVariants ? 0 : 999);
  const isOutOfStock = hasVariants ? maxStock === 0 : !!product?.outOfStock;

  // Sync selected size if color changes
  useEffect(() => {
    if (activeVariant && activeVariant.sizes.length > 0) {
       const hasCurrentSize = activeVariant.sizes.find(s => s.name === selectedSize);
       if (!hasCurrentSize) {
         const firstAvailable = activeVariant.sizes.find(s => s.stock > 0);
         setSelectedSize(firstAvailable ? firstAvailable.name : activeVariant.sizes[0].name);
       }
    }
  }, [selectedColor, activeVariant]);

  // Cap quantity
  useEffect(() => {
    if (quantity > maxStock && maxStock > 0) {
      setQuantity(maxStock);
    }
  }, [maxStock, quantity]);

  const handleAddToCart = () => {`
);

// Add to cart payload
code = code.replace(
  `addToCart({
      ...product,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined
    });`,
  `addToCart({
      ...product,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined
    }, quantity);`
);

// Render Colors
code = code.replace(
  `{product.colors.map((color) => (`,
  `{(hasVariants ? product.variants.map(v => v.color) : product.colors).map((color) => (`
);

// Render Sizes
const sizesUI = `
            {/* Sizes */}
            {availableSizesForColor.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Tamanho</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizesForColor.map((sizeObj) => {
                    const size = sizeObj.name;
                    const stock = sizeObj.stock;
                    const disabled = hasVariants && stock === 0;
                    return (
                    <button
                      key={size}
                      disabled={disabled}
                      onClick={() => setSelectedSize(size)}
                      className={\`h-12 w-12 flex items-center justify-center border font-bold transition-all \${
                        disabled ? 'opacity-30 cursor-not-allowed bg-zinc-100 dark:bg-zinc-900' :
                        selectedSize === size 
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' 
                          : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                      }\`}
                    >
                      {size}
                    </button>
                  )})}
                </div>
              </div>
            )}
`;
const oldSizesUI = `{/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Tamanho</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={\`h-12 w-12 flex items-center justify-center border font-bold transition-all \${
                        selectedSize === size 
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' 
                          : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                      }\`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}`;

code = code.replace(oldSizesUI, sizesUI);

const actionUI = `
            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="flex gap-4">
                <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-sm h-14 bg-white dark:bg-zinc-950 px-2 w-32 justify-between">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= maxStock}
                    className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 h-14 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isOutOfStock ? 'Indisponível' : 'Adicionar à Sacola'}
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
                  className={\`h-14 w-14 flex items-center justify-center border transition-colors \${
                    isFav 
                      ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-500/10' 
                      : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                  }\`}
                >
                  <Heart className={\`h-6 w-6 \${isFav ? 'fill-current' : ''}\`} />
                </button>
              </div>
              {hasVariants && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                  Estoque disponível: {maxStock}
                </div>
              )}
            </div>
`;

const oldActionUI = `{/* Actions */}
            <div className="flex gap-4 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={product.outOfStock}
                className="flex-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 h-14 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-5 w-5" />
                {product.outOfStock ? 'Indisponível' : 'Adicionar à Sacola'}
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
                className={\`h-14 w-14 flex items-center justify-center border transition-colors \${
                  isFav 
                    ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-500/10' 
                    : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                }\`}
              >
                <Heart className={\`h-6 w-6 \${isFav ? 'fill-current' : ''}\`} />
              </button>
            </div>`;

code = code.replace(oldActionUI, actionUI);

// Fix "Esgotado" label over image to use isOutOfStock
code = code.replace(
  `{product.outOfStock && (`,
  `{isOutOfStock && (`
);

fs.writeFileSync('src/pages/ProductPage.tsx', code);
