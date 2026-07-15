'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function StatusUpdater({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setStatus(newStatus)
    setLoading(true)
    
    // Update the database
    await supabase.from('appointments').update({ status: newStatus }).eq('id', id)
    
    setLoading(false)
    
    // Refresh the server component to pull fresh data
    router.refresh()
  }

  const getColors = (s: string) => {
    switch (s) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Fabric Sourced': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Cutting': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Aari Embroidery': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Stitching': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Quality Check': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'Ready for Trial': return 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20';
      case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-white/10 text-white/50 border-white/20';
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`text-[10px] uppercase tracking-widest px-2 py-1 outline-none cursor-pointer border transition-colors ${getColors(status)} ${loading ? 'opacity-50' : ''}`}
    >
      <option value="Pending" className="bg-[#0A0A0A] text-yellow-500">PENDING</option>
      <option value="Fabric Sourced" className="bg-[#0A0A0A] text-purple-400">FABRIC SOURCED</option>
      <option value="Cutting" className="bg-[#0A0A0A] text-orange-400">CUTTING</option>
      <option value="Aari Embroidery" className="bg-[#0A0A0A] text-pink-400">AARI EMBROIDERY</option>
      <option value="Stitching" className="bg-[#0A0A0A] text-indigo-400">STITCHING</option>
      <option value="Quality Check" className="bg-[#0A0A0A] text-teal-400">QUALITY CHECK</option>
      <option value="Ready for Trial" className="bg-[#0A0A0A] text-[#C9A84C]">READY FOR TRIAL</option>
      <option value="Completed" className="bg-[#0A0A0A] text-green-500">COMPLETED</option>
      <option value="Cancelled" className="bg-[#0A0A0A] text-red-500">CANCELLED</option>
    </select>
  )
}
