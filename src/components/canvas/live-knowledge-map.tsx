"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, TrendingUp, Cpu } from "lucide-react";

export default function LiveKnowledgeMap() {
  return (
    <div className="relative w-full aspect-[5/4] max-w-[620px] overflow-hidden z-10 select-none">
      
      {/* Volumetric Champagne and Burgundy atmospheric glows */}
      <div className="absolute top-[30%] left-[25%] w-[120px] h-[120px] bg-[#C9A882]/8 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute top-[25%] right-[20%] w-[150px] h-[150px] bg-[#8B1A38]/10 rounded-full blur-[70px] pointer-events-none" />
      
      {/* 2 Scrolling scanlines suggestion of active intelligence */}
      <div className="scanline-container opacity-[0.03]">
        <div className="scanline" />
        <div className="scanline" />
      </div>

      {/* SVG Knowledge Graph */}
      <svg className="w-full h-full p-4" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
        
        {/* Glow Filters */}
        <defs>
          <filter id="white-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="burgundy-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="failure-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= EDGES (CONNECTIONS) ================= */}
        
        {/* Mastered Edges (Static, Ivory 25% opacity) */}
        <line x1="80" y1="120" x2="90" y2="280" stroke="rgba(245, 237, 224, 0.25)" strokeWidth="1" className="animate-edge-draw" style={{ animationDelay: "0.08s" }} />
        <line x1="80" y1="120" x2="210" y2="200" stroke="rgba(245, 237, 224, 0.25)" strokeWidth="1" className="animate-edge-draw" style={{ animationDelay: "0.16s" }} />
        <line x1="90" y1="280" x2="210" y2="200" stroke="rgba(245, 237, 224, 0.25)" strokeWidth="1" className="animate-edge-draw" style={{ animationDelay: "0.24s" }} />

        {/* Unvisited Edges (Dashed, Ivory 10% opacity) */}
        <line x1="340" y1="130" x2="310" y2="340" stroke="rgba(245, 237, 224, 0.1)" strokeWidth="1" strokeDasharray="3,3" className="animate-edge-draw" style={{ animationDelay: "0.48s" }} />
        <line x1="310" y1="340" x2="450" y2="340" stroke="rgba(245, 237, 224, 0.1)" strokeWidth="1" strokeDasharray="3,3" className="animate-edge-draw" style={{ animationDelay: "0.56s" }} />
        <line x1="420" y1="240" x2="450" y2="340" stroke="rgba(245, 237, 224, 0.1)" strokeWidth="1" strokeDasharray="3,3" className="animate-edge-draw" style={{ animationDelay: "0.4s" }} />

        {/* Misconception Propagation Path (Burgundy, Dashed, animated signal flow) */}
        <path
          d="M 210 200 L 340 130 L 420 240 L 500 120"
          fill="none"
          stroke="#8B1A38"
          strokeWidth="1.5"
          strokeDasharray="6,4"
          className="animate-signal-flow animate-edge-draw"
          style={{ animationDelay: "0.32s" }}
        />

        {/* Traveling Glowing Dot Signal (Recursion -> Trees -> DFS -> DP) */}
        <circle r="4.5" fill="#8B1A38" filter="url(#burgundy-glow)">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M 210 200 L 340 130 L 420 240 L 500 120"
            keyTimes="0; 0.44; 0.76; 1"
            keyPoints="0; 0; 1; 1"
            calcMode="linear"
          />
          <animate
            attributeName="opacity"
            values="0; 0; 1; 1; 0; 0"
            keyTimes="0; 0.43; 0.45; 0.76; 0.78; 1"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* ================= NODES ================= */}
        
        {/* Arrays (Mastered) */}
        <g className="animate-node-in" style={{ animationDelay: "0s" }}>
          <circle cx="80" cy="120" r="24" fill="#0C0608" stroke="#F5EDE0" strokeWidth="1.5" filter="url(#white-glow)" />
          <circle cx="80" cy="120" r="24" fill="#F5EDE0" opacity="0.08" />
          <text x="80" y="123" textAnchor="middle" fill="#F5EDE0" fontSize="10" fontWeight="600" letterSpacing="0.05em">Arrays</text>
        </g>

        {/* Sorting (Mastered) */}
        <g className="animate-node-in" style={{ animationDelay: "0.08s" }}>
          <circle cx="90" cy="280" r="20" fill="#0C0608" stroke="#F5EDE0" strokeWidth="1.5" filter="url(#white-glow)" />
          <circle cx="90" cy="280" r="20" fill="#F5EDE0" opacity="0.08" />
          <text x="90" y="283" textAnchor="middle" fill="#F5EDE0" fontSize="9" fontWeight="600" letterSpacing="0.05em">Sorting</text>
        </g>

        {/* Recursion (Weak - starting point of misconception) */}
        <g className="animate-node-in animate-weak-pulse" style={{ animationDelay: "0.16s" }}>
          <circle cx="210" cy="200" r="22" fill="#0C0608" stroke="#8B1A38" strokeWidth="2" filter="url(#burgundy-glow)" />
          <circle cx="210" cy="200" r="22" fill="#8B1A38" opacity="0.15" />
          <text x="210" y="203" textAnchor="middle" fill="#F5EDE0" fontSize="9" fontWeight="700" letterSpacing="0.05em">Recursion</text>
        </g>

        {/* Trees (Failure) */}
        <g className="animate-node-in animate-failure-pulse" style={{ animationDelay: "0.24s" }}>
          <circle cx="340" cy="130" r="18" fill="#0C0608" stroke="#C4526A" strokeWidth="1.5" filter="url(#failure-glow)" />
          <circle cx="340" cy="130" r="18" fill="#C4526A" opacity="0.1" />
          <text x="340" y="133" textAnchor="middle" fill="#C4526A" fontSize="9" fontWeight="600" letterSpacing="0.05em">Trees</text>
        </g>

        {/* DFS (Failure) */}
        <g className="animate-node-in animate-failure-pulse" style={{ animationDelay: "0.32s" }}>
          <circle cx="420" cy="240" r="18" fill="#0C0608" stroke="#C4526A" strokeWidth="1.5" filter="url(#failure-glow)" />
          <circle cx="420" cy="240" r="18" fill="#C4526A" opacity="0.1" />
          <text x="420" y="243" textAnchor="middle" fill="#C4526A" fontSize="9" fontWeight="600" letterSpacing="0.05em">DFS</text>
        </g>

        {/* Dynamic Programming (Failure) */}
        <g className="animate-node-in animate-failure-pulse" style={{ animationDelay: "0.40s" }}>
          <circle cx="500" cy="120" r="24" fill="#0C0608" stroke="#C4526A" strokeWidth="1.5" filter="url(#failure-glow)" />
          <circle cx="500" cy="120" r="24" fill="#C4526A" opacity="0.1" />
          <text x="500" y="122" textAnchor="middle" fill="#C4526A" fontSize="8" fontWeight="600" letterSpacing="0.05em">DP</text>
        </g>

        {/* Graphs (Unvisited) */}
        <g className="animate-node-in" style={{ animationDelay: "0.48s" }}>
          <circle cx="310" cy="340" r="18" fill="rgba(245,237,224,0.03)" stroke="rgba(245,237,224,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <text x="310" y="343" textAnchor="middle" fill="rgba(245,237,224,0.3)" fontSize="9" fontWeight="500" letterSpacing="0.05em">Graphs</text>
        </g>

        {/* BFS (Unvisited) */}
        <g className="animate-node-in" style={{ animationDelay: "0.56s" }}>
          <circle cx="450" cy="340" r="18" fill="rgba(245,237,224,0.03)" stroke="rgba(245,237,224,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <text x="450" y="343" textAnchor="middle" fill="rgba(245,237,224,0.3)" fontSize="9" fontWeight="500" letterSpacing="0.05em">BFS</text>
        </g>
      </svg>

      {/* ================= FLOATING DATA CARDS ================= */}
      
      {/* Card 1 — Anchored near Recursion Node */}
      <div className="absolute top-[21%] left-[4%] w-[170px] bg-[#120A0C]/95 border border-[#F5EDE0]/10 p-3 rounded-none shadow-[0_0_20px_rgba(139,26,56,0.08)] animate-card-slide pointer-events-none">
        <div className="flex items-center gap-1.5 mb-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-[#8B1A38]" />
          <span className="text-[9px] uppercase tracking-[0.15em] text-[#8B1A38] font-bold">
            Weak Concept
          </span>
        </div>
        <div className="text-xs font-bold text-[#F5EDE0] mb-1.5">Recursion</div>
        <div className="flex items-center justify-between text-[10px] text-[#F5EDE0]/50 mb-1">
          <span>Understanding</span>
          <span className="text-[#F5EDE0] font-medium">34%</span>
        </div>
        <div className="w-full h-1 bg-[#F5EDE0]/10 rounded-none flex">
          <div className="h-full bg-[#8B1A38]" style={{ width: "34%" }} />
        </div>
      </div>

      {/* Card 2 — Anchored near Dynamic Programming Node */}
      <div className="absolute top-[44%] left-[64%] w-[175px] bg-[#120A0C]/95 border border-[#F5EDE0]/10 p-3 rounded-none shadow-[0_0_20px_rgba(196,82,106,0.06)] animate-card-slide pointer-events-none" style={{ animationDelay: "0.12s" }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#C4526A]" />
          <span className="text-[9px] uppercase tracking-[0.15em] text-[#C4526A] font-bold">
            Predicted Failure
          </span>
        </div>
        <div className="text-xs font-bold text-[#F5EDE0] mb-1">Dynamic Programming</div>
        <div className="flex items-center justify-between text-[10px] text-[#F5EDE0]/50">
          <span>Risk Score</span>
          <span className="text-[#C4526A] font-bold uppercase tracking-wider text-[9px]">
            High &rarr;
          </span>
        </div>
      </div>

      {/* Card 3 — Top Right of Graph */}
      <div className="absolute top-[4%] right-[4%] w-[190px] bg-[#120A0C]/90 border border-[#F5EDE0]/10 p-3 rounded-none shadow-[0_4px_30px_rgba(0,0,0,0.8)] animate-card-slide pointer-events-none" style={{ animationDelay: "0.06s" }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] uppercase tracking-[0.18em] text-[#F5EDE0]/40 font-semibold">
            Understanding Score
          </span>
          <div className="flex items-center gap-0.5 text-[#C4526A] text-[10px] font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>+2.3%</span>
          </div>
        </div>
        <div className="text-xl font-bold text-[#F5EDE0] mb-1.5">87%</div>
        <div className="w-full h-1 bg-[#F5EDE0]/10 rounded-none flex">
          <div className="h-full bg-gradient-to-r from-[#8B1A38] to-[#C4526A]" style={{ width: "87%" }} />
        </div>
      </div>

      {/* Card 4 — Bottom of Graph */}
      <div className="absolute bottom-[4%] left-[4%] right-[4%] bg-[#120A0C]/95 border border-[#F5EDE0]/10 px-4 py-2.5 rounded-none flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.8)] animate-card-slide pointer-events-none" style={{ animationDelay: "0.18s" }}>
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#8B1A38]" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#8B1A38] font-bold">
            Misconception Path
          </span>
        </div>
        <span className="font-mono text-[9px] text-[#F5EDE0]/60 tracking-wider">
          Recursion &rarr; Trees &rarr; DFS &rarr; DP
        </span>
      </div>

      {/* Style overrides / keyframes */}
      <style jsx global>{`
        /* Dashed edge flow animation */
        .animate-signal-flow {
          animation: signal-flow-dash 30s linear infinite;
        }
        @keyframes signal-flow-dash {
          to {
            stroke-dashoffset: -1000;
          }
        }

        /* 5s staggered animations for premium visual loops */
        .animate-node-in {
          animation: node-fade 5s infinite ease-in-out;
          transform-origin: center;
        }
        .animate-edge-draw {
          animation: edge-fade 5s infinite ease-in-out;
        }
        .animate-weak-pulse {
          animation: weak-pulse 5s infinite ease-in-out;
          transform-origin: 210px 200px;
        }
        .animate-failure-pulse {
          animation: failure-pulse 5s infinite ease-in-out;
        }

        /* Node group position origins for scaling */
        g:nth-of-type(1) { transform-origin: 80px 120px; }
        g:nth-of-type(2) { transform-origin: 90px 280px; }
        g:nth-of-type(4) { transform-origin: 340px 130px; }
        g:nth-of-type(5) { transform-origin: 420px 240px; }
        g:nth-of-type(6) { transform-origin: 500px 120px; }
        g:nth-of-type(7) { transform-origin: 310px 340px; }
        g:nth-of-type(8) { transform-origin: 450px 340px; }

        @keyframes node-fade {
          0% { opacity: 0; transform: scale(0.8); }
          6% { opacity: 1; transform: scale(1); }
          95% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }

        @keyframes edge-fade {
          0% { opacity: 0; }
          16% { opacity: 0; }
          32% { opacity: 1; }
          95% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes weak-pulse {
          0%, 32% { filter: drop-shadow(0 0 0px rgba(139,26,56,0)); transform: scale(1); }
          38%, 46% { filter: drop-shadow(0 0 16px rgba(139,26,56,0.7)); transform: scale(1.06); }
          52%, 95% { filter: drop-shadow(0 0 4px rgba(139,26,56,0.35)); transform: scale(1); }
          100% { opacity: 0; }
        }

        @keyframes failure-pulse {
          0%, 54% { filter: drop-shadow(0 0 0px rgba(196,82,106,0)); opacity: 1; }
          /* subtle dimming cascade as signal hits downstream nodes */
          56% { filter: drop-shadow(0 0 14px rgba(196,82,106,0.7)); opacity: 0.65; }
          95% { opacity: 0.45; filter: drop-shadow(0 0 8px rgba(196,82,106,0.35)); }
          100% { opacity: 0; }
        }

        .animate-card-slide {
          animation: card-slide-anim 5s infinite cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes card-slide-anim {
          0%, 82% { opacity: 0; transform: translateY(12px); }
          86%, 95% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
