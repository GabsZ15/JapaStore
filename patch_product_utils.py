import re

with open('src/utils/productUtils.ts', 'r') as f:
    content = f.read()

target1 = """export function parseProductDescription(desc: string | null | undefined): { text: string; sizes: string[]; extraImages: string[] } {"""
replacement1 = """export function parseProductDescription(desc: string | null | undefined): { text: string; sizes: string[]; extraImages: string[]; weight?: number; height?: number; width?: number; length?: number } {"""

target2 = """      return {
        text: parsed.text || '',
        sizes: Array.isArray(parsed.sizes) ? parsed.sizes : [],
        extraImages: Array.isArray(parsed.extraImages) ? parsed.extraImages : []
      };"""
replacement2 = """      return {
        text: parsed.text || '',
        sizes: Array.isArray(parsed.sizes) ? parsed.sizes : [],
        extraImages: Array.isArray(parsed.extraImages) ? parsed.extraImages : [],
        weight: parsed.weight,
        height: parsed.height,
        width: parsed.width,
        length: parsed.length
      };"""

target3 = """  return { text: desc, sizes: [], extraImages: [] };"""
replacement3 = """  return { text: desc, sizes: [], extraImages: [] };""" # no change

target4 = """export function stringifyProductDescription(text: string, sizes: string[], extraImages: string[]): string {
  // Always stringify to keep it consistent
  return JSON.stringify({ text, sizes, extraImages });
}"""
replacement4 = """export function stringifyProductDescription(text: string, sizes: string[], extraImages: string[], weight?: number, height?: number, width?: number, length?: number): string {
  // Always stringify to keep it consistent
  return JSON.stringify({ text, sizes, extraImages, weight, height, width, length });
}"""

target5 = """  return {
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
  };"""
replacement5 = """  const { weight, height, width, length } = parseProductDescription(item.description);
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
    extraImages: extraImages,
    weight, height, width, length
  };"""

content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)
content = content.replace(target4, replacement4)
content = content.replace(target5, replacement5)

with open('src/utils/productUtils.ts', 'w') as f:
    f.write(content)
