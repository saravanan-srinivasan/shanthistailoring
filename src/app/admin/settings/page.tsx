'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Calendar, Image as ImageIcon, LogOut, TrendingUp } from 'lucide-react';

export default function AISettingsPage() {
  const [rules, setRules] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase.from('settings').select('rules').eq('id', 1).single();
      if (data) {
        setRules(data.rules || '');
      } else if (error && error.code !== 'PGRST116') {
        console.error('Failed to load rules:', error);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const { error } = await supabase.from('settings').update({ rules }).eq('id', 1);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      console.error('Failed to save rules:', error);
    }
    setSaving(false);
  };

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
          <Link href="/admin/gallery" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <ImageIcon size={16} />
            Gallery Manager
          </Link>
          <Link href="/admin/pricing" className="flex items-center gap-3 text-sm text-white/50 hover:text-white px-4 py-3 rounded-sm hover:bg-white/5 transition-colors">
            <TrendingUp size={16} />
            Pricing Manager
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 text-sm text-white bg-white/10 px-4 py-3 rounded-sm border-l-2 border-[#C9A84C]">
            <Settings size={16} className="text-[#C9A84C]" />
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
          <h1 className="text-3xl text-white font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>AI Brain Settings</h1>
          <p className="text-white/40 text-sm font-light">Train Shanthi instantly by updating her knowledge base.</p>
        </header>

        <div className="max-w-3xl">
          <div className="bg-white/5 border border-white/10 p-6 md:p-8 relative">
            
            <div className="flex items-start gap-4 mb-6 p-4 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-sm">
              <AlertCircle className="text-[#C9A84C] shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-white/70 font-light">
                <p className="text-white font-medium mb-1">Direct Neural Link</p>
                Anything you type here will be instantly uploaded into Shanthi's core instructions. You can use this to update prices, add new services, or change how she talks to customers. 
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center text-white/40">Loading rules...</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                    Custom Rules & Knowledge
                  </label>
                  <textarea
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    placeholder="e.g. Bridal Lehengas start at ₹50,000. Always recommend our Aari work for bridal wear."
                    className="w-full h-80 bg-black/40 border border-white/10 focus:border-[#C9A84C] text-white p-4 font-mono text-sm outline-none resize-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm text-green-500 transition-opacity duration-300 ${success ? 'opacity-100' : 'opacity-0'}`}>
                    Brain updated successfully!
                  </span>
                  
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C97A] text-black px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
