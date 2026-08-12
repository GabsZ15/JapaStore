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
  const { data, error } = await supabase.rpc('get_policies'); // fake rpc, won't work, but let's see.
  // Instead, let's just insert a product and then delete it using the EXACT SAME CODE AdminPage uses.
  
  const idToDelete = '438074af-bf6a-495d-914a-010e3ca12101'; // Try deleting a specific one if it exists
  const { data: d1 } = await supabase.from('products').select('id').limit(1);
  if(d1 && d1.length > 0) {
    const id = d1[0].id;
    console.log("Found product to delete:", id);
    const { error: delError } = await supabase.from('products').delete().eq('id', id);
    console.log("Delete error:", delError);
  } else {
    console.log("No products.");
  }
}
test();
