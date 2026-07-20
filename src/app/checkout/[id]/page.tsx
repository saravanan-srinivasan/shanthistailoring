import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('online_orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-2xl text-red-500 mb-4">Database Error</h1>
          <p>{error.message}</p>
          <p className="text-xs text-white/50 mt-4">ID: {id}</p>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-2xl text-red-500 mb-4">Order Not Found</h1>
          <p>Could not find order with ID: {id}</p>
        </div>
      </main>
    )
  }

  if (order.status === 'pending') {
    return (
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-2xl text-yellow-500 mb-4">Order Still Pending</h1>
          <p>The database says this order's status is still pending.</p>
          <p className="text-xs text-white/50 mt-4">This means the API update failed or caching is still active.</p>
        </div>
      </main>
    )
  }

  // The UPI Intent Link
  const upiId = "s4shanthi1985-1@okaxis"
  const upiName = "Shanthi S"
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${order.quote_price}&cu=INR&tn=Tailoring%20Order&tr=${order.id}&mc=5399`

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 flex items-center justify-center">
      <div className="max-w-xl w-full px-6">
        
        <div className="bg-white/5 border border-white/10 p-8 md:p-12 text-center">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-4">Secure Checkout</p>
          <h1 className="text-3xl md:text-4xl text-white font-light mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Order Confirmation
          </h1>
          
          <div className="bg-[#1A1A1A] p-6 mb-8 border border-white/5 text-left">
            <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span className="text-white/80">Garment</span>
              <span className="text-white">{order.garment_type}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/80">Customer</span>
              <span className="text-white">{order.customer_name}</span>
            </div>
            <div className="flex justify-between pt-4 mt-4 border-t border-white/10">
              <span className="text-[#C9A84C] uppercase tracking-widest text-sm">Total Due</span>
              <span className="text-white text-xl font-medium">₹{order.quote_price}</span>
            </div>
          </div>

          {order.status === 'paid' ? (
            <div className="bg-green-500/10 border border-green-500/20 p-6">
              <h2 className="text-green-400 text-xl font-medium mb-2">Payment Received</h2>
              <p className="text-green-400/80 text-sm">Your order is now in production! We will contact you once it is ready to ship.</p>
            </div>
          ) : order.status === 'cod' ? (
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 p-6">
              <h2 className="text-[#C9A84C] text-xl font-medium mb-2">Pay on Delivery Confirmed</h2>
              <p className="text-[#C9A84C]/80 text-sm">Your order is now in production! Please keep cash or UPI ready at the time of delivery.</p>
            </div>
          ) : order.status === 'ready' ? (
            <div className="bg-blue-500/10 border border-blue-500/20 p-6">
              <h2 className="text-blue-400 text-xl font-medium mb-2">Ready for Pickup / Delivery</h2>
              <p className="text-blue-400/80 text-sm">Your masterpiece is finished! Please visit the atelier to collect it, or wait for delivery.</p>
            </div>
          ) : order.status === 'delivered' ? (
            <div className="bg-white/10 border border-white/20 p-6">
              <h2 className="text-white/80 text-xl font-medium mb-2">Order Delivered</h2>
              <p className="text-white/50 text-sm">This order has been completed and delivered.</p>
            </div>
          ) : order.status === 'rejected' ? (
            <div className="bg-red-500/10 border border-red-500/20 p-6">
              <h2 className="text-red-400 text-xl font-medium mb-2">Order Cancelled</h2>
              <p className="text-red-400/80 text-sm">We are unable to fulfill this design request at this time. Please contact us for more information.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="pt-2">
                <p className="text-white/80 text-sm mb-6">Secure Online Payment (0% UPI Fees)</p>
                <form action="/api/payment/phonepe/initiate" method="POST">
                  <input type="hidden" name="order_id" value={order.id} />
                  <button type="submit" className="w-full bg-[#C9A84C] text-black py-4 px-6 uppercase tracking-widest text-sm font-medium hover:bg-[#D4B661] transition-colors">
                    Pay via UPI
                  </button>
                </form>
                <p className="text-white/40 text-xs mt-4">You will be redirected to a secure payment gateway to complete your transaction.</p>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </main>
  )
}
