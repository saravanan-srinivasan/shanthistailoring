"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, MessageSquare, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const inputClass =
  "w-full bg-transparent border-b border-white/15 focus:border-[#C9A84C] outline-none text-white text-sm font-light py-3 placeholder:text-white/25 transition-colors duration-300";
const labelClass = "text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1 block";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact_info: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSent(true);
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="bg-[#0A0A0A] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── PAGE HERO ─────────────────────── */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <Image
          src="/images/aari.png"
          alt="Contact Shanthi's Tailoring"
          fill priority
          className="object-cover object-center hero-ken-burns"
          style={{ filter: "brightness(0.22) saturate(0.7)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/20 via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-28 md:pt-32">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">Get in Touch</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-6xl text-white font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Contact Us
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} className="w-16 h-px bg-[#C9A84C] mt-5" style={{ transformOrigin: "center" }} />
        </div>
      </div>

      {/* ── CONTACT INFO + FORM ──────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
            <p className="section-label mb-5">Find Us</p>
            <h2
              className="text-3xl md:text-4xl text-white font-light mb-8 leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              We'd love to hear <br />
              <span className="italic text-[#C9A84C]">from you.</span>
            </h2>

            <div className="space-y-8">
              {[
                { icon: <MapPin size={16} strokeWidth={1.5} className="text-[#C9A84C]" />, label: "Our Atelier", value: "14/9, Nethaji Nagar 3rd Street,\nThiruvottiyur, Chennai – 600019" },
                { icon: <Phone size={16} strokeWidth={1.5} className="text-[#C9A84C]" />, label: "Phone & WhatsApp", value: "+91 90945 86060" },
                { icon: <Clock size={16} strokeWidth={1.5} className="text-[#C9A84C]" />, label: "Working Hours", value: "Monday – Saturday\n10:00 AM – 8:00 PM" },
              ].map((item) => (
                <div key={item.label} className="flex gap-5 items-start border-b border-white/5 pb-8">
                  <div className="mt-1 flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-2">{item.label}</p>
                    <p className="text-white/70 text-sm font-light whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-5">Follow Us</p>
              <div className="flex gap-6">
                <a
                  href="https://wa.me/919094586060"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-[#C9A84C] transition-colors duration-300"
                >
                  <MessageSquare size={18} strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="tel:+919094586060">
                <button className="btn-gold">Call Now</button>
              </a>
              <a href="https://wa.me/919094586060" target="_blank" rel="noopener noreferrer">
                <button className="btn-ghost flex items-center gap-2">
                  <MessageSquare size={13} strokeWidth={1.5} />
                  WhatsApp
                </button>
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
            {sent ? (
              <div className="border border-[#C9A84C]/20 bg-white/2 p-12 text-center h-full flex flex-col items-center justify-center">
                <p className="section-label mb-4">Message Sent</p>
                <h3 className="text-3xl text-white font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Thank you!
                </h3>
                <p className="text-white/40 text-sm font-light leading-relaxed max-w-sm">
                  We have received your message and will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="border border-white/8 bg-white/[0.02] p-8 md:p-12">
                <p className="section-label mb-6">Send a Message</p>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-9"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>Your Name</label>
                      <input 
                        required 
                        placeholder="Priya Sharma" 
                        className={inputClass}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Mobile / Email</label>
                      <input 
                        required 
                        placeholder="+91 or email" 
                        className={inputClass}
                        value={formData.contact_info}
                        onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Subject</label>
                    <input 
                      required 
                      placeholder="e.g. Bridal consultation enquiry" 
                      className={inputClass}
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Your Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us how we can help you…"
                      className={`${inputClass} resize-none`}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-gold w-full text-center disabled:opacity-50">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── MAP PLACEHOLDER ────────────────────── */}
      <section className="border-t border-white/5">
        <div className="bg-[#0F0F0F] flex items-center justify-center py-20 text-center px-6">
          <div>
            <MapPin size={32} className="text-[#C9A84C] mx-auto mb-4" strokeWidth={1} />
            <p className="text-white/50 font-light text-sm mb-2">14/9, Nethaji Nagar 3rd Street</p>
            <p className="text-white/30 text-xs tracking-widest">Thiruvottiyur, Chennai – 600019</p>
            <a
              href="https://maps.google.com/?q=14/9,+Nethaji+Nagar+3rd+Street,+Thiruvottiyur,+Chennai+-+600019"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A84C] text-xs tracking-widest uppercase mt-6 inline-flex items-center gap-2 hover:text-[#E8C97A] transition-colors"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
