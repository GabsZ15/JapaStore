const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('ProductVariant')) {
  code = code.replace(
    `export interface Product {`,
    `export interface ProductVariantSize {
  name: string;
  stock: number;
}

export interface ProductVariant {
  color: string;
  sizes: ProductVariantSize[];
}

export interface Product {`
  );

  code = code.replace(
    `selectedColor?: string;`,
    `selectedColor?: string;
  variants?: ProductVariant[];`
  );
  
  fs.writeFileSync('src/types.ts', code);
  console.log('Types updated');
}
