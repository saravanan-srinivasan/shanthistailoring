"use client";

import { motion } from "framer-motion";
import { Sparkles, Ruler, Clock, Shield } from "lucide-react";

const values = [
  {
    icon: <Sparkles size={20} strokeWidth={1} className="text-[#C9A84C]" />,
    title: "AI Style Intelligence",
    desc: "Our Groq-powered fashion assistant recommends designs tailored to your saree, occasion, and personal taste.",
  },
  {
    icon: <Ruler size={20} strokeWidth={1} className="text-[#C9A84C]" />,
    title: "Precision Measurements",
    desc: "Save your measurements digitally. Every future garment fits perfectly from day one — no returns, no alterations needed.",
  },
  {
    icon: <Clock size={20} strokeWidth={1} className="text-[#C9A84C]" />,
    title: "Real-time Order Tracking",
    desc: "Know exactly where your garment is — from cutting to stitching to quality check — through our live tracking dashboard.",
  },
  {
    icon: <Shield size={20} strokeWidth={1} className="text-[#C9A84C]" />,
    title: "Quality Guarantee",
    desc: "Every garment undergoes a multi-point quality check before leaving the atelier. We stand behind every stitch.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-[#0A0A0A] py-28 md:py-36 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20"
        >
          <div>
            <p className="section-label mb-4">Why Shanthi's</p>
            <h2
              className="text-5xl md:text-6xl text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              The Future of<br />
              <span className="italic text-[#C9A84C]">Indian Tailoring.</span>
            </h2>
          </div>
          <p className="text-white/40 font-light text-sm max-w-xs leading-relaxed">
            We're not just a tailor shop. We're building a complete digital fashion ecosystem for the modern Indian woman.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0A0A0A] hover:bg-[#111] transition-colors duration-500 p-8 md:p-10 group flex flex-col"
            >
              <div className="mb-8">{v.icon}</div>
              <h3
                className="text-xl md:text-2xl text-white mb-4 leading-snug group-hover:text-[#C9A84C] transition-colors duration-300"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
              >
                {v.title}
              </h3>
              <p className="text-white/40 font-light text-sm leading-relaxed">{v.desc}</p>
              <div className="w-6 h-px bg-[#C9A84C]/50 mt-8 group-hover:w-12 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
