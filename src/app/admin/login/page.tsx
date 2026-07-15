"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if redirected here with an unauthorized error
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "unauthorized") {
      setError("Access denied. This account is not an authorized administrator.");
    }
  }, []);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        window.location.href = "/admin";
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setError("Registration successful! You can now sign in.");
        setIsLogin(true);
        setLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-8 md:p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <h1
            className="text-3xl text-white font-light mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Atelier Dashboard
          </h1>
          <p className="text-white/40 text-sm font-light tracking-wide">
            Secure admin access only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/30 text-red-200 text-xs font-light text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shanthi.com"
                  required
                  className="w-full bg-black/20 border border-white/15 focus:border-[#C9A84C] outline-none text-white text-sm font-light py-3 pl-10 pr-4 placeholder:text-white/20 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/20 border border-white/15 focus:border-[#C9A84C] outline-none text-white text-sm font-light py-3 pl-10 pr-4 placeholder:text-white/20 transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] text-black hover:bg-[#E8C97A] transition-colors py-3 text-sm font-medium tracking-wide uppercase mt-6"
            >
              {loading ? (isLogin ? "Signing in..." : "Registering...") : (isLogin ? "Sign In" : "Register")}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase"
            >
              {isLogin ? "Need an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
