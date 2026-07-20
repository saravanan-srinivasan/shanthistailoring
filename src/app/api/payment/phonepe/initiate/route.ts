import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order_id = body.order_id;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    // 1. Fetch order details to get amount and customer info
    const { data: order, error } = await supabase
      .from('online_orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (error || !order) {
      console.error("Order not found:", error);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // PhonePe UAT Test Keys (Replace with Prod keys from env vars later)
    const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT86';
    const SALT_KEY = process.env.PHONEPE_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076';
    const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
    
    // Determine the environment API URL
    const isProd = process.env.PHONEPE_ENV === 'PROD';
    const PHONEPE_API_URL = isProd 
      ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    // Base URL of our website for the callback and redirect
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

    // Compress UUID to 22 characters base64url to fit PhonePe's 34 character limit
    const hexId = order_id.replace(/-/g, '');
    const base64uuid = Buffer.from(hexId, 'hex').toString('base64url');

    // 2. Construct the Payload
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: `${base64uuid}${Date.now().toString(36)}`,
      merchantUserId: base64uuid,
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
      // Return URL for the client component to redirect
      return NextResponse.json({ url: redirectUrl });
    } else {
      console.error("PhonePe Error:", result);
      return NextResponse.json({ error: "Payment initiation failed" }, { status: 400 });
    }

  } catch (err) {
    console.error("Payment Initiate API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
