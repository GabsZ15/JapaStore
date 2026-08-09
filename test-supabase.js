import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxeGx1eHR5bmljc3Z3em1xanRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMjQwNTksImV4cCI6MjEwMTgwMDA1OX0.WZgSNf-w8bWSg97k9E38oZqFwW6x474G1ox4m1qYDeE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('settings').select('*');
  console.log('Settings:', data, error);
  
  const { data: pData, error: pError } = await supabase.from('products').select('*');
  console.log('Products:', pData, pError);
}

test();
