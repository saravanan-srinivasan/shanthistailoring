import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendQuoteEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, quote_price } = body;

    if (!order_id || !quote_price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch order details to get customer email and name
    const { data: order, error: fetchError } = await supabase
      .from('online_orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Update order status to quoted
    const { error: updateError } = await supabase
      .from('online_orders')
      .update({ status: 'quoted', quote_price: parseFloat(quote_price) })
      .eq('id', order_id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    // 3. Send email to customer
    if (order.customer_email) {
      await sendQuoteEmail(order.customer_email, order.customer_name, parseFloat(quote_price), order_id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
