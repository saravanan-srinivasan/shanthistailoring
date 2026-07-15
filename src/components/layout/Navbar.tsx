"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Home, Store, Sparkles, Image as ImageIcon, MessageSquare, Search } from "lucide-react";

const navLinks = [
  { name: "Home",        href: "/" },
  { name: "Atelier",     href: "/about" },
  { name: "Services",    href: "/services" },
  { name: "Collections", href: "/gallery" },
  { name: "Track Order", href: "/track" },
  { name: "Contact",     href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-white/5 py-4 shadow-2xl shadow-black/50"
            : isHome
              ? "bg-transparent py-7"
              : "bg-[#0A0A0A] py-5 border-b border-white/5"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start leading-none group">
            <span
              className="text-2xl md:text-3xl text-white tracking-[0.12em] uppercase transition-colors duration-300 group-hover:text-[#C9A84C]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              Shanthi's
            </span>
            <span className="text-[9px] tracking-[0.45em] uppercase text-[#C9A84C] font-light mt-0.5">
              Tailoring Atelier
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-[11px] tracking-[0.25em] uppercase font-light transition-colors duration-300 group ${
                  pathname === link.href
                    ? "text-[#C9A84C]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[#C9A84C]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+919094586060"
              className="hidden md:flex items-center gap-2 text-[#C9A84C] text-xs tracking-widest uppercase hover:text-[#E8C97A] transition-colors duration-300"
            >
              <Phone size={12} strokeWidth={1.5} />
              <span>+91 90945 86060</span>
            </a>

            <Link href="/appointment">
              <button className="btn-gold hidden md:block">
                Book Now
              </button>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white p-1 hidden" // Hiding hamburger menu since we added bottom nav
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col pt-32 px-8"
          >
            <div className="space-y-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-4xl transition-colors duration-300 ${
                      pathname === link.href ? "text-[#C9A84C]" : "text-white/80 hover:text-[#C9A84C]"
                    }`}
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-[#C9A84C] text-sm tracking-widest">+91 90945 86060</p>
              <p className="text-white/40 text-xs mt-2">Thiruvottiyur, Chennai – 600019</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE BOTTOM NAVIGATION (App-like experience) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-2xl border-t border-white/10 lg:hidden flex justify-between items-center px-2 py-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {[
          { name: "Home", href: "/", icon: <Home size={18} strokeWidth={1.5} /> },
          { name: "Services", href: "/services", icon: <Sparkles size={18} strokeWidth={1.5} /> },
          { name: "Track", href: "/track", icon: <Search size={18} strokeWidth={1.5} /> },
          { name: "Gallery", href: "/gallery", icon: <ImageIcon size={18} strokeWidth={1.5} /> },
          { name: "Contact", href: "/contact", icon: <MessageSquare size={18} strokeWidth={1.5} /> },
        ].map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1.5 p-2 w-[20%] transition-colors duration-300 ${
                isActive ? "text-[#C9A84C]" : "text-white/40 hover:text-white"
              }`}
            >
              <div className="relative">
                {link.icon}
                {isActive && (
                  <motion.div
                    layoutId="mobile-indicator"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A84C]"
                  />
                )}
              </div>
              <span className="text-[8px] tracking-wider uppercase font-light">
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
