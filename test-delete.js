import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
if (supabaseUrl === 'https://kqxluuxtnicsvwzmqjtk.supabase.co') {
  supabaseUrl = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);
async function test() {
  const { data: products } = await supabase.from('products').select('*').limit(1);
  if (products && products.length > 0) {
    const id = products[0].id;
    console.log("Attempting to delete product:", id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error("Error:", error);
    else console.log("Deleted successfully!");
  }
}
test();
