import { Product } from '../types';

export function parseProductDescription(desc: string | null | undefined): { text: string; sizes: string[]; extraImages: string[] } {
  if (!desc) return { text: '', sizes: [], extraImages: [] };
  try {
    const parsed = JSON.parse(desc);
    if (parsed && typeof parsed === 'object' && ('text' in parsed || 'sizes' in parsed || 'extraImages' in parsed)) {
      return {
        text: parsed.text || '',
        sizes: Array.isArray(parsed.sizes) ? parsed.sizes : [],
        extraImages: Array.isArray(parsed.extraImages) ? parsed.extraImages : []
      };
    }
  } catch (e) {
    // If it's not JSON, it's just plain text
  }
  return { text: desc, sizes: [], extraImages: [] };
}

export function stringifyProductDescription(text: string, sizes: string[], extraImages: string[]): string {
  // Always stringify to keep it consistent
  return JSON.stringify({ text, sizes, extraImages });
}

export function mapSupabaseProduct(item: any): Product {
  const { text, sizes, extraImages } = parseProductDescription(item.description);
  return {
    id: item.id,
    name: item.name,
    price: Number(item.price),
    installments: item.installments,
    discount: item.discount,
    category: item.category,
    imageUrl: item.image_url,
    outOfStock: item.out_of_stock,
    description: text,
    sizes: sizes,
    extraImages: extraImages
  };
}
