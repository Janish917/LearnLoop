"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

// Dynamically import the Live Knowledge Map with SSR disabled
const LiveKnowledgeMap = dynamic(() => import("@/components/canvas/live-knowledge-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[5/4] max-w-[620px] flex items-center justify-center border border-white/[0.08] bg-[#0A0A12]/40 backdrop-blur-md">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-4 h-4 text-white/30 animate-spin" />
        <span className="text-[10px] text-white/30 font-sans tracking-widest uppercase">
          Loading Knowledge Map...
        </span>
      </div>
    </div>
  ),
});

export function Hero() {
  // Add mousemove parallax listener for 3D text floating depth
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      
      const headline = document.querySelector(".hero-headline") as HTMLElement;
      if (headline) {
        headline.style.transform = `translate(${dx * -6}px, ${dy * -4}px)`;
      }

      const mapCard = document.querySelector(".map-card") as HTMLElement;
      if (mapCard) {
        mapCard.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Section variant="background" className="min-h-screen relative overflow-hidden bg-[#09090B] text-white" spacing="none">
      {/* Dark Vignette Overlay */}
      <div className="vignette-overlay" />

      {/* Warm candlelight glow behind LEFT column */}
      <div className="hero-bg-left" />

      {/* Subtle desaturated glow behind RIGHT column */}
      <div 
        className="absolute top-[15%] right-[-5%] w-[600px] h-[600px] pointer-events-none z-0" 
        style={{
          background: "radial-gradient(circle at 60% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 65%)"
        }}
      />

      <Container className="relative z-20">
        {/* Main Hero Container using custom 80px layout grid */}
        <div className="hero-grid relative z-20">
        
        {/* LEFT COLUMN: Rebuilt with manual element spacing */}
        <div className="hero-left-col relative z-10">
          
          {/* Eyebrow tag: 10px, weight 600, tracking 0.22em, 30% white, bottom margin 28px */}
          <div className="eyebrow eyebrow-fade">
            UNDERSTANDING INTELLIGENCE
          </div>

          {/* H1 Headline: line-height 1.0, tracking -0.04em, margin-bottom 40px */}
          <h1 className="hero-headline select-none flex flex-col space-y-0">
            <span className="hero-line-white hero-line-1">
              Finally Know
            </span>
            <span className="hero-line-white hero-line-2">
              If You
            </span>
            <span className="hero-line-3">
              <span className="hero-line-gold">
                Understand.
              </span>
            </span>
          </h1>

          {/* Body Text: 16px, 1.8 line-height, 38% white, max-width 380px, bottom margin 52px */}
          <p className="hero-body hero-body-fade">
            LearnLoop measures understanding instead of completion — detecting misconceptions,
            predicting failures, and mapping knowledge in real time.
          </p>

          {/* CTAs: sharp corners, 6px radius, fit-content, gap 16px */}
          <div className="flex flex-wrap gap-[16px] items-center cta-group-fade">
            <button className="btn-premium-primary">
              EXPLORE DEMO
            </button>
            
            <button className="btn-premium-ghost">
              SEE KNOWLEDGE MAP
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-start pt-[52px] cta-group-fade" style={{ animationDelay: "0.65s" }}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5EDE0]/20 mb-3 font-semibold">SCROLL</span>
            <div className="w-[1px] h-12 bg-[#F5EDE0]/10 relative">
              <motion.div
                className="absolute left-[-2.5px] w-1.5 h-1.5 rounded-full bg-[#8B1A38]"
                animate={{
                  y: [0, 42],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Float Map Card Wrapper */}
        <div className="flex justify-center items-center relative z-10 w-full">
          <div className="map-card map-card-fade w-full">
            <LiveKnowledgeMap />
          </div>
        </div>
      </div>

        {/* Bloomberg-Style Minimal Stat Cards Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-24 pb-16">
          <div className="border-t border-white/15 pt-6 flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2 font-semibold">
              UNDERSTANDING INDEX
            </span>
            <span className="text-4xl font-bold text-white mb-1 font-sans">
              87%
            </span>
            <span className="text-xs text-white/35 font-sans font-medium">
              Average user mastery rate
            </span>
          </div>

          <div className="border-t border-white/15 pt-6 flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2 font-semibold">
              KNOWLEDGE RETENTION
            </span>
            <span className="text-4xl font-bold text-white mb-1 font-sans">
              78%
            </span>
            <span className="text-xs text-white/35 font-sans font-medium">
              Memory decay index
            </span>
          </div>

          <div className="border-t border-white/15 pt-6 flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2 font-semibold">
              LEARNING VELOCITY
            </span>
            <span className="text-4xl font-bold text-white mb-1 font-sans">
              High
            </span>
            <span className="text-xs text-white/35 font-sans font-medium">
              Optimized path acceleration
            </span>
          </div>

          <div className="border-t border-white/15 pt-6 flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2 font-semibold">
              PREDICTED GAP RISK
            </span>
            <span className="text-4xl font-bold text-white mb-1 font-sans">
              Medium
            </span>
            <span className="text-xs text-white/35 font-sans font-medium">
              Misconceptions addressed
            </span>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 border-t border-white/5 text-left" id="features">
          <h2 className="text-5xl md:text-[64px] font-black text-white tracking-[-0.04em] mb-16 font-sans leading-none">
            Built different.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/[0.04] border border-white/[0.08] p-8 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-white/[0.18] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-none group cursor-default">
              <div>
                <div className="mb-8 text-white">
                  <svg className="w-5 h-5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2.5 font-sans">
                  Concept Mapping
                </h3>
                <p className="text-[13px] text-white/42 leading-relaxed font-sans">
                  Real-time visualization of knowledge structures, dependencies, and decay rates.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/[0.04] border border-white/[0.08] p-8 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-white/[0.18] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-none group cursor-default">
              <div>
                <div className="mb-8 text-white">
                  <svg className="w-5 h-5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2.5 font-sans">
                  Misconception Isolation
                </h3>
                <p className="text-[13px] text-white/42 leading-relaxed font-sans">
                  Pinpoints specific weak concepts causing failure cascades in future modules.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/[0.04] border border-white/[0.08] p-8 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-white/[0.18] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-none group cursor-default">
              <div>
                <div className="mb-8 text-white">
                  <svg className="w-5 h-5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2.5 font-sans">
                  Predictive Analytics
                </h3>
                <p className="text-[13px] text-white/42 leading-relaxed font-sans">
                  Forecasts future performance risks and memory decay before failure occurs.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/[0.04] border border-white/[0.08] p-8 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-white/[0.18] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-none group cursor-default">
              <div>
                <div className="mb-8 text-white">
                  <svg className="w-5 h-5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 9h8.25L9.75 20.25 12 15H3.75z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2.5 font-sans">
                  Adaptive Remediation
                </h3>
                <p className="text-[13px] text-white/42 leading-relaxed font-sans">
                  Re-routes paths dynamically to address root-cause gaps with precision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline/Process Section */}
        <div className="py-24 border-t border-white/5 text-left" id="technology">
          <div className="mb-16">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35 block mb-3 font-sans">
              OPERATIONAL LOOP
            </span>
            <h2 className="text-5xl md:text-[64px] font-black text-white tracking-[-0.04em] font-sans leading-none">
              The Pipeline.
            </h2>
          </div>

          <div className="relative pt-6">
            {/* Horizontal Timeline Line */}
            <div className="absolute top-[31px] left-0 right-0 h-[1px] bg-white/15 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col relative pt-8">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 -translate-y-[5.5px] rounded-full bg-white/20" />
                <span className="text-[14px] font-bold tracking-[0.1em] text-[#C9A96E] font-sans mb-3 block">
                  01
                </span>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest font-sans">
                  Ingestion
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed font-sans max-w-[170px]">
                  Diagnostic testing maps existing cognitive profiles.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col relative pt-8">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 -translate-y-[5.5px] rounded-full bg-white/20" />
                <span className="text-[14px] font-bold tracking-[0.1em] text-[#C9A96E] font-sans mb-3 block">
                  02
                </span>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest font-sans">
                  Detection
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed font-sans max-w-[170px]">
                  Machine learning identifies hidden misconception patterns.
                </p>
              </div>

              {/* Step 3 (Active step with electric blue glow) */}
              <div className="flex flex-col relative pt-8">
                {/* Glowing Active dot on the timeline line */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 -translate-y-[5.5px] rounded-full bg-[#06B6D4] shadow-[0_0_12px_#06B6D4]" />
                <span className="text-[14px] font-bold tracking-[0.15em] text-[#06B6D4] font-sans mb-3 block drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  03
                </span>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest font-sans">
                  Analysis
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed font-sans max-w-[170px]">
                  Deep network mapping determines dependency cascade risks.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col relative pt-8">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 -translate-y-[5.5px] rounded-full bg-white/20" />
                <span className="text-[14px] font-bold tracking-[0.1em] text-[#C9A96E] font-sans mb-3 block">
                  04
                </span>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest font-sans">
                  Routing
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed font-sans max-w-[170px]">
                  Custom optimization vectors redirect learning paths.
                </p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col relative pt-8">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 -translate-y-[5.5px] rounded-full bg-white/20" />
                <span className="text-[14px] font-bold tracking-[0.1em] text-[#C9A96E] font-sans mb-3 block">
                  05
                </span>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest font-sans">
                  Reinforcement
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed font-sans max-w-[170px]">
                  Targeted active recall strengthens neural consolidation.
                </p>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col relative pt-8">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 -translate-y-[5.5px] rounded-full bg-white/20" />
                <span className="text-[14px] font-bold tracking-[0.1em] text-[#C9A96E] font-sans mb-3 block">
                  06
                </span>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest font-sans">
                  Prediction
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed font-sans max-w-[170px]">
                  Real-time forecasting models predict retention decay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
