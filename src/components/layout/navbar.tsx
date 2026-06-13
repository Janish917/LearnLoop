"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
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
      if (window.scrollY > 20) {
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
          ? "py-3 glass-navbar shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          : "py-6 bg-transparent border-b border-transparent"
      )}
    >
      <Container size="lg" className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#5B4BDB]/10 border border-[#5B4BDB]/25 transition-all duration-300 group-hover:bg-[#5B4BDB]/20 group-hover:border-[#5B4BDB]/50 group-hover:shadow-[0_0_15px_rgba(91,75,219,0.3)]">
            <Cpu className="w-5 h-5 text-[#14B8A6] group-hover:text-white transition-colors duration-300" />
            {/* Ambient indicator */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
            </span>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-white transition-colors duration-300 group-hover:text-[#5B4BDB]">
            LearnLoop<span className="text-[#14B8A6] font-light">.AI</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative font-body text-sm text-white/80 hover:text-white transition-colors duration-300 py-2 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#14B8A6] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="primary" size="sm" className="shadow-[0_0_15px_rgba(91,75,219,0.25)]">
            Get Started
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-[#14B8A6] transition-colors p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-x-0 top-[73px] bottom-0 bg-[#050816] border-t border-white/5 z-40 transition-all duration-300 ease-in-out md:hidden flex flex-col justify-between p-6",
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
              className="font-heading text-lg text-white/90 hover:text-[#14B8A6] transition-colors duration-300 py-2 border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            className="w-full justify-center shadow-[0_0_15px_rgba(91,75,219,0.25)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
