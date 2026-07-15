"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      {/* Main Footer Content */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <p
              className="text-3xl text-white tracking-[0.1em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
            >
              Shanthi's
            </p>
            <p className="text-[10px] tracking-[0.45em] uppercase text-[#C9A84C] mt-1">
              Tailoring Atelier
            </p>
          </div>
          <p className="text-white/35 text-sm font-light leading-relaxed max-w-xs mb-8">
            Stitching Perfection, Designing Confidence. Chennai's premier destination for bespoke Indian fashion.
          </p>
          <p
            className="text-2xl text-white/60 italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            "Every thread, a promise."
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="section-label mb-6">Navigate</p>
          <ul className="space-y-3">
            {[
              { label: "Home", href: "/" },
              { label: "The Atelier", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Collections", href: "/gallery" },
              { label: "Track Order", href: "/track" },
              { label: "Book Appointment", href: "/appointment" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-white/40 hover:text-[#C9A84C] text-sm font-light transition-colors duration-300"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="section-label mb-6">Visit Us</p>
          <address className="not-italic text-sm text-white/40 font-light leading-loose">
            14/9, Nethaji Nagar 3rd Street,<br />
            Thiruvottiyur,<br />
            Chennai – 600019
          </address>
          <div className="mt-5 space-y-2">
            <a
              href="tel:+919094586060"
              className="block text-[#C9A84C] text-sm hover:text-[#E8C97A] transition-colors duration-300"
            >
              +91 90945 86060
            </a>
            <p className="text-white/30 text-xs tracking-widest uppercase">Mon – Sat · 10 AM – 8 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 max-w-screen-xl mx-auto px-6 md:px-10 pt-6 pb-24 lg:pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/20 text-xs tracking-widest">
          © {year} Shanthi's Tailoring. All rights reserved.
        </p>
        <p className="text-white/20 text-xs tracking-widest">
          Thiruvottiyur, Chennai, India
        </p>
      </div>
    </footer>
  );
}
