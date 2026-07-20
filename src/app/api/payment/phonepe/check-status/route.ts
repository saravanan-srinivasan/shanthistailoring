import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendPaymentConfirmedAdminAlert, sendPaymentReceiptCustomer } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get('id');

    if (!order_id) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // First check our database directly to see if the webhook already handled it
    const { data: order, error } = await supabase
      .from('online_orders')
      .select('status')
      .eq('id', order_id)
      .single();

    if (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If already paid, just redirect
    if (order.status === 'paid') {
      return NextResponse.redirect(new URL(`/checkout/${order_id}?status=success`, request.url));
    }

    // If it's not 'paid' yet, we could theoretically do a status check API call to PhonePe here.
    // For simplicity, we'll just redirect to the checkout page and let it poll or wait.
    // The server-to-server webhook is extremely reliable and usually processes instantly.
    
    // Redirect back to checkout
    return NextResponse.redirect(new URL(`/checkout/${order_id}`, request.url));

  } catch (err) {
    console.error("Check status API error:", err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
