"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (data) setServices(data);
    }
    fetchServices();
  }, []);
  return (
    <main className="bg-[#0A0A0A] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── PAGE HERO ──────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src="/images/bridal.png"
          alt="Our Services"
          fill
          priority
          className="object-cover object-center hero-ken-burns"
          style={{ filter: "brightness(0.35) saturate(0.8)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-28 md:pt-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="section-label mb-5"
          >
            The Atelier
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl text-white font-light leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Services
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-16 h-px bg-[#C9A84C] mt-6"
            style={{ transformOrigin: "center" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-white/50 mt-6 max-w-lg text-base font-light leading-relaxed"
          >
            Every stitch tells a story. From daily elegance to your most monumental celebrations, we craft garments that are uniquely yours.
          </motion.p>
        </div>
      </div>

      {/* ── SERVICES LIST ──────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {services.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-[#0A0A0A] hover:bg-[#111] transition-colors duration-500 p-8 md:p-10 flex gap-6"
              >
                {/* Image thumbnail */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 overflow-hidden">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] font-medium">
                        {s.sub}
                      </span>
                      <h3
                        className="text-xl md:text-2xl text-white mt-1 leading-tight group-hover:text-[#C9A84C] transition-colors duration-300"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                      >
                        {s.title}
                      </h3>
                    </div>
                    <span
                      className="text-4xl text-white/8 font-light flex-shrink-0 mt-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {s.num}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm font-light leading-relaxed mb-5">{s.desc}</p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-5">
                      <span className="text-[#C9A84C] font-light text-2xl mb-1 block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="text-lg text-[#C9A84C] italic"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {s.price}
                      </span>
                      <span className="text-white/25 text-xs tracking-widest uppercase">
                        {s.duration}
                      </span>
                    </div>
                    <a href="/appointment">
                      <button className="text-[10px] tracking-[0.25em] uppercase text-white/50 hover:text-[#C9A84C] transition-colors duration-300 border border-white/10 hover:border-[#C9A84C]/40 px-4 py-2">
                        Book Now
                      </button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────── */}
      <section className="bg-[#C9A84C] py-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              className="text-3xl md:text-4xl text-[#0A0A0A] font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Not sure which service you need?
            </h2>
            <p className="text-[#0A0A0A]/60 mt-2 font-light text-sm">
              Let our expert stylists guide you to the perfect look.
            </p>
          </div>
          <a href="/appointment">
            <button
              className="flex-shrink-0 bg-[#0A0A0A] text-[#C9A84C] px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#1A1A1A] transition-colors duration-300"
            >
              Book a Free Consultation
            </button>
          </a>
        </div>
      </section>
    </main>
  );
}
