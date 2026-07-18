"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, CheckCircle2, CircleDashed, CheckCircle } from "lucide-react";

const STAGES = [
  "Pending",
  "In Progress",
  "Completed"
];

export default function TrackOrderPage() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/track?mobile=${encodeURIComponent(mobile)}`);
      if (!res.ok) throw new Error("Order not found. Please check your mobile number.");
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === "confirmed" || s === "pending" || s === "quoted") return 0;
    if (s === "paid" || s === "cod" || s === "ready") return 1;
    if (s === "delivered") return 2;
    
    const index = STAGES.findIndex(stage => stage.toLowerCase() === s);
    return index === -1 ? 0 : index;
  };

  return (
    <main className="bg-[#0A0A0A] min-h-screen pt-32 pb-24" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-screen-md mx-auto px-6 md:px-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="section-label mb-5">Order Tracking</p>
          <h1
            className="text-4xl md:text-5xl text-white font-light leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Track your <span className="italic text-[#C9A84C]">masterpiece.</span>
          </h1>
          <p className="text-white/40 font-light text-sm max-w-sm mx-auto">
            Enter the mobile number used during your appointment booking to view live manufacturing updates.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleTrack} className="relative max-w-md mx-auto mb-16">
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter Mobile Number"
              required
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-16 text-white font-light focus:outline-none focus:border-[#C9A84C] transition-colors shadow-2xl shadow-black/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center text-black disabled:opacity-50 transition-colors"
            >
              {loading ? <span className="block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Search size={18} />}
            </button>
          </form>

          {error && (
            <div className="text-center text-red-400 text-sm font-light mb-10">{error}</div>
          )}
        </motion.div>

        {/* Timeline Result */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mb-2">Order Details</p>
                  <h3 className="text-2xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {order.first_name} {order.last_name}
                  </h3>
                  <p className="text-white/50 text-sm mt-1">{order.service_type}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-2">Current Status</p>
                  <p className="text-[#C9A84C] text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {order.status.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="relative pl-4 md:pl-8">
                {/* Vertical Line */}
                <div className="absolute left-[27px] md:left-[43px] top-4 bottom-8 w-px bg-white/10" />

                <div className="space-y-8">
                  {STAGES.map((stage, index) => {
                    const currentIndex = getStageIndex(order.status);
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isPending = index > currentIndex;

                    return (
                      <motion.div 
                        key={stage}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                        className={`relative flex items-center gap-6 ${isPending ? 'opacity-40' : 'opacity-100'}`}
                      >
                        <div className="relative z-10 w-6 h-6 flex items-center justify-center bg-[#0A0A0A]">
                          {isCompleted ? (
                            <CheckCircle2 size={24} className="text-[#C9A84C]" />
                          ) : isCurrent ? (
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-4 h-4 rounded-full bg-[#C9A84C] shadow-[0_0_15px_#C9A84C]"
                            />
                          ) : (
                            <CircleDashed size={24} className="text-white/20" />
                          )}
                        </div>
                        <div>
                          <p className={`text-base font-light tracking-wide ${isCurrent ? 'text-[#C9A84C]' : 'text-white'}`}>
                            {stage}
                          </p>
                          {isCurrent && (
                            <p className="text-[#C9A84C]/60 text-xs mt-1">In progress at our Atelier</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Special Note */}
              <div className="mt-16 bg-[#C9A84C]/5 border border-[#C9A84C]/20 p-6 rounded-xl flex gap-4 items-start">
                <MapPin className="text-[#C9A84C] shrink-0 mt-0.5" size={18} />
                <p className="text-white/60 text-sm font-light leading-relaxed">
                  Your garment is being crafted at our Thiruvottiyur studio. For any urgent modifications, please reach out via WhatsApp quoting your mobile number.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
