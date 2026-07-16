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
      case 'In Progress': return 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20';
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
      <option value="In Progress" className="bg-[#0A0A0A] text-[#C9A84C]">IN PROGRESS</option>
      <option value="Completed" className="bg-[#0A0A0A] text-green-500">COMPLETED</option>
      <option value="Cancelled" className="bg-[#0A0A0A] text-red-500">CANCELLED</option>
    </select>
  )
}
