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
  // We can try to do an RPC if available to fetch policies, or just print that we can't.
  // Actually, wait, if it deletes successfully, maybe it is returning an error that is swallowed?
  const { data, error } = await supabase.from('products').select('*');
  console.log("Current products count:", data ? data.length : "error");
}
test();
