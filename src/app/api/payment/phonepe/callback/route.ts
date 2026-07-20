import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendPaymentConfirmedAdminAlert, sendPaymentReceiptCustomer } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body || !body.response) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // PhonePe UAT Test Keys (Replace with Prod keys from env vars later)
    const SALT_KEY = process.env.PHONEPE_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076';
    const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

    // 1. Verify the Checksum (X-VERIFY header)
    const receivedChecksum = request.headers.get('x-verify');
    if (!receivedChecksum) {
      return NextResponse.json({ error: "Missing checksum" }, { status: 400 });
    }

    const base64Response = body.response;
    const stringToHash = base64Response + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const calculatedChecksum = sha256 + '###' + SALT_INDEX;

    if (receivedChecksum !== calculatedChecksum) {
      console.error("Invalid checksum in callback!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Decode the response
    const decodedPayload = JSON.parse(Buffer.from(base64Response, 'base64').toString('utf8'));
    
    // merchantTransactionId looks like: {22-char-base64uuid}{timestamp}
    const merchantTransactionId = decodedPayload.data.merchantTransactionId;
    const base64uuid = merchantTransactionId.substring(0, 22);
    const decodedHex = Buffer.from(base64uuid, 'base64url').toString('hex');
    const order_id = [
      decodedHex.slice(0, 8),
      decodedHex.slice(8, 12),
      decodedHex.slice(12, 16),
      decodedHex.slice(16, 20),
      decodedHex.slice(20, 32)
    ].join('-');

    if (decodedPayload.code === 'PAYMENT_SUCCESS') {
      // 3. Payment succeeded! Update the database
      const { data: updatedOrder, error } = await supabase
        .from('online_orders')
        .update({ 
          status: 'paid',
          utr_number: decodedPayload.data.transactionId // Store the PhonePe Bank Transaction ID
        })
        .eq('id', order_id)
        .select()
        .single();

      if (error) {
        console.error("Error updating order in callback:", error);
      } else if (updatedOrder) {
        // Trigger emails and await them
        try {
          await Promise.all([
            sendPaymentConfirmedAdminAlert(
              updatedOrder.customer_name, 
              "PhonePe Gateway", 
              `PhonePe TXN ID: ${decodedPayload.data.transactionId}`
            ),
            sendPaymentReceiptCustomer(
              updatedOrder.customer_email, 
              updatedOrder.customer_name, 
              "PhonePe Gateway"
            )
          ]);
        } catch (err) {
          console.error("Email send failed in callback:", err);
        }
      }
    }

    // Return 200 OK so PhonePe knows we received it
    return NextResponse.json({ success: true });
    
  } catch (err) {
    console.error("Callback API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
