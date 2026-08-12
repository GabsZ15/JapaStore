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
  const { data, error } = await supabase.from('products').select('id').limit(5);
  console.log("IDs in DB:", data);
}
test();
