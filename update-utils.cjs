const fs = require('fs');
let code = fs.readFileSync('src/utils/productUtils.ts', 'utf8');

if (!code.includes('ProductVariant')) {
  code = code.replace(
    `export function parseProductDescription(desc: string | null | undefined): { text: string; sizes: string[]; colors: string[]; extraImages: string[]; weight?: number; height?: number; width?: number; length?: number } {`,
    `import { ProductVariant } from '../types';\nexport function parseProductDescription(desc: string | null | undefined): { text: string; sizes: string[]; colors: string[]; extraImages: string[]; weight?: number; height?: number; width?: number; length?: number; variants?: ProductVariant[] } {`
  );
  
  code = code.replace(
    `if (!desc) return { text: '', sizes: [], colors: [], extraImages: [] };`,
    `if (!desc) return { text: '', sizes: [], colors: [], extraImages: [], variants: [] };`
  );

  code = code.replace(
    `if (parsed && typeof parsed === 'object' && ('text' in parsed || 'sizes' in parsed || 'colors' in parsed || 'extraImages' in parsed)) {`,
    `if (parsed && typeof parsed === 'object' && ('text' in parsed || 'sizes' in parsed || 'colors' in parsed || 'extraImages' in parsed || 'variants' in parsed)) {`
  );

  code = code.replace(
    `colors: Array.isArray(parsed.colors) ? parsed.colors : [],`,
    `colors: Array.isArray(parsed.colors) ? parsed.colors : [],
        variants: Array.isArray(parsed.variants) ? parsed.variants : [],`
  );

  code = code.replace(
    `return { text: desc, sizes: [], colors: [], extraImages: [] };`,
    `return { text: desc, sizes: [], colors: [], extraImages: [], variants: [] };`
  );
  
  // Ensure we don't duplicate imports if any
  code = code.replace(`import { Product } from '../types';\nimport { ProductVariant }`, `import { Product, ProductVariant }`);
  
  code = code.replace(
    `export function stringifyProductDescription(text: string, sizes: string[], colors: string[], extraImages: string[], weight?: number, height?: number, width?: number, length?: number): string {`,
    `export function stringifyProductDescription(text: string, sizes: string[], colors: string[], extraImages: string[], weight?: number, height?: number, width?: number, length?: number, variants?: ProductVariant[]): string {`
  );

  code = code.replace(
    `return JSON.stringify({ text, sizes, colors, extraImages, weight, height, width, length });`,
    `return JSON.stringify({ text, sizes, colors, extraImages, weight, height, width, length, variants });`
  );

  code = code.replace(
    `const { text, sizes, colors, extraImages } = parseProductDescription(item.description);
  const { weight, height, width, length } = parseProductDescription(item.description);`,
    `const { text, sizes, colors, extraImages, variants, weight, height, width, length } = parseProductDescription(item.description);`
  );

  code = code.replace(
    `colors: colors,`,
    `colors: colors,
    variants: variants,`
  );
  
  fs.writeFileSync('src/utils/productUtils.ts', code);
  console.log('Utils updated');
}
