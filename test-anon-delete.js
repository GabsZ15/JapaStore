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
  console.log("Using Anon Key:", supabaseAnonKey.substring(0, 10) + "...");
  
  // 1. Insert
  const { data: inserted, error: insertError } = await supabase
    .from('products')
    .insert({ name: 'RLS_TEST', price: 99 })
    .select();
    
  if (insertError) {
    console.error("Insert failed:", insertError);
    return;
  }
  
  const id = inserted[0].id;
  console.log("Inserted:", id);
  
  // 2. Delete
  const { error: delError, data, count } = await supabase
    .from('products')
    .delete({ count: 'exact' })
    .eq('id', id)
    .select();
    
  console.log("Delete result - Error:", delError, "Data:", data, "Count:", count);
  
  // 3. Verify
  const { data: check } = await supabase.from('products').select('*').eq('id', id);
  console.log("Still exists?", check.length > 0);
}
test();
