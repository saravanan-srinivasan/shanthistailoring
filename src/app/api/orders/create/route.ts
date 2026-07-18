import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOnlineOrderAdminAlert, sendOnlineOrderCustomerConfirmation } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Use Service Role Key for secure background creation
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Insert into database
    const { data, error } = await supabase.from('online_orders').insert([
      {
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        garment_type: body.garment_type,
        fabric_choice: body.fabric_choice,
        measurements: body.measurements,
        reference_images: body.reference_images,
        status: 'pending',
      }
    ]).select().single();

    if (error || !data) {
      console.error("Error submitting order:", error);
      return NextResponse.json({ error: error?.message || "Failed to create order" }, { status: 500 });
    }

    // Trigger emails and await them so Vercel serverless doesn't kill the process early
    try {
      await Promise.all([
        sendOnlineOrderAdminAlert(body.customer_name, body.garment_type, body.customer_email),
        sendOnlineOrderCustomerConfirmation(body.customer_email, body.customer_name, body.garment_type)
      ]);
    } catch (err) {
      console.error("Email send failed:", err);
      // We still return success since the order was created
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error("Order create API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
