import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzrjsurtdguvmipusefj.supabase.co';
const supabaseKey = 'sb_publishable_Squo-5jieZIHAk1G4Hpxaw_Ufz2S8Kg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log("1. Creating order...");
  const { data: newOrder, error: insertError } = await supabase
    .from('online_orders')
    .insert([
      {
        customer_name: "Test User",
        customer_email: "test@example.com",
        customer_phone: "1234567890",
        garment_type: "Test",
        fabric_choice: "Test",
        measurements: { test: "1" },
        reference_images: [],
        status: 'pending',
      }
    ])
    .select()
    .single();

  if (insertError) {
    console.error("Insert failed:", insertError);
    return;
  }
  
  console.log("Order created:", newOrder.id);
  
  console.log("2. Updating order...");
  const { data: updateData, error: updateError } = await supabase
    .from('online_orders')
    .update({ status: 'quoted', quote_price: 999 })
    .eq('id', newOrder.id)
    .select();

  if (updateError) {
    console.error("Update failed with error:", updateError);
  } else if (updateData.length === 0) {
    console.error("Update failed! 0 rows affected (Likely RLS blocking the UPDATE)");
  } else {
    console.log("Update SUCCESS:", updateData[0]);
  }
}

runTest();
