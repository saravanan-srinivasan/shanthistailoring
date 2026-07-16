import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, Calendar, Clock, User, Phone, Settings, Image as ImageIcon, TrendingUp, Users, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import StatusUpdater from './StatusUpdater'
import DeleteButton from './DeleteButton'

export const revalidate = 0 // Disable caching for the admin dashboard

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Fetch appointments directly (using the pre-existing schema)
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .neq('service_type', 'Contact Message')
    .neq('service_type', 'Gallery Item')
    .order('created_at', { ascending: false })

  // Helper to correctly format phone number for WhatsApp
  const getWhatsAppLink = (phone: string | null) => {
    if (!phone) return '#';
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    // If it's a 10-digit number, assume it's Indian and prepend '91'
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
          <Link href="/admin" className="flex items-center gap-3 text-sm text-white bg-white/10 px-4 py-3 rounded-sm border-l-2 border-[#C9A84C]">
            <Calendar size={16} className="text-[#C9A84C]" />
            Appointments
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <MessageSquare size={16} />
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
        <header className="mb-10">
          <h1 className="text-3xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Appointments</h1>
          <p className="text-white/40 text-sm font-light">Manage your upcoming bespoke consultations.</p>
        </header>

        {error ? (
          <div className="p-4 bg-red-900/20 border border-red-500/20 text-red-200 text-sm">
            Error loading appointments: {error.message}
          </div>
        ) : (
          <>
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white/5 border border-white/10 p-6 flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Total Appointments</p>
                  <h3 className="text-4xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {appointments?.length || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20">
                  <Users size={20} className="text-[#C9A84C]" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Conversion Rate</p>
                  <h3 className="text-4xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {(() => {
                      if (!appointments || appointments.length === 0) return '0%';
                      const success = appointments.filter(a => {
                        const s = (a.status || '').toLowerCase();
                        return s === 'completed' || s === 'in progress';
                      }).length;
                      return Math.round((success / appointments.length) * 100) + '%';
                    })()}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <TrendingUp size={20} className="text-green-500" />
                </div>
              </div>
            </div>

            <h2 className="text-xl text-white font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recent Bookings</h2>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {appointments?.map((appt) => (
              <div key={appt.id} className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg text-white font-medium mb-1">
                        {appt.first_name || ''} {appt.last_name || ''}
                      </h3>
                      <p className="text-xs text-[#C9A84C] tracking-widest uppercase">{appt.service_type || 'Bespoke Tailoring'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusUpdater id={appt.id} currentStatus={appt.status || 'pending'} />
                      <DeleteButton id={appt.id} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-sm text-white/70 font-light">
                      <Clock size={14} className="text-white/40" />
                      {appt.date} at {appt.time}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/70 font-light">
                      <Phone size={14} className="text-white/40" />
                      {appt.phone || 'No phone'}
                    </div>
                  </div>

                  {appt.notes && (
                    <div className="mb-6 p-3 bg-black/30 border border-white/5">
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Notes</p>
                      <p className="text-sm text-white/70 font-light">{appt.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <a href={getWhatsAppLink(appt.phone)} target="_blank" rel="noreferrer" className="w-full text-center py-2 text-xs uppercase tracking-widest font-medium bg-[#C9A84C] text-black hover:bg-[#E8C97A] transition-colors">
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            ))}
            
            {(!appointments || appointments.length === 0) && (
              <div className="col-span-full py-12 text-center border border-white/10 border-dashed">
                <p className="text-white/40 font-light">No appointments found.</p>
              </div>
            )}
          </div>
          </>
        )}
      </main>
    </div>
  )
}
