"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    // Check if user has already seen loading screen this session
    const seen = sessionStorage.getItem("shanthi_loaded");
    if (seen) {
      setVisible(false);
      return;
    }

    // Phase timeline: in → hold → out
    const holdTimer = setTimeout(() => setPhase("hold"), 900);
    const outTimer  = setTimeout(() => setPhase("out"),  2000);
    const doneTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("shanthi_loaded", "1");
    }, 2800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient glow orbs */}
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)", top: "20%", left: "30%", filter: "blur(80px)" }}
          />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-8 pointer-events-none"
            style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)", bottom: "20%", right: "25%", filter: "blur(60px)" }}
          />

          {/* Gold horizontal line top */}
          <motion.div
            className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"
            initial={{ width: "0%", left: "50%" }}
            animate={phase !== "in" ? { width: "100%", left: "0%" } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Gold horizontal line bottom */}
          <motion.div
            className="absolute bottom-0 right-0 h-px bg-gradient-to-l from-transparent via-[#C9A84C] to-transparent"
            initial={{ width: "0%", right: "50%" }}
            animate={phase !== "in" ? { width: "100%", right: "0%" } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Main logo mark */}
          <div className="relative flex flex-col items-center">
            {/* The giant S */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span
                className="text-[120px] md:text-[160px] leading-none select-none"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 500,
                  background: "linear-gradient(135deg, #C9A84C 0%, #F0D98A 40%, #C9A84C 60%, #8B6914 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(201,168,76,0.3))",
                }}
              >
                S
              </span>

              {/* Shimmer sweep over S */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-150%" }}
                animate={phase === "hold" ? { x: "150%" } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
                }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center -mt-4"
            >
              <p
                className="text-white text-2xl md:text-3xl tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Shanthi&apos;s
              </p>
              <p className="text-[#C9A84C] text-[10px] tracking-[0.6em] uppercase mt-1 font-light">
                Tailoring Atelier
              </p>
            </motion.div>

            {/* Animated gold line under name */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-px bg-[#C9A84C] mt-6"
              style={{ transformOrigin: "center" }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-white/30 text-[10px] tracking-[0.4em] uppercase mt-4 font-light"
            >
              Crafting Elegance Since 2026
            </motion.p>
          </div>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute bottom-12 flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-[#C9A84C]"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
