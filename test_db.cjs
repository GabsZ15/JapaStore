require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
let url = process.env.VITE_SUPABASE_URL || 'https://kqxluxtynicsvwzmqjtk.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);
async function run() {
  const { data, error } = await supabase.from('settings').select('*').single();
  console.log(data ? "Settings exists" : "Error", error);
}
run();
