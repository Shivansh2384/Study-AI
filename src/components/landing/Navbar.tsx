"use client";

import { useState, useEffect } from "react";
import { Brain, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-neuro-950/90 backdrop-blur-xl border-b border-cyan-400/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-shadow group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              <Brain className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">Neuro</span>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Learn
              </span>
              <span className="ml-1 text-xs font-semibold text-cyan-400/70 uppercase tracking-wider">
                AI
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#problem"
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200"
            >
              Problem
            </a>
            <a
              href="#solution"
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200"
            >
              Solution
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200"
            >
              How It Works
            </a>
            <a
              href="/signin"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </a>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-[1.03]"
            >
              Try Demo
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 flex flex-col gap-4 animate-fade-in-up">
            <a
              href="#problem"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Problem
            </a>
            <a
              href="#solution"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Solution
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </a>
            <a
              href="/demo"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Demo
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
