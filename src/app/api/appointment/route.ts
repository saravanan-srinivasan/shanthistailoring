import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, date, time, service_type, notes } = body;

    // 1. Insert into Supabase
    const { error } = await supabase.from("appointments").insert([
      {
        first_name,
        last_name,
        email,
        phone,
        date,
        time,
        service_type,
        notes: notes || null,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save appointment" }, { status: 500 });
    }

    // 2. Send the confirmation email and admin alert
    const fullName = last_name ? `${first_name} ${last_name}` : first_name;
    
    if (email) {
      await sendConfirmationEmail(email, fullName, date, time);
    }
    
    // Send admin notification
    await sendAdminNotification('newmsshravan2004@gmail.com', fullName, date, time, phone || 'N/A', email || 'N/A');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
