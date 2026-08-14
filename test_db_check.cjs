require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
let url = process.env.VITE_SUPABASE_URL || 'https://kqxluxtynicsvwzmqjtk.supabase.co';
if (url === 'https://kqxluuxtnicsvwzmqjtk.supabase.co') url = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);
async function run() {
  const { data: s1, error: e1 } = await supabase.from('settings').select('*').single();
  console.log('settings table:', s1 ? 'exists' : e1);
  const { data: s2, error: e2 } = await supabase.from('site_settings').select('*').single();
  console.log('site_settings table:', s2 ? 'exists' : e2);
}
run();
