import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { sendPaymentConfirmedAdminAlert, sendPaymentReceiptCustomer } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const order_id = formData.get('order_id');

    if (!order_id) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Update order status to cod
    const { data: updatedOrder, error } = await supabase
      .from('online_orders')
      .update({ status: 'cod' })
      .eq('id', order_id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
    } else if (updatedOrder) {
      // Trigger emails in background
      Promise.all([
        sendPaymentConfirmedAdminAlert(updatedOrder.customer_name, "Cash on Delivery", "No UTR - Payment due at pickup/delivery"),
        sendPaymentReceiptCustomer(updatedOrder.customer_email, updatedOrder.customer_name, "Cash on Delivery")
      ]).catch(err => console.error("Email send failed:", err));
    }

    // Redirect back to checkout page
    return NextResponse.redirect(new URL(`/checkout/${order_id}`, request.url));
  } catch (err) {
    console.error("COD API error:", err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
