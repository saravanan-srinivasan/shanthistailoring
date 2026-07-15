'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Trash2 } from 'lucide-react'

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this permanently?")) return;
    
    setLoading(true)
    
    // Delete from database
    await supabase.from('appointments').delete().eq('id', id)
    
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-sm transition-colors ${loading ? 'opacity-50' : ''}`}
      title="Delete Record"
    >
      <Trash2 size={16} />
    </button>
  )
}
