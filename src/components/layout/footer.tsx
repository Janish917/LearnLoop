"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Github, Twitter, Linkedin, Send } from "lucide-react";
import { Container } from "@/components/ui/container";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Integrations", href: "#integrations" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "Guides", href: "#guides" },
      { label: "API Reference", href: "#api" },
      { label: "System Status", href: "#status" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" },
      { label: "Security", href: "#security" },
    ],
  },
];

export function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="relative bg-[#020205] border-t border-white/5 pt-20 pb-10 overflow-hidden w-full mt-auto">
      {/* Background glow behind footer */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-primary-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-[#14B8A6]/5 blur-[100px] rounded-full pointer-events-none" />

      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16">
          {/* Logo & Tagline column */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#5B4BDB]/10 border border-[#5B4BDB]/25 group-hover:border-[#5B4BDB]/50 transition-all">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-white">
                LearnLoop<span className="text-[#C9A96E] font-light">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm font-body leading-relaxed">
              Accelerating learning processes through loop-based neural networks and autonomous AI agents designed to augment intellectual workloads.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-white/5 bg-white/3 text-white/60 hover:text-[#14B8A6] hover:border-[#14B8A6]/40 hover:bg-white/5 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-white/5 bg-white/3 text-white/60 hover:text-[#5B4BDB] hover:border-[#5B4BDB]/40 hover:bg-white/5 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-white/5 bg-white/3 text-white/60 hover:text-[#14B8A6] hover:border-[#14B8A6]/40 hover:bg-white/5 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="flex flex-col space-y-4">
              <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-white">
                {col.title}
              </h4>
              <ul className="flex flex-col space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-muted-foreground hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter signup column */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-white">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground font-body">
              Receive bi-weekly reports on AI integrations.
            </p>
            <form onSubmit={handleSubmit} className="relative mt-2 flex">
              <input
                type="email"
                required
                placeholder="Enter email"
                className="w-full bg-[#0B1020] border border-white/10 rounded-lg py-2.5 pl-4 pr-11 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#5B4BDB]/50 focus:shadow-[0_0_15px_rgba(91,75,219,0.15)] transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-9 bg-[#5B4BDB] hover:bg-[#6c5eec] text-white rounded-md flex items-center justify-center transition-colors duration-300"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground font-body">
            &copy; {new Date().getFullYear()} LearnLoop AI Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="#privacy"
              className="text-xs text-muted-foreground hover:text-white transition-colors font-body"
            >
              Privacy Policy
            </Link>
            <Link
              href="#terms"
              className="text-xs text-muted-foreground hover:text-white transition-colors font-body"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
