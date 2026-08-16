const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

code = code.replace(
  `import { Product } from '../types';`,
  `import { Product, ProductVariant } from '../types';`
);

code = code.replace(
  `const [colors, setColors] = useState<string>('');`,
  `const [colors, setColors] = useState<string>('');
  const [useAdvancedInventory, setUseAdvancedInventory] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);`
);

code = code.replace(
  `const parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    const parsedColors = colors.split(',').map(c => c.trim()).filter(c => c !== '');`,
  `const parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    const parsedColors = colors.split(',').map(c => c.trim()).filter(c => c !== '');
    const finalVariants = useAdvancedInventory ? variants : [];
    
    // Auto-generate colors/sizes from variants for backward compatibility
    const fallbackSizes = useAdvancedInventory 
      ? Array.from(new Set(variants.flatMap(v => v.sizes.map(s => s.name))))
      : parsedSizes;
    const fallbackColors = useAdvancedInventory 
      ? variants.map(v => v.color).filter(c => c !== '')
      : parsedColors;`
);

code = code.replace(
  `description, parsedSizes, parsedColors, parsedExtraImages, 
      weight`,
  `description, fallbackSizes, fallbackColors, parsedExtraImages, 
      weight ? parseFloat(weight.replace(',', '.')) : undefined,
      height ? parseFloat(height.replace(',', '.')) : undefined,
      width ? parseFloat(width.replace(',', '.')) : undefined,
      length ? parseFloat(length.replace(',', '.')) : undefined,
      finalVariants
    ); //`
);

code = code.replace(
  `setColors((product.colors || []).join(', '));`,
  `setColors((product.colors || []).join(', '));
    setUseAdvancedInventory(!!product.variants && product.variants.length > 0);
    setVariants(product.variants || []);`
);

code = code.replace(
  `setColors('');`,
  `setColors('');
      setUseAdvancedInventory(false);
      setVariants([]);`
);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
