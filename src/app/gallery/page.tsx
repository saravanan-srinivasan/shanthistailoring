"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const categories = ["All", "Bridal", "Blouses", "Aari Work", "Kids Wear", "Suits"];

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<null | { src: string; label: string }>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setGalleryItems(data))
      .catch(err => console.error("Failed to load gallery", err));
  }, []);

  const filtered = active === "All"
    ? galleryItems
    : galleryItems.filter((g) => g.cat === active);

  return (
    <main className="bg-[#0A0A0A] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── PAGE HERO ─────────────────────────── */}
      <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <Image
          src="/images/blouse.png"
          alt="Collections Gallery"
          fill
          priority
          className="object-cover object-center hero-ken-burns"
          style={{ filter: "brightness(0.3) saturate(0.7)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-28 md:pt-32">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="section-label mb-5">
            The Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl text-white font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Collections
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }}
            className="w-16 h-px bg-[#C9A84C] mt-6" style={{ transformOrigin: "center" }}
          />
        </div>
      </div>

      {/* ── FILTER BAR ─────────────────────────── */}
      <div className="sticky top-20 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 py-5">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex gap-8 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-[11px] tracking-[0.25em] uppercase whitespace-nowrap pb-1 transition-all duration-300 flex-shrink-0 ${
                active === cat
                  ? "text-[#C9A84C] border-b border-[#C9A84C]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── MASONRY GRID ───────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <motion.div
            layout
            className="columns-2 md:columns-3 gap-4 space-y-4"
          >
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={`${item.label}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group cursor-pointer overflow-hidden break-inside-avoid mb-4"
                  style={{ height: item.size === "tall" ? "420px" : "280px" }}
                  onClick={() => setLightbox({ src: item.src, label: item.label })}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-[8s] group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
                    <div>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-1 block">
                        {item.cat}
                      </span>
                      <span className="text-white text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-white/30">
              <p className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No items in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ───────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-3xl w-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ height: "70vh" }}>
                <Image
                  src={lightbox.src}
                  alt={lightbox.label}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-white font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {lightbox.label}
                </p>
                <button
                  onClick={() => setLightbox(null)}
                  className="text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ────────────────────────────────── */}
      <section className="bg-[#0F0F0F] border-t border-white/5 py-20 text-center">
        <p className="section-label mb-5">Ready to Create?</p>
        <h2
          className="text-4xl md:text-5xl text-white font-light mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Your masterpiece awaits.<br />
          <span className="italic text-[#C9A84C]">Let's build it together.</span>
        </h2>
        <a href="/appointment">
          <button className="btn-gold">Book a Consultation</button>
        </a>
      </section>
    </main>
  );
}
