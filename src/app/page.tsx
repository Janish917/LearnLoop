"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Glow } from "@/components/ui/glow";
import { Sparkles, Palette, Type, Layers, RefreshCw } from "lucide-react";

// Dynamically import Three.js scene with SSR disabled
const LoopSphere = dynamic(() => import("@/components/canvas/loop-sphere"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] md:h-[420px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-6 h-6 text-[#14B8A6] animate-spin" />
        <span className="text-xs text-muted-foreground font-body">Initializing R3F Canvas...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Design Foundation Showcase */}
      <Section variant="background" className="min-h-[85vh] flex items-center" spacing="none">
        {/* Glow Effects */}
        <Glow color="purple" size="xl" className="-top-40 -left-40 opacity-40" />
        <Glow color="teal" size="lg" className="top-1/3 -right-20 opacity-30" />
        <Glow color="mixed" size="xl" className="bottom-0 left-1/3 opacity-20" />

        <Container size="lg" className="relative z-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Typography and Actions Column */}
            <div className="lg:col-span-7 flex flex-col space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/5 text-[#14B8A6] text-xs font-semibold tracking-wide w-fit"
              >
                <Sparkles className="w-3.5 h-3.5" />
                FOUNDATION DESIGN SYSTEM READY
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
              >
                The Future of AI is{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5B4BDB] via-[#14B8A6] to-[#F59E0B]">
                  Iterative
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-body text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                Welcome to the foundation of LearnLoop AI. Built with Next.js 15,
                Tailwind CSS, Framer Motion, GSAP, and React Three Fiber, this system has been designed 
                to support ultra-premium, high-performance interactions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Button variant="primary" size="lg" glow>
                  Get Started
                </Button>
                <Button variant="secondary" size="lg">
                  Explore Components
                </Button>
              </motion.div>
            </div>

            {/* 3D Canvas Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center items-center relative"
            >
              <LoopSphere />
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Component System Showcase */}
      <Section variant="secondary-bg" spacing="md" hasBorderTop>
        <Container size="lg">
          <div className="flex flex-col space-y-4 mb-16 text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
              System Components
            </h2>
            <p className="font-body text-muted-foreground text-sm md:text-base">
              A high-end foundation library engineered with responsiveness, modular aesthetics, and fluid interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Color Palette Card */}
            <Card glowColor="purple">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-[#5B4BDB]/10 border border-[#5B4BDB]/25 flex items-center justify-center text-[#5B4BDB] mb-3">
                  <Palette className="w-5 h-5" />
                </div>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>Premium curated color tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#050816] border border-white/10" />
                  <span className="text-xs font-body text-white/80">Background (#050816)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0B1020] border border-white/10" />
                  <span className="text-xs font-body text-white/80">Card BG (#0B1020)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#5B4BDB]" />
                  <span className="text-xs font-body text-white/80">Primary Purple (#5B4BDB)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#14B8A6]" />
                  <span className="text-xs font-body text-white/80">Secondary Teal (#14B8A6)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F59E0B]" />
                  <span className="text-xs font-body text-white/80">Accent Gold (#F59E0B)</span>
                </div>
              </CardContent>
            </Card>

            {/* Typography Card */}
            <Card glowColor="teal">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/25 flex items-center justify-center text-[#14B8A6] mb-3">
                  <Type className="w-5 h-5" />
                </div>
                <CardTitle>Typography System</CardTitle>
                <CardDescription>Dual-font scale for contrast</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-[#14B8A6] uppercase tracking-wider font-semibold">Heading Font</p>
                  <p className="font-heading text-lg font-bold text-white">Space Grotesk - H1-H6</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#14B8A6] uppercase tracking-wider font-semibold">Body Font</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Inter - Designed for optimal readability across device displays.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interactions Card */}
            <Card glowColor="gold">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/25 flex items-center justify-center text-[#F59E0B] mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <CardTitle>Button Library</CardTitle>
                <CardDescription>High-fidelity tactile UI assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex flex-wrap gap-2 pt-2">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="teal" size="sm">Teal</Button>
                <Button variant="gold" size="sm">Gold</Button>
                <Button variant="glass" size="sm">Glass</Button>
                <Button variant="outline" size="sm">Outline</Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
