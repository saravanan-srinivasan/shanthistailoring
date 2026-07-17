"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase.from('services').select('*').eq('is_highlight', true).order('sort_order', { ascending: true }).limit(3);
      if (data) setServices(data);
    }
    fetchServices();
  }, []);
  return (
    <section className="bg-[#0A0A0A] py-24 md:py-36 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24"
        >
          <div>
            <p className="section-label mb-4">Our Offerings</p>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              Crafted for<br />
              <span className="italic text-[#C9A84C]">your story.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-white/50 font-light leading-relaxed text-sm">
              Every garment begins as a conversation. We listen to your story, understand your occasion, and translate your vision into wearable art.
            </p>
            <Link href="/services">
              <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mt-6 inline-flex items-center gap-2 group cursor-pointer hover:gap-3 transition-all duration-300">
                View All Services
                <span>→</span>
              </p>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Services — full-bleed alternating panels */}
      <div className="flex flex-col">
        {services.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 w-full group"
          >
            {/* Image */}
            <div
              className={`relative h-[360px] md:h-[520px] overflow-hidden ${
                index % 2 !== 0 ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <Image
                src={s.img}
                alt={s.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-[8s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-700" />
              <span className="absolute top-6 left-6 text-[10px] tracking-[0.3em] uppercase text-white bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/20">
                {s.tag}
              </span>
            </div>

            {/* Text */}
            <div
              className={`flex flex-col justify-center px-8 md:px-14 lg:px-16 py-14 md:py-20 bg-white ${
                index % 2 !== 0 ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <span
                className="text-7xl md:text-8xl font-light text-[#F5F2EB] leading-none select-none mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="section-label mb-3">{s.sub}</p>
              <h3
                className="text-3xl md:text-4xl lg:text-5xl text-[#0A0A0A] mb-5 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
              >
                {s.title}
              </h3>
              <div className="w-10 h-px bg-[#C9A84C] mb-6 group-hover:w-20 transition-all duration-700" />
              <p className="text-[#888] font-light leading-relaxed text-sm mb-8">{s.desc}</p>
              <p
                className="text-2xl text-[#C9A84C] mb-10 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.price}
              </p>
              <Link href="/appointment" className="w-fit">
                <button className="btn-gold">Book Consultation</button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
