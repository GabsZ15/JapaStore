const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');

// Add selectedColor state
code = code.replace(
  `const [selectedSize, setSelectedSize] = useState<string>('');`,
  `const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');`
);

// Add to default color logic
code = code.replace(
  `if (mapped.sizes && mapped.sizes.length > 0) {
          setSelectedSize(mapped.sizes[0]);
        }`,
  `if (mapped.sizes && mapped.sizes.length > 0) {
          setSelectedSize(mapped.sizes[0]);
        }
        if (mapped.colors && mapped.colors.length > 0) {
          setSelectedColor(mapped.colors[0]);
        }`
);

// Add to cart payload
code = code.replace(
  `selectedSize: selectedSize || undefined`,
  `selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined`
);

// Add Colors UI
const colorsUI = `            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Cor</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={\`px-6 h-12 flex items-center justify-center border font-bold transition-all \${
                        selectedColor === color 
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' 
                          : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-white'
                      }\`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
`;

code = code.replace(
  `{/* Sizes */}`,
  colorsUI + `            {/* Sizes */}`
);

fs.writeFileSync('src/pages/ProductPage.tsx', code);
