"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { CheckCircle, Phone, MessageSquare, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  name:            z.string().min(2, "Please enter your full name."),
  mobile:          z.string().min(10, "Please enter a valid mobile number.").max(15),
  email:           z.string().email("Please enter a valid email address."),
  dressType:       z.string().min(1, "Please select a service."),
  appointmentDate: z.string().min(1, "Please pick a date."),
  preferredTime:   z.string().min(1, "Please select a time slot."),
  notes:           z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const services = [
  "Saree Blouse Stitching",
  "Designer Blouse",
  "Bridal Blouse",
  "Bridal Lehenga / Wear",
  "Chudidhar / Punjabi Suit",
  "Women's Dress / Top",
  "Kids Dress",
  "Aari Work / Embroidery",
  "Alteration",
  "Other / Consultation",
];

const timeSlots = [
  "Morning  10:00 AM – 12:00 PM",
  "Afternoon  12:00 PM – 3:00 PM",
  "Evening  3:00 PM – 6:00 PM",
  "Late Evening  6:00 PM – 8:00 PM",
];

const inputClass =
  "w-full bg-transparent border-b border-white/15 focus:border-[#C9A84C] outline-none text-white text-sm font-light py-3 placeholder:text-white/25 transition-colors duration-300";
const labelClass = "text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1 block";
const errorClass = "text-red-400 text-xs mt-1 font-light";

export default function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from("appointments").insert([
        {
          first_name: values.name.split(" ")[0],
          last_name: values.name.split(" ").slice(1).join(" ") || "",
          email: values.email,
          phone: values.mobile,
          date: values.appointmentDate,
          time: values.preferredTime,
          service_type: values.dressType,
          notes: values.notes || null,
        },
      ]);

      if (error) {
        console.error("Error saving appointment:", error);
        alert("Failed to submit appointment. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <main className="bg-[#0A0A0A] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── PAGE HERO ─────────────────────────────── */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <Image
          src="/images/bridal.png"
          alt="Book an Appointment"
          fill priority
          className="object-cover object-top"
          style={{ filter: "brightness(0.25) saturate(0.7)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/20 via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-28 md:pt-32">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">
            Private Consultation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-6xl text-white font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Book an Appointment
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} className="w-16 h-px bg-[#C9A84C] mt-5" style={{ transformOrigin: "center" }} />
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Left info panel */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
              <h2
                className="text-3xl text-white font-light mb-6 leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Begin your <span className="italic text-[#C9A84C]">bespoke journey.</span>
              </h2>
              <div className="w-8 h-px bg-[#C9A84C] mb-8" />
              <p className="text-white/40 text-sm font-light leading-relaxed mb-12">
                Book your private consultation and let our expert stylists guide you through fabrics, designs, and measurements — all tailored to your unique vision.
              </p>

              <div className="space-y-7">
                {[
                  { icon: <Phone size={14} className="text-[#C9A84C]" strokeWidth={1.5} />, label: "Call / WhatsApp", value: "+91 90945 86060" },
                  { icon: <Clock size={14} className="text-[#C9A84C]" strokeWidth={1.5} />, label: "Working Hours",   value: "Mon–Sat · 10 AM – 8 PM" },
                  { icon: <MessageSquare size={14} className="text-[#C9A84C]" strokeWidth={1.5} />, label: "Address", value: "14/9, Nethaji Nagar 3rd St, Thiruvottiyur, Chennai – 600019" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1">{item.label}</p>
                      <p className="text-white/70 text-sm font-light">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/919094586060?text=Hi, I'd like to book a consultation at Shanthi's Tailoring."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-12 flex items-center gap-3 text-[#C9A84C] text-xs tracking-widest uppercase hover:text-[#E8C97A] transition-colors"
              >
                <MessageSquare size={14} strokeWidth={1.5} />
                Chat instantly on WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-[#C9A84C]/20 bg-white/2 p-12 text-center"
              >
                <CheckCircle size={48} className="text-[#C9A84C] mx-auto mb-6" strokeWidth={1} />
                <h2
                  className="text-3xl text-white font-light mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Booking Confirmed
                </h2>
                <p className="text-white/50 font-light text-sm leading-relaxed max-w-md mx-auto mb-8">
                  Thank you. We will contact you shortly to confirm your consultation slot. You can also reach us directly on WhatsApp for faster response.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-ghost"
                >
                  Book Another
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9 }}
                className="border border-white/8 bg-white/[0.02] p-8 md:p-12"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input {...register("name")} placeholder="Priya Sharma" className={inputClass} />
                      {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Mobile Number *</label>
                      <input {...register("mobile")} placeholder="+91 9876543210" className={inputClass} />
                      {errors.mobile && <p className={errorClass}>{errors.mobile.message}</p>}
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input {...register("email")} type="email" placeholder="priya@example.com" className={inputClass} />
                      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Service Required *</label>
                      <select {...register("dressType")} className={`${inputClass} cursor-pointer`} defaultValue="">
                        <option value="" disabled className="bg-[#111]">Select a service</option>
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-[#111] text-white">{s}</option>
                        ))}
                      </select>
                      {errors.dressType && <p className={errorClass}>{errors.dressType.message}</p>}
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>Preferred Date *</label>
                      <input
                        {...register("appointmentDate")}
                        type="date"
                        className={`${inputClass} [color-scheme:dark]`}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {errors.appointmentDate && <p className={errorClass}>{errors.appointmentDate.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Preferred Time *</label>
                      <select {...register("preferredTime")} className={`${inputClass} cursor-pointer`} defaultValue="">
                        <option value="" disabled className="bg-[#111]">Select a slot</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t} className="bg-[#111] text-white">{t}</option>
                        ))}
                      </select>
                      {errors.preferredTime && <p className={errorClass}>{errors.preferredTime.message}</p>}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className={labelClass}>Additional Notes</label>
                    <textarea
                      {...register("notes")}
                      rows={4}
                      placeholder="Describe your design ideas, fabric details, or any special requirements…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full text-center disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting…" : "Request Appointment"}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
