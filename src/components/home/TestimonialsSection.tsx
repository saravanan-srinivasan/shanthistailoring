"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "The precision of the Aari work and the perfect fit made me feel like royalty on my wedding day. I've never worn anything crafted with such devotion.",
    name: "Priya Sharma",
    role: "Bridal Client · 2026",
    rating: 5,
    initial: "P",
  },
  {
    quote:
      "The AI assistant recommended a neck design I would never have thought of. The result was breathtaking. My entire family wanted the same blouse!",
    name: "Ananya Meenakshi",
    role: "Designer Blouse Client",
    rating: 5,
    initial: "A",
  },
  {
    quote:
      "Real-time order tracking was a game-changer. I knew exactly where my lehenga was at every step. Professional, punctual, and absolutely stunning work.",
    name: "Lakshmi R.",
    role: "Repeat Client · Chennai",
    rating: 5,
    initial: "L",
  },
];

import { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const [data, setData] = useState(testimonials);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(fetched => {
        if (fetched && fetched.length > 0) {
          setData(fetched);
        }
      })
      .catch(err => console.error("Failed to load testimonials:", err));
  }, []);

  return (
    <section className="bg-[#0F0F0F] py-28 md:py-36 relative overflow-hidden">
      {/* Decorative serif watermark */}
      <div
        className="absolute -right-10 top-1/2 -translate-y-1/2 text-[200px] text-[#C9A84C]/5 leading-none select-none pointer-events-none hidden xl:block"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        S
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="section-label mb-5">Client Stories</p>
          <h2
            className="text-5xl md:text-6xl text-white leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            Words from Our <span className="italic text-[#C9A84C]">Muses</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {data.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0F0F0F] hover:bg-[#161616] transition-colors duration-500 p-10 md:p-12 flex flex-col border-t border-white/5"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-[#C9A84C] text-sm">★</span>
                ))}
              </div>

              {/* Quote mark */}
              <span
                className="text-5xl text-[#C9A84C] leading-none mb-4 -mt-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                &ldquo;
              </span>

              <p className="text-white/55 font-light leading-relaxed text-[15px] flex-1 italic mb-10">
                {t.quote}
              </p>

              <div className="border-t border-white/8 pt-6 flex items-center gap-4">
                {/* Avatar circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <p
                    className="text-white text-base tracking-wide"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                  >
                    {t.name}
                  </p>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mt-0.5">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
