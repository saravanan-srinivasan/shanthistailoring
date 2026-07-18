'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, Edit2, Loader2, Calendar, Image as ImageIcon, LogOut, Settings, TrendingUp, Package } from 'lucide-react'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const { data } = await supabase
      .from('online_orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/5 border-r border-white/10 flex flex-col p-6">
        <div className="mb-12">
          <h2 className="text-xl text-white font-light tracking-widest uppercase mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Atelier</h2>
          <p className="text-[10px] text-[#C9A84C] tracking-[0.2em] uppercase">Admin Portal</p>
        </div>
        
        <nav className="flex-1 space-y-4">
          <Link href="/admin" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <Calendar size={16} /> Appointments
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 text-sm text-white bg-white/10 px-4 py-3 rounded-sm border-l-2 border-[#C9A84C]">
            <Package size={16} className="text-[#C9A84C]" /> Remote Orders
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <ImageIcon size={16} /> Gallery Manager
          </Link>
          <Link href="/admin/pricing" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <TrendingUp size={16} /> Pricing Manager
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <Settings size={16} /> AI Brain Settings
          </Link>
        </nav>
        
        <div className="pt-8 border-t border-white/10">
          <form action="/auth/logout" method="post">
            <button type="submit" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors w-full px-4 py-2">
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-2">Phase 1 Alpha</p>
          <h1 className="text-3xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Remote Orders</h1>
          <p className="text-white/40 text-sm font-light">Review custom garment requests from remote clients.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 border border-white/10 bg-white/5">
            <p className="text-white/40">No remote orders have been placed yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                  <div>
                    <h3 className="text-xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{order.customer_name}</h3>
                    <p className="text-[#C9A84C] text-sm">{order.garment_type}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] uppercase tracking-widest rounded-full border border-yellow-500/20">
                      {order.status}
                    </span>
                    <p className="text-white/40 text-xs mt-2">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Contact Info</h4>
                    <p className="text-white/80 text-sm mb-1">{order.customer_email}</p>
                    <p className="text-white/80 text-sm">{order.customer_phone}</p>
                    
                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4 mt-6">Fabric Details</h4>
                    <p className="text-white/80 text-sm">{order.fabric_choice}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Measurements</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.keys(order.measurements).map(key => (
                        <div key={key} className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-white/50 text-sm capitalize">{key}:</span>
                          <span className="text-white text-sm font-medium">{order.measurements[key]}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {order.reference_images && order.reference_images.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Reference Images</h4>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {order.reference_images.map((img: string, idx: number) => (
                        <div key={idx} className="relative min-w-[120px] h-[160px] bg-[#1A1A1A] border border-white/10 rounded-sm overflow-hidden">
                          <img src={img} alt="Reference" className="w-full h-full object-cover" />
                          <a href={img} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs uppercase tracking-widest border-b border-[#C9A84C] text-[#C9A84C] pb-0.5">View Full</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                  <button className="bg-[#C9A84C] text-black px-6 py-2 text-xs uppercase tracking-widest font-medium hover:bg-[#E8C97A] transition-colors">
                    Send Quote (Phase 2)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
