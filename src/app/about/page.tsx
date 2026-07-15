"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const values = [
  { label: "Quality First",          desc: "Premium stitching and fabric finishing — no shortcuts, ever." },
  { label: "Innovation",             desc: "AI-powered style consultation and digital measurement storage." },
  { label: "Transparency",           desc: "Real-time order tracking so you're never left wondering." },
  { label: "Trust & Reliability",    desc: "On-time delivery with a quality guarantee on every garment." },
  { label: "Creativity",             desc: "Unique designs tailored to your taste, occasion, and personality." },
  { label: "Customer Satisfaction",  desc: "We're not done until you love what you wear." },
];

export default function AboutPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── PAGE HERO ─────────────────────────────── */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="About Shanthi's Tailoring"
          fill
          priority
          className="object-cover object-center hero-ken-burns"
          style={{ filter: "brightness(0.32) saturate(0.75)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 flex flex-col justify-end pb-14 px-6 md:px-10 pt-28" style={{ left: 0, right: 0, maxWidth: '1280px', margin: '0 auto' }}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="section-label mb-4">
            Our Heritage
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl text-white font-light leading-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Story of <br /><span className="italic text-[#C9A84C]">Shanthi's Tailoring</span>
          </motion.h1>
        </div>
      </div>

      {/* ── STORY SECTION ──────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
            style={{ height: "560px" }}
          >
            <Image
              src="/images/aari.png"
              alt="Shanthi's Atelier Craft"
              fill
              className="object-cover"
              style={{ filter: "grayscale(20%)" }}
            />
            {/* Gold border frame effect */}
            <div className="absolute inset-4 border border-[#C9A84C]/20 pointer-events-none" />
            {/* Stats overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 flex gap-10">
              {[["1,200+", "Happy Clients"], ["8+", "Years Crafting"], ["50+", "Styles"]].map(([n, l]) => (
                <div key={l}>
                  <p className="text-[#C9A84C] text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>{n}</p>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-label mb-5">Est. 2024 · Chennai</p>
            <h2
              className="text-3xl md:text-4xl text-white mb-6 leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              A legacy of craftsmanship,<br />
              <span className="italic text-[#C9A84C]">redefined for the modern woman.</span>
            </h2>
            <div className="w-10 h-px bg-[#C9A84C] mb-8" />
            <div className="space-y-5 text-white/50 font-light text-sm leading-loose">
              <p>
                Founded in the heart of Thiruvottiyur, Chennai, Shanthi's Tailoring began with a simple but powerful vision: to bring unparalleled precision and artistry to women's tailoring.
              </p>
              <p>
                For years, we have mastered the delicate balance between traditional Indian embroidery techniques and contemporary silhouettes. Every garment we create is a conversation between heritage and modernity.
              </p>
              <p>
                Today, we are transforming into India's first fashion-tech tailoring studio — where AI-powered consultations, digital measurements, and real-time order tracking meet the finest handcraft traditions.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/8">
              <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Visit Our Atelier</p>
              <address className="not-italic text-white/60 font-light text-sm leading-relaxed">
                14/9, Nethaji Nagar 3rd Street,<br />
                Thiruvottiyur, Chennai – 600019<br />
                <a href="tel:+919094586060" className="text-[#C9A84C] mt-2 block hover:text-[#E8C97A] transition-colors">
                  +91 90945 86060
                </a>
              </address>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VISION & MISSION ───────────────────── */}
      <section className="bg-[#0A0A0A] py-24 md:py-32 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-20"
          >
            <p className="section-label text-[#C9A84C] mb-5">Where We&apos;re Going</p>
            <h2
              className="text-4xl md:text-5xl text-white font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Vision &amp; Mission
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {[
              {
                label: "Our Vision",
                title: "India's most trusted AI-powered tailoring brand.",
                body: "We envision a world where every Indian woman has access to perfectly fitted, beautifully crafted garments — powered by technology and rooted in tradition.",
              },
              {
                label: "Our Mission",
                title: "Eliminate every pain point in tailoring.",
                body: "Premium stitching. Personalized AI consultations. Accurate digital measurements. Transparent communication. Real-time tracking. Reliable delivery. Every time.",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="bg-[#0A0A0A] hover:bg-[#111] transition-colors duration-500 p-10 md:p-14 group"
              >
                <p className="section-label mb-4">{item.label}</p>
                <h3
                  className="text-2xl md:text-3xl text-white mb-5 leading-snug group-hover:text-[#C9A84C] transition-colors duration-500"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                >
                  {item.title}
                </h3>
                <div className="w-8 h-px bg-[#C9A84C] mb-6 group-hover:w-16 transition-all duration-500" />
                <p className="text-white/40 font-light leading-relaxed text-sm">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ───────────────────────────── */}
      <section className="bg-[#0A0A0A] py-24 md:py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="section-label mb-5">What We Stand For</p>
            <h2
              className="text-4xl md:text-5xl text-white font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Core Values
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {values.map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.9 }}
                className="bg-[#0A0A0A] hover:bg-[#111] transition-colors duration-500 p-8 md:p-10 group"
              >
                <span className="text-4xl text-[#C9A84C]/20 font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  0{i + 1}
                </span>
                <h3
                  className="text-xl text-white mt-3 mb-3 group-hover:text-[#C9A84C] transition-colors duration-300"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                >
                  {v.label}
                </h3>
                <p className="text-white/35 font-light text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────── */}
      <section className="border-t border-white/5 py-20 text-center bg-[#0A0A0A]">
        <p className="section-label mb-5">Meet Us In Person</p>
        <h2
          className="text-4xl md:text-5xl text-white font-light mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Come visit the atelier.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/appointment">
            <button className="btn-gold">Book a Visit</button>
          </a>
          <a href="https://wa.me/919094586060" target="_blank" rel="noopener noreferrer">
            <button className="btn-ghost">WhatsApp Us</button>
          </a>
        </div>
      </section>
    </main>
  );
}
