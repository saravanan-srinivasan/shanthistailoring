import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const order_id = formData.get('order_id');

    if (!order_id) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Update order status to paid
    const { error } = await supabase
      .from('online_orders')
      .update({ status: 'paid' })
      .eq('id', order_id);

    if (error) {
      console.error("Update error:", error);
    }

    // Redirect back to checkout page to show success message
    return NextResponse.redirect(new URL(`/checkout/${order_id}`, request.url));
  } catch (err) {
    console.error("Paid API error:", err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
