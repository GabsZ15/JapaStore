require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

let supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kqxluxtynicsvwzmqjtk.supabase.co';
if (supabaseUrl === 'https://kqxluuxtnicsvwzmqjtk.supabase.co') {
  supabaseUrl = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
}
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  console.log("No key provided, skipping migration");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('products')
    .update({ category: 'Acessorios' })
    .or('category.eq.Sale,category.eq.sale,category.eq.SALE');

  if (error) {
    console.error("Migration failed:", error);
  } else {
    console.log("Migration successful");
  }
}
run();
