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
    const utr_number = formData.get('utr_number');

    if (!order_id) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Update order status to paid
    const updateData: any = { status: 'paid' };
    if (utr_number) updateData.utr_number = utr_number;

    const { data: updatedOrder, error } = await supabase
      .from('online_orders')
      .update(updateData)
      .eq('id', order_id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
    } else if (updatedOrder) {
      // Trigger emails and await them
      try {
        await Promise.all([
          sendPaymentConfirmedAdminAlert(updatedOrder.customer_name, "Online UPI", `UTR: ${utr_number || "Not provided"}`),
          sendPaymentReceiptCustomer(updatedOrder.customer_email, updatedOrder.customer_name, "Online UPI")
        ]);
      } catch (err) {
        console.error("Email send failed:", err);
      }
    }

    // Redirect back to checkout page to show success message
    return NextResponse.redirect(new URL(`/checkout/${order_id}`, request.url));
  } catch (err) {
    console.error("Paid API error:", err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
