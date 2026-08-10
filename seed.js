import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (supabaseUrl === 'https://kqxluuxtnicsvwzmqjtk.supabase.co') {
  supabaseUrl = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MOCK_PRODUCTS = [
  {
    name: 'Camiseta Oversized Heavyweight Preta',
    price: 129.90,
    installments: 3,
    image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600',
    category: 'Roupas'
  },
  {
    name: 'Moletom Essential Canguru Cinza',
    price: 259.90,
    discount: 15,
    installments: 6,
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
    category: 'Roupas'
  },
  {
    name: 'Calça Cargo Utility Khaki',
    price: 199.90,
    installments: 4,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d1ead6bb246d?auto=format&fit=crop&q=80&w=600',
    out_of_stock: true,
    category: 'Roupas'
  },
  {
    name: 'Tênis Casual Retro Branco',
    price: 349.90,
    installments: 12,
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
    category: 'Tenis'
  },
  {
    name: 'Boné Dad Hat Logo Minimal',
    price: 89.90,
    installments: 2,
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
    category: 'Acessorios'
  }
];

async function seed() {
  console.log("Seeding mock products...");
  const { data, error } = await supabase.from('products').insert(MOCK_PRODUCTS);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success:", data);
  }
}
seed();
