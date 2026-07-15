import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, first_name, last_name, notes, status, created_at')
      .eq('service_type', 'Gallery Item')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const gallery = data.map((item) => {
        // Parse the JSON payload from notes
        let payload = { src: "", size: "normal" };
        try {
          payload = JSON.parse(item.notes || '{}');
        } catch(e) {}

        return {
          id: item.id,
          label: item.first_name,
          cat: item.last_name,
          src: payload.src,
          size: payload.size
        };
      });
      return NextResponse.json(gallery);
    }
  } catch (error) {
    console.error('Error fetching gallery from DB:', error);
  }

  // Fallback to static JSON if DB is empty or fails
  const filePath = path.join(process.cwd(), 'data', 'gallery.json');
  try {
    const staticData = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(staticData));
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const { label, cat, src, size } = await request.json();
    const payload = JSON.stringify({ src, size });
    
    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          service_type: 'Gallery Item',
          first_name: label,
          last_name: cat,
          notes: payload,
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
