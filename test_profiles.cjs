const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.VITE_SUPABASE_URL || 'https://kqxluxtynicsvwzmqjtk.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!key) {
  console.log("No key");
  process.exit(1);
}

const supabase = createClient(url, key);
async function test() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  console.log(error ? 'Error: ' + error.message : 'Success');
}
test();
