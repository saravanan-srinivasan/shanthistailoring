require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const url = "https://qzrjsurtdguvmipusefj.supabase.co/storage/v1/object/public/order_references/zkajf3xyet7.png";
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  console.log("Filename to delete:", filename);
  
  // Uncomment to actually test deletion if needed
  // const { data, error } = await supabase.storage.from('order_references').remove([filename]);
  // console.log("Result:", data, error);
}

test();
