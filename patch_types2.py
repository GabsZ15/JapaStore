import re

with open('src/types.ts', 'r') as f:
    content = f.read()

target1 = """  sizes?: string[];
  extraImages?: string[];
  selectedSize?: string;
}"""
replacement1 = """  sizes?: string[];
  extraImages?: string[];
  selectedSize?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
}"""

target2 = """export interface SiteContent {"""
replacement2 = """export interface SiteContent {
  superfrete?: {
    originCep: string;
    token: string;
  };"""

target3 = """export const defaultSiteContent: SiteContent = {"""
replacement3 = """export const defaultSiteContent: SiteContent = {
  superfrete: {
    originCep: '',
    token: ''
  },"""

content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)
content = content.replace(target3, replacement3)

with open('src/types.ts', 'w') as f:
    f.write(content)
