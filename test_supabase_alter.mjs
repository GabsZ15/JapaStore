import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kqxluxtynicsvwzmqjtk.supabase.co';
let fixedUrl = supabaseUrl;
if (fixedUrl === 'https://kqxluuxtnicsvwzmqjtk.supabase.co') {
  fixedUrl = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
}
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(fixedUrl, supabaseAnonKey);
const { data, error } = await supabase.from('products').update({ sizes: ['P', 'M'] }).eq('id', '0677b5c9-ceaa-4008-bc99-c1b7326167e8');
console.log(error);
