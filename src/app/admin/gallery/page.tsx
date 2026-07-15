"use client";

import { useState, useEffect } from 'react';
import { LogOut, Calendar, Image as ImageIcon, MessageSquare, Settings, Star, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminGallery() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    label: "",
    cat: "Bridal",
    src: "",
    size: "normal"
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setGallery(data);
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
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ label: "", cat: "Bridal", src: "", size: "normal" });
        fetchGallery();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      alert("This is a static placeholder image from the fallback file. You can't delete it here. Add a real image to override the placeholders!");
      return;
    }
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchGallery();
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
          <Link href="/admin/testimonials" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <Star size={16} /> Testimonials
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 text-sm text-white bg-white/10 px-4 py-3 rounded-sm border-l-2 border-[#C9A84C]">
            <ImageIcon size={16} className="text-[#C9A84C]" /> Gallery Manager
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
            <h1 className="text-3xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Gallery Manager</h1>
            <p className="text-white/40 text-sm font-light">Upload and manage images shown in the Collections gallery.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 p-6 sticky top-6">
              <h3 className="text-lg text-white font-medium mb-4 flex items-center gap-2">
                <Plus size={16} className="text-[#C9A84C]" /> Add Image
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-1">Image URL</label>
                  <input required value={formData.src} onChange={e => setFormData({...formData, src: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]" placeholder="/images/my-photo.jpg" />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-1">Title / Label</label>
                  <input required value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]" placeholder="Red Bridal Lehenga" />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-1">Category</label>
                  <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]">
                    <option value="Bridal">Bridal</option>
                    <option value="Blouses">Blouses</option>
                    <option value="Aari Work">Aari Work</option>
                    <option value="Suits">Suits</option>
                    <option value="Kids Wear">Kids Wear</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-1">Display Size</label>
                  <select value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]">
                    <option value="normal">Normal (Square)</option>
                    <option value="tall">Tall (Portrait)</option>
                  </select>
                </div>
                <button type="submit" disabled={adding} className="w-full bg-[#C9A84C] text-black py-2 text-sm uppercase tracking-widest font-medium hover:bg-[#E8C97A] transition-colors mt-4">
                  {adding ? 'Adding...' : 'Publish Image'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <p className="text-white/40">Loading gallery...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((img, i) => (
                  <div key={img.id || i} className="group relative aspect-square bg-[#1A1A1A] border border-white/10 overflow-hidden">
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-white font-medium mb-1">{img.label}</p>
                      <p className="text-[#C9A84C] text-[10px] uppercase tracking-widest mb-4">{img.cat}</p>
                      <button onClick={() => handleDelete(img.id)} className="bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
