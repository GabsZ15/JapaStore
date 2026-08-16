import { Product } from '../types';

import { ProductVariant } from '../types';
export function parseProductDescription(desc: string | null | undefined): { text: string; sizes: string[]; colors: string[]; extraImages: string[]; weight?: number; height?: number; width?: number; length?: number; variants?: ProductVariant[]; discount?: number } {
  if (!desc) return { text: '', sizes: [], colors: [], extraImages: [], variants: [] };
  try {
    const parsed = JSON.parse(desc);
    if (parsed && typeof parsed === 'object' && ('text' in parsed || 'sizes' in parsed || 'colors' in parsed || 'extraImages' in parsed || 'variants' in parsed || 'discount' in parsed)) {
      return {
        text: parsed.text || '',
        sizes: Array.isArray(parsed.sizes) ? parsed.sizes : [],
        colors: Array.isArray(parsed.colors) ? parsed.colors : [],
        variants: Array.isArray(parsed.variants) ? parsed.variants : [],
        extraImages: Array.isArray(parsed.extraImages) ? parsed.extraImages : [],
        weight: parsed.weight,
        height: parsed.height,
        width: parsed.width,
        length: parsed.length,
        discount: parsed.discount
      };
    }
  } catch (e) {
    // If it's not JSON, it's just plain text
  }
  return { text: desc, sizes: [], colors: [], extraImages: [], variants: [] };
}

export function stringifyProductDescription(text: string, sizes: string[], colors: string[], extraImages: string[], weight?: number, height?: number, width?: number, length?: number, variants?: ProductVariant[], discount?: number): string {
  // Always stringify to keep it consistent
  return JSON.stringify({ text, sizes, colors, extraImages, weight, height, width, length, variants, discount });
}

export function mapSupabaseProduct(item: any): Product {
  const { text, sizes, colors, extraImages, variants, weight, height, width, length, discount } = parseProductDescription(item.description);
  
  // Use DB discount if available, otherwise fallback to the one in JSON description.
  const finalDiscount = item.discount !== undefined && item.discount !== null ? item.discount : discount;
  
  return {
    id: item.id,
    name: item.name,
    price: Number(item.price),
    installments: item.installments,
    discount: finalDiscount,
    category: item.category,
    imageUrl: item.image_url,
    outOfStock: item.out_of_stock,
    description: text,
    sizes: sizes,
    colors: colors,
    variants: variants,
    extraImages: extraImages,
    weight, height, width, length
  };
}
