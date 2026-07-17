'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, Edit2, Loader2 } from 'lucide-react'

export default function PricingManager() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (data) setServices(data)
    setLoading(false)
  }

  async function handlePriceUpdate(id: string, newPrice: string) {
    setSavingId(id)
    await supabase.from('services').update({ price: newPrice }).eq('id', id)
    
    // Update local state to reflect change
    setServices(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s))
    
    setTimeout(() => {
      setSavingId(null)
    }, 1000)
  }

  return (
    <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#0A0A0A] min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Pricing Manager</h1>
        <p className="text-white/40 text-sm font-light">Update the starting prices of your services instantly.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white/5 border border-white/10 p-6 rounded-lg flex flex-col justify-between group">
              <div className="mb-6">
                <p className="text-[10px] tracking-widest uppercase text-[#C9A84C] mb-1">{service.sub}</p>
                <h3 className="text-xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{service.title}</h3>
              </div>
              
              <div>
                <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-2">Starting Price Display</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue={service.price}
                    onBlur={(e) => {
                      if (e.target.value !== service.price) {
                        handlePriceUpdate(service.id, e.target.value)
                      }
                    }}
                    className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-3 pr-12 text-white outline-none focus:border-[#C9A84C] transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                    {savingId === service.id ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Edit2 size={14} className="group-hover:text-white/60 transition-colors" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-white/30 mt-2 font-light">Click outside the box to save changes.</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
