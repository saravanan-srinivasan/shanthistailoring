import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const order_id = formData.get('order_id') as string;

    if (!order_id) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 1. Fetch order details to get amount and customer info
    const { data: order, error } = await supabase
      .from('online_orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (error || !order) {
      console.error("Order not found:", error);
      return NextResponse.redirect(new URL('/', request.url));
    }

    // PhonePe UAT Test Keys (Replace with Prod keys from env vars later)
    const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
    const SALT_KEY = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
    
    // Determine the environment API URL
    const isProd = process.env.PHONEPE_ENV === 'PROD';
    const PHONEPE_API_URL = isProd 
      ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    // Base URL of our website for the callback and redirect
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

    // 2. Construct the Payload
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: `TXN_${order_id}_${Date.now()}`,
      merchantUserId: `MUID_${order_id}`,
      amount: Math.round(Number(order.quote_price) * 100), // PhonePe expects amount in paise (multiply by 100)
      redirectUrl: `${baseUrl}/api/payment/phonepe/check-status?id=${order_id}`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${baseUrl}/api/payment/phonepe/callback`,
      mobileNumber: order.customer_phone || '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // 3. Base64 encode the payload
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // 4. Calculate X-VERIFY Checksum: SHA256(Base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
    const stringToHash = base64Payload + '/pg/v1/pay' + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = sha256 + '###' + SALT_INDEX;

    // 5. Send Request to PhonePe
    const response = await fetch(PHONEPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const result = await response.json();

    if (result.success && result.data && result.data.instrumentResponse && result.data.instrumentResponse.redirectInfo) {
      const redirectUrl = result.data.instrumentResponse.redirectInfo.url;
      // Redirect user to the PhonePe checkout page
      return NextResponse.redirect(redirectUrl, 302);
    } else {
      console.error("PhonePe Error:", result);
      return NextResponse.redirect(new URL(`/checkout/${order_id}?error=payment_initiation_failed`, request.url));
    }

  } catch (err) {
    console.error("Payment Initiate API error:", err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
