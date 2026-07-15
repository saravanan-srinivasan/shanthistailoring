"use client";

import { useState, useEffect } from 'react';
import { LogOut, Calendar, Image as ImageIcon, MessageSquare, Settings, Star, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: ""
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ name: "", role: "", quote: "" });
        fetchTestimonials();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await fetch('/api/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchTestimonials();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
          <Link href="/admin/messages" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <MessageSquare size={16} /> Messages
          </Link>
          <Link href="/admin/testimonials" className="flex items-center gap-3 text-sm text-white bg-white/10 px-4 py-3 rounded-sm border-l-2 border-[#C9A84C]">
            <Star size={16} className="text-[#C9A84C]" /> Testimonials
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <ImageIcon size={16} /> Gallery Manager
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <Settings size={16} /> AI Brain Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Client Stories</h1>
            <p className="text-white/40 text-sm font-light">Manage the testimonials shown on the homepage.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 p-6 sticky top-6">
              <h3 className="text-lg text-white font-medium mb-4 flex items-center gap-2">
                <Plus size={16} className="text-[#C9A84C]" /> Add New
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-1">Client Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]" placeholder="Priya Sharma" />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-1">Role / Subtitle</label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]" placeholder="Bridal Client · 2024" />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-1">The Review</label>
                  <textarea required rows={4} value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C] resize-none" placeholder="The precision of the Aari work..." />
                </div>
                <button type="submit" disabled={adding} className="w-full bg-[#C9A84C] text-black py-2 text-sm uppercase tracking-widest font-medium hover:bg-[#E8C97A] transition-colors">
                  {adding ? 'Publishing...' : 'Publish Testimonial'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <p className="text-white/40">Loading testimonials...</p>
            ) : testimonials.length === 0 ? (
              <div className="p-12 text-center border border-white/10 border-dashed">
                <p className="text-white/40">No live testimonials yet.</p>
              </div>
            ) : (
              testimonials.map((t) => (
                <div key={t.id} className="bg-white/5 border border-white/10 p-6 flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)", fontFamily: "'Cormorant Garamond', serif" }}>
                    {t.initial}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-medium text-lg">{t.name}</h4>
                        <p className="text-[#C9A84C] text-[10px] uppercase tracking-widest">{t.role}</p>
                      </div>
                      <button onClick={() => handleDelete(t.id)} className="text-white/20 hover:text-red-400 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-white/60 text-sm font-light italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
