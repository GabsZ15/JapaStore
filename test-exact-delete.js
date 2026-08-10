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
  console.log("Inserting a test product...");
  const { data: insertData, error: insertError } = await supabase
    .from('products')
    .insert({ name: 'TEST_PRODUCT', price: 100 })
    .select();
    
  if (insertError) {
    console.error("Insert error:", insertError);
    return;
  }
  
  const id = insertData[0].id;
  console.log("Inserted with ID:", id);
  
  console.log("Deleting...");
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Delete error:", error);
  } else {
    console.log("Delete didn't return an error.");
  }
  
  console.log("Checking if it's still there...");
  const { data } = await supabase.from('products').select('*').eq('id', id);
  console.log("Data after delete:", data);
}
test();
