"use client";

import { motion } from "framer-motion";
import { MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-[#2D0A4E] py-24 md:py-32 relative overflow-hidden">
      {/* Animated decorative orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#C9A84C] blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#C9A84C] blur-3xl pointer-events-none"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="section-label mb-5">Begin Your Journey</p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            Your perfect garment <br />
            <span className="italic text-[#C9A84C]">is one call away.</span>
          </h2>
          <p className="text-white/50 font-light mt-6 text-sm leading-relaxed">
            Book your private consultation at our Thiruvottiyur atelier, or reach us instantly on WhatsApp.
            Our team responds within 30 minutes.
          </p>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              "✦ No booking fee",
              "✦ Responds in 30 mins",
              "✦ Filter coffee on us",
            ].map((item) => (
              <span key={item} className="text-white/30 text-xs tracking-widest">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4 min-w-[260px]"
        >
          <Link href="/appointment">
            <button className="btn-gold w-full text-center">Book Appointment</button>
          </Link>
          <a
            href="https://wa.me/919094586060?text=Hi, I'd like to book a consultation at Shanthi's Tailoring."
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn-ghost w-full flex items-center justify-center gap-2 text-center">
              <MessageSquare size={14} strokeWidth={1.5} />
              Chat on WhatsApp
            </button>
          </a>
          <a href="tel:+919094586060" className="flex items-center justify-center gap-2 text-white/30 text-xs tracking-widest hover:text-[#C9A84C] transition-colors duration-300 mt-1">
            <Phone size={11} strokeWidth={1.5} />
            +91 90945 86060
          </a>
          <p className="text-white/25 text-[10px] text-center tracking-widest uppercase">
            Mon – Sat, 10 AM – 8 PM
          </p>
        </motion.div>
      </div>
    </section>
  );
}
