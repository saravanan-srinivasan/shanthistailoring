import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, first_name, last_name, notes, status, created_at')
      .eq('service_type', 'Testimonial')
      .eq('status', 'published') // Only fetch published ones
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json([]);
    }

    // Map database fields back to testimonial format
    const testimonials = data.map((t) => ({
      id: t.id,
      name: t.first_name,
      role: t.last_name, // Reusing last_name for role
      quote: t.notes,    // Reusing notes for the quote text
      rating: 5,         // Hardcoded to 5 stars for now
      initial: t.first_name ? t.first_name.charAt(0).toUpperCase() : 'C',
    }));

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const { name, role, quote } = await request.json();
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          service_type: 'Testimonial',
          first_name: name,
          last_name: role,
          notes: quote,
          status: 'published',
          phone: '',
          email: '',
          date: new Date().toISOString().split('T')[0],
          time: '12:00'
        }
      ]);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  try {
    const { id } = await request.json();
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

