"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

/* Navbar height is ~88px. We use 96px as the safe clearance. */
const NAV_H = 96;

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY    = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <>
      {/* ════════════ HERO ════════════ */}
      <section
        ref={ref}
        className="relative w-full overflow-hidden bg-[#0A0A0A]"
        style={{ height: "100svh", minHeight: 680 }}
      >
        {/* Static image with Ken Burns cinematic animation */}
        <div style={{ position: "absolute", inset: 0, top: "-8%", bottom: "-8%", overflow: "hidden" }}>
          <Image
            src="/images/hero.png"
            alt="Shanthi's Tailoring – Luxury Fashion Chennai"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center hero-ken-burns"
            style={{ filter: "brightness(0.45) contrast(1.08) saturate(0.85)" }}
          />
        </div>

        {/* Video layer — hidden by default, fades in only when video loads successfully */}
        <motion.div
          style={{ y: imgY, position: "absolute", inset: 0, top: "-8%", bottom: "-8%" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoReady(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
            style={{ filter: "brightness(0.45) contrast(1.08) saturate(0.85)" }}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Cinematic colour grades */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/40" />

        {/* Floating gold particles (decorative) */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-[#C9A84C]/30 to-transparent pointer-events-none"
            style={{
              height: `${80 + i * 40}px`,
              left: `${20 + i * 30}%`,
              top: `${15 + i * 20}%`,
            }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -20, 0] }}
            transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          />
        ))}

        {/* ─── CONTENT ─────────────────────────────── */}
        <motion.div
          style={{ opacity, paddingTop: NAV_H, paddingBottom: 32 }}
          className="absolute inset-0 z-10 flex flex-col justify-center"
        >
          <div className="max-w-screen-xl mx-auto w-full px-6 md:px-10">
            <div className="max-w-3xl">

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="w-10 h-px bg-[#C9A84C]" />
                <span className="section-label">Est. 2026 · Chennai, India</span>
              </motion.div>

              {/* Main headings */}
              {[
                { text: "Stitching",             italic: false, gold: false, delay: 0.50 },
                { text: "Perfection,",            italic: false, gold: true,  delay: 0.65 },
                { text: "Designing Confidence.",  italic: true,  gold: false, delay: 0.80 },
              ].map(({ text, italic, gold, delay }) => (
                <motion.h1
                  key={text}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
                  className={`leading-[0.9] font-light ${italic ? "italic" : ""} ${
                    gold ? "animate-shimmer" : "text-white"
                  }`}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(2.4rem, 6.5vw, 6rem)",
                  }}
                >
                  {text}
                </motion.h1>
              ))}

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
                className="w-20 h-px bg-gradient-to-r from-[#C9A84C] to-transparent mt-6 mb-5"
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="text-white/50 font-light leading-relaxed mb-8"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "clamp(0.82rem, 1.3vw, 1rem)",
                  maxWidth: 440,
                }}
              >
                India&apos;s premier bespoke tailoring studio. Every thread placed with intention, every seam crafted with devotion.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.25 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/appointment"><button className="btn-gold">Visit Atelier (Chennai)</button></Link>
                <Link href="/order-online"><button className="btn-ghost text-[#C9A84C] border-[#C9A84C]/50 hover:bg-[#C9A84C]/10">Order Online (India-wide)</button></Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 right-10 z-10 flex flex-col items-center gap-3"
        >
          <span
            className="text-white/25 text-[9px] tracking-[0.4em] uppercase"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
          <div className="w-px h-14 bg-white/10 overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              className="w-full h-1/2 bg-[#C9A84C]"
            />
          </div>
        </motion.div>
      </section>

      {/* ════════════ STATS BAR ════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="bg-[#0F0F0F] border-b border-white/5"
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-3 divide-x divide-white/8 py-6">
            {[
              { num: "100%", label: "Satisfaction"  },
              { num: "100%",     label: "Custom Fit" },
              { num: "50+",    label: "Styles Offered" },
            ].map(({ num, label }) => (
              <div key={label} className="flex flex-col items-center text-center px-4 py-1">
                <span
                  className="text-xl md:text-2xl text-[#C9A84C]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                >
                  {num}
                </span>
                <span className="text-white/35 text-[10px] tracking-widest uppercase mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
