"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled
          ? "py-3.5 glass-navbar shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
          : "py-6 bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-7.5 h-7.5 bg-white/[0.04] border border-white/10 transition-all duration-300 group-hover:border-white/20">
            <Cpu className="w-3.5 h-3.5 text-white transition-colors duration-300" />
            <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
          </div>
          <span className="font-sans font-bold text-base tracking-tight text-white/95">
            LearnLoop<span className="text-[#8B1A38] font-medium">.AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-[12px] font-normal uppercase tracking-[0.14em] text-[#F5EDE0]/45 hover:text-[#F5EDE0] transition-colors duration-250 py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Sharp Button, Zero Rounded Corners */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="#signin"
            className="font-sans text-[12px] font-normal uppercase tracking-[0.12em] text-[#F5EDE0]/45 hover:text-[#F5EDE0] transition-colors duration-250"
          >
            Sign In
          </Link>
          <button
            className="h-8.5 px-5 border border-[#8B1A38]/60 bg-[#8B1A38]/15 text-[#F5EDE0] font-sans text-[11px] font-semibold uppercase tracking-[0.15em] rounded-[4px] nav-btn-premium cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white/70 hover:text-white transition-colors p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-x-0 top-[65px] bottom-0 bg-[#0C0608] border-t border-[#F5EDE0]/10 z-40 transition-all duration-300 ease-in-out md:hidden flex flex-col justify-between p-8",
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans text-sm font-normal uppercase tracking-[0.14em] text-[#F5EDE0]/75 hover:text-[#F5EDE0] transition-colors duration-250 py-3 border-b border-[#F5EDE0]/10"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <Link
            href="#signin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-center font-sans text-xs font-normal uppercase tracking-[0.12em] text-[#F5EDE0]/60 hover:text-[#F5EDE0] py-2"
          >
            Sign In
          </Link>
          <button
            className="w-full h-11 border border-[#8B1A38]/60 bg-[#8B1A38]/15 text-[#F5EDE0] font-sans text-xs font-semibold uppercase tracking-[0.15em] rounded-[4px] nav-btn-premium cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
