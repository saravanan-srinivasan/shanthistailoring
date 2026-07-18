import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('online_orders')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-2xl text-red-500 mb-4">Database Error</h1>
          <p>{error.message}</p>
          <p className="text-xs text-white/50 mt-4">ID: {params.id}</p>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-2xl text-red-500 mb-4">Order Not Found</h1>
          <p>Could not find order with ID: {params.id}</p>
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
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${order.quote_price}&cu=INR`

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
          ) : (
            <div className="space-y-6">
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Pay securely with 0% transaction fees via UPI. Tap the button below on your mobile device to open GPay, PhonePe, or Paytm automatically.
              </p>
              
              <a 
                href={upiLink}
                className="block w-full bg-[#C9A84C] text-black py-4 px-6 uppercase tracking-widest text-sm font-medium hover:bg-[#E8C97A] transition-colors"
              >
                Pay ₹{order.quote_price} via UPI
              </a>

              <div className="pt-6">
                <p className="text-white/40 text-xs mb-3">If paying from a laptop, scan the QR code in your UPI app, then click below.</p>
                <form action="/api/quote/paid" method="POST">
                  <input type="hidden" name="order_id" value={order.id} />
                  <button type="submit" className="border border-white/20 text-white w-full py-3 text-xs uppercase tracking-widest hover:bg-white/5 transition-colors">
                    I have completed the payment
                  </button>
                </form>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </main>
  )
}
