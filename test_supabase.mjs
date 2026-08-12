import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kqxluxtynicsvwzmqjtk.supabase.co';
let fixedUrl = supabaseUrl;
if (fixedUrl === 'https://kqxluuxtnicsvwzmqjtk.supabase.co') {
  fixedUrl = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
}
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(fixedUrl, supabaseAnonKey);
const { data, error } = await supabase.from('products').select('*').limit(1);
if (error) console.error(error);
console.log(JSON.stringify(data, null, 2));
