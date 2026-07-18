import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mobile = searchParams.get('mobile')

  if (!mobile) {
    return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 })
  }

  // Find the latest appointment matching this mobile number
  const { data, error } = await supabase
    .from('appointments')
    .select('id, first_name, last_name, service_type, date, status, created_at')
    .eq('phone', mobile)
    .neq('service_type', 'Contact Message')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error || !data || data.length === 0) {
    // Fallback: Check online_orders
    const { data: onlineData, error: onlineError } = await supabase
      .from('online_orders')
      .select('id, customer_name, garment_type, status, created_at')
      .eq('customer_phone', mobile)
      .order('created_at', { ascending: false })
      .limit(1)

    if (onlineError || !onlineData || onlineData.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Format online order to look like an appointment for the frontend
    const order = onlineData[0];
    const nameParts = order.customer_name ? order.customer_name.split(' ') : [''];
    
    return NextResponse.json({
      id: order.id,
      first_name: nameParts[0] || 'Customer',
      last_name: nameParts.slice(1).join(' ') || '',
      service_type: order.garment_type,
      date: new Date(order.created_at).toLocaleDateString(),
      status: order.status,
      created_at: order.created_at,
      is_online: true
    })
  }

  return NextResponse.json(data[0])
}
