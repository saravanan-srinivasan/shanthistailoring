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
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(data[0])
}
