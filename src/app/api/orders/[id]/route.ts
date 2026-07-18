import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderRejectedEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 1. Fetch order to get reference images
    const { data: order, error: fetchError } = await supabase
      .from('online_orders')
      .select('reference_images')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching order for deletion:", fetchError);
      return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }

    // 2. Delete images from storage if they exist
    if (order && order.reference_images && order.reference_images.length > 0) {
      const filesToDelete = order.reference_images.map((url: string) => {
        // Extract filename from the URL
        const parts = url.split('/');
        return parts[parts.length - 1];
      });

      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase
          .storage
          .from('order_references')
          .remove(filesToDelete);
        
        if (storageError) console.error("Error deleting images:", storageError);
      }
    }

    // 3. Delete the order record
    const { error: deleteError } = await supabase
      .from('online_orders')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error("Error deleting order record:", deleteError);
      return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status } = body;

    if (!status) return NextResponse.json({ error: "Status is required" }, { status: 400 });

    const { data: updatedOrder, error } = await supabase
      .from('online_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating order status:", error);
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }

    // Send rejection email if status is rejected
    if (status === 'rejected' && updatedOrder) {
      try {
        await sendOrderRejectedEmail(updatedOrder.customer_email, updatedOrder.customer_name);
      } catch (err) {
        console.error("Email send failed:", err);
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Patch API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
