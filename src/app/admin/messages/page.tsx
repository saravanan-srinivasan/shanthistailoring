import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, Calendar, Clock, User, Phone, Settings, Image as ImageIcon, MessageSquare, Inbox, Mail } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from '../DeleteButton'

export const revalidate = 0

export default async function AdminMessages() {
  const supabase = await createClient()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Fetch only contact messages
  const { data: messages, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('service_type', 'Contact Message')
    .order('created_at', { ascending: false })

  const getWhatsAppLink = (phone: string | null) => {
    if (!phone) return '#';
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    return `https://wa.me/${cleanPhone}`;
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
            <Calendar size={16} />
            Appointments
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-3 text-sm text-white bg-white/10 px-4 py-3 rounded-sm border-l-2 border-[#C9A84C]">
            <MessageSquare size={16} className="text-[#C9A84C]" />
            Messages
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <ImageIcon size={16} />
            Gallery Manager
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <Settings size={16} />
            AI Brain Settings
          </Link>
        </nav>
        
        <div className="pt-8 border-t border-white/10">
          <form action="/auth/logout" method="post">
            <button type="submit" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors w-full px-4 py-2">
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20">
            <Inbox size={20} className="text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-3xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Inbox</h1>
            <p className="text-white/40 text-sm font-light">Customer inquiries from the website contact form.</p>
          </div>
        </header>

        {error ? (
          <div className="p-4 bg-red-900/20 border border-red-500/20 text-red-200 text-sm">
            Error loading messages: {error.message}
          </div>
        ) : (
          <div className="space-y-6">
            {messages?.map((msg) => (
              <div key={msg.id} className="bg-white/5 border border-white/10 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                  <div>
                    <h3 className="text-lg text-white font-medium mb-1">
                      {msg.first_name || 'Anonymous'}
                    </h3>
                    <p className="text-xs text-[#C9A84C] tracking-widest uppercase">{msg.last_name || 'No Subject'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-white/40 font-light">
                      <Clock size={12} />
                      {msg.date} at {msg.time}
                    </div>
                    <DeleteButton id={msg.id} />
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-white/80 font-light whitespace-pre-wrap leading-relaxed">
                    {msg.notes || 'No message content.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-sm text-white/50 bg-black/30 px-3 py-1.5 rounded-sm">
                    <Phone size={14} className="text-white/40" />
                    {msg.phone || 'No contact info provided'}
                  </div>
                  
                  {msg.phone && (
                    <a href={getWhatsAppLink(msg.phone)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black px-4 py-1.5 rounded-sm transition-colors ml-auto">
                      Reply on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {(!messages || messages.length === 0) && (
              <div className="py-20 text-center border border-white/10 border-dashed rounded-lg">
                <Mail size={32} className="text-white/20 mx-auto mb-4" />
                <h3 className="text-xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Inbox is empty</h3>
                <p className="text-white/40 font-light text-sm">You have not received any website messages yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
