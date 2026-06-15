"use client";

import React, { useEffect } from "react";
import * as THREE from "three";

interface Concept {
  id: string;
  label: string;
  mastery: number;
  status: "mastered" | "learning" | "weak" | "critical";
  top: string;
  left: string;
}

const CONCEPTS: Concept[] = [
  { id: "arrays",       label: "Arrays",            mastery: 95, status: "mastered", top: "10%", left: "58%" },
  { id: "linkedlist",   label: "Linked Lists",       mastery: 88, status: "mastered", top: "18%", left: "74%" },
  { id: "trees",        label: "Trees",              mastery: 87, status: "learning", top: "32%", left: "84%" },
  { id: "graphs",       label: "Graphs",             mastery: 68, status: "learning", top: "52%", left: "82%" },
  { id: "dfs",          label: "DFS",                mastery: 55, status: "weak",     top: "68%", left: "70%" },
  { id: "bfs",          label: "BFS",                mastery: 60, status: "weak",     top: "76%", left: "54%" },
  { id: "recursion",    label: "Recursion",          mastery: 32, status: "critical", top: "72%", left: "34%" },
  { id: "dp",           label: "Dynamic Prog.",      mastery: 28, status: "critical", top: "58%", left: "18%" },
  { id: "os",           label: "OS",                 mastery: 80, status: "learning", top: "36%", left: "14%" },
  { id: "databases",    label: "Databases",          mastery: 91, status: "mastered", top: "18%", left: "28%" },
  { id: "sysdesign",    label: "System Design",      mastery: 74, status: "learning", top: "44%", left: "88%" },
];

const statusColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  mastered: { bg: "rgba(34, 197, 94, 0.12)",  border: "rgba(34, 197, 94, 0.35)",  text: "#22C55E", glow: "34,197,94" },
  learning: { bg: "rgba(56, 189, 248, 0.12)",  border: "rgba(56, 189, 248, 0.35)",  text: "#38BDF8", glow: "56,189,248" },
  weak:     { bg: "rgba(245, 158, 11, 0.12)",  border: "rgba(245, 158, 11, 0.35)",  text: "#F59E0B", glow: "245,158,11" },
  critical: { bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.40)",  text: "#EF4444", glow: "239,68,68" },
};

export default function Home() {
  const [activeStep, setActiveStep] = React.useState(1); // Default to Week 3 (misconception detected)

  useEffect(() => {
    const timeoutIds: number[] = [];
    let flowDiagramIntervalId: ReturnType<typeof setInterval> | null = null;
    let ambLoopId: number;
    let flowAnimationFrameId: number;
    let ambRenderer: THREE.WebGLRenderer | null = null;
    let handleResizeListener = () => {};
    let drawOrbitalsRef: ((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void) | null = null;
    const driftAFIds: number[] = new Array(CONCEPTS.length);
    let stormTimeoutIds: number[] = [];
    
    // Hover bridge tracking
    const hoverBridgeElements: Element[] = [];
    const mouseEnterHandlers = new Map<Element, () => void>();
    const mouseLeaveHandlers = new Map<Element, () => void>();
    let timelineObserver: IntersectionObserver | null = null;
    let cascadeObserver: IntersectionObserver | null = null;
    let hiwObserver: IntersectionObserver | null = null;
    let spObserver: IntersectionObserver | null = null;
    let heroCascadeObserver: IntersectionObserver | null = null;
    let examplePanelIntervalId: ReturnType<typeof setInterval> | null = null;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const links = document.querySelectorAll(".nav-links a");
      links.forEach(link => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const targetId = href.slice(1);
        const el = document.getElementById(targetId);
        if (!el) return;
        const top = el.offsetTop - 120;
        const bot = top + el.offsetHeight;
        if (scrollY >= top && scrollY < bot) {
          links.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    };

    // Helper to push and track timers
    const addTimeout = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      timeoutIds.push(id);
      return id;
    };



    // Draw SVG connection edges
    const drawEdges = () => {
      const svg = document.getElementById("edges-svg");
      const container = document.querySelector(".map-container");
      const core = document.querySelector(".intel-core");
      if (!svg || !container || !core) return;

      svg.innerHTML = "";

      const rect = container.getBoundingClientRect();
      const coreRect = core.getBoundingClientRect();
      const cx = coreRect.left - rect.left + coreRect.width / 2;
      const cy = coreRect.top - rect.top + coreRect.height / 2;

      const criticalPath = ["recursion", "trees", "dfs", "dp"];

      CONCEPTS.forEach((c, index) => {
        const nodeEl = document.getElementById("node-" + c.id);
        if (!nodeEl) return;

        const nRect = nodeEl.getBoundingClientRect();
        const nx = nRect.left - rect.left + nRect.width / 2;
        const ny = nRect.top - rect.top + nRect.height / 2;

        const isCritical = criticalPath.includes(c.id);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", cx.toString());
        line.setAttribute("y1", cy.toString());
        line.setAttribute("x2", nx.toString());
        line.setAttribute("y2", ny.toString());
        line.setAttribute("data-node", c.id);
        line.setAttribute(
          "stroke",
          isCritical ? "rgba(239, 68, 68, 0.35)" : "rgba(232, 244, 253, 0.07)"
        );
        line.setAttribute("stroke-width", isCritical ? "1.5" : "1");

        if (isCritical) {
          line.setAttribute("stroke-dasharray", "4 4");
          line.style.animation = "criticalEdgeBreathe 1.8s ease-in-out infinite";
        } else {
          const delay = index * 0.18;
          line.style.animation = `edgeBreathe ${2.5 + (index % 3) * 0.5}s ease-in-out ${delay}s infinite`;
        }

        svg.appendChild(line);
      });
    };

    // Node drift motion loop
    const startNodeDrift = () => {
      CONCEPTS.forEach((c, i) => {
        const el = document.getElementById("node-" + c.id);
        if (!el) return;

        const phase = (i / CONCEPTS.length) * Math.PI * 2;
        const amp = 3 + (i % 4);
        const speed = 0.0006 + (i * 0.00004);

        const drift = () => {
          const t = performance.now();
          const dx = Math.sin(t * speed + phase) * amp;
          const dy = Math.cos(t * speed * 0.73 + phase + 1) * amp * 0.65;

          el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
          driftAFIds[i] = requestAnimationFrame(drift);
        };
        drift();
      });
    };

    // Canvas Particles Layer
    let particles: Particle[] = [];

    class Particle {
      fromId: string;
      toId: string;
      color: string;
      x: number;
      y: number;
      tx: number;
      ty: number;
      progress: number;
      speed: number;
      size: number;
      alpha: number;
      isBurst?: boolean;
      spawnTime?: number;

      constructor(fromId: string, toId: string, color: string) {
        const container = document.querySelector(".map-container");
        if (!container) {
          this.fromId = fromId; this.toId = toId; this.color = color;
          this.x = 0; this.y = 0; this.tx = 0; this.ty = 0;
          this.progress = 0; this.speed = 0; this.size = 0; this.alpha = 0;
          return;
        }
        const cr = container.getBoundingClientRect();
        
        const fromEl = document.getElementById("node-" + fromId) 
                       || document.querySelector(".intel-core");
        const toEl   = document.getElementById("node-" + toId)   
                       || document.querySelector(".intel-core");
        
        if (!fromEl || !toEl) {
          this.fromId = fromId; this.toId = toId; this.color = color;
          this.x = 0; this.y = 0; this.tx = 0; this.ty = 0;
          this.progress = 0; this.speed = 0; this.size = 0; this.alpha = 0;
          return;
        }

        const fr = fromEl.getBoundingClientRect();
        const tr = toEl.getBoundingClientRect();
        
        this.fromId = fromId;
        this.toId = toId;
        this.x  = fr.left - cr.left + fr.width/2;
        this.y  = fr.top  - cr.top  + fr.height/2;
        this.tx = tr.left - cr.left + tr.width/2;
        this.ty = tr.top  - cr.top  + tr.height/2;
        this.color   = color;
        this.progress = Math.random();
        this.speed   = 0.0025 + Math.random() * 0.003;
        this.size    = 2.5;
        this.alpha   = 0;
      }

      update() {
        if (this.isBurst && this.spawnTime !== undefined) {
          const elapsed = performance.now() - this.spawnTime;
          this.progress = elapsed / 800;
          this.alpha = 1 - elapsed / 800;
        } else {
          this.progress += this.speed;
          if (this.progress > 1) this.progress = 0;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const t = this.progress;
        const cx = this.x + (this.tx - this.x) * t;
        const cy = this.y + (this.ty - this.y) * t;
        const currentAlpha = (this.isBurst && this.alpha !== undefined)
          ? Math.max(0, this.alpha)
          : Math.sin(t * Math.PI) * 0.9;

        ctx.beginPath();
        ctx.arc(cx, cy, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();

        // glow halo
        ctx.beginPath();
        ctx.arc(cx, cy, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = currentAlpha * 0.2;
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    }

    const initParticles = () => {
      const flowCanvas = document.getElementById("flow-canvas") as HTMLCanvasElement;
      if (!flowCanvas) return;
      const flowCtx = flowCanvas.getContext("2d");
      const container = flowCanvas.parentElement;
      const core = document.querySelector(".intel-core");
      if (!flowCtx || !container || !core) return;

      const resizeCanvas = () => {
        const c = container.getBoundingClientRect();
        flowCanvas.width = c.width;
        flowCanvas.height = c.height;
      };
      resizeCanvas();

      const PARTICLE_PATHS = [
        /* mastered nodes → core: green particles */
        { from: "arrays",     to: "core", color: "rgba(34, 197, 94, 0.85)",  count: 2 },
        { from: "databases",  to: "core", color: "rgba(34, 197, 94, 0.85)",  count: 2 },
        { from: "linkedlist", to: "core", color: "rgba(34, 197, 94, 0.85)",  count: 2 },

        /* learning nodes → core: blue particles */
        { from: "os",         to: "core", color: "rgba(56, 189, 248, 0.85)", count: 2 },
        { from: "trees",      to: "core", color: "rgba(56, 189, 248, 0.85)", count: 2 },
        { from: "graphs",     to: "core", color: "rgba(56, 189, 248, 0.85)", count: 2 },
        { from: "sysdesign",  to: "core", color: "rgba(56, 189, 248, 0.85)", count: 2 },

        /* weak nodes → core: amber particles */
        { from: "dfs",        to: "core", color: "rgba(245, 158, 11, 0.85)", count: 3 },
        { from: "bfs",        to: "core", color: "rgba(245, 158, 11, 0.85)", count: 2 },

        /* critical nodes → core: red particles, more count */
        { from: "recursion",  to: "core", color: "rgba(239, 68, 68, 0.95)",  count: 5 },
        { from: "dp",         to: "core", color: "rgba(239, 68, 68, 0.95)",  count: 5 },
      ];

      particles = [];
      PARTICLE_PATHS.forEach(p => {
        for (let i = 0; i < p.count; i++) {
          particles.push(new Particle(p.from, p.to, p.color));
        }
      });

      const emitHoverParticles = (nodeTarget: Element) => {
        const status = nodeTarget.getAttribute("data-status") || "";
        let color = "rgba(232, 244, 253, 0.4)";
        if (status === "mastered") color = "rgba(34, 197, 94, 0.85)";
        else if (status === "learning") color = "rgba(56, 189, 248, 0.85)";
        else if (status === "weak") color = "rgba(245, 158, 11, 0.85)";
        else if (status === "critical") color = "rgba(239, 68, 68, 0.95)";

        const now = performance.now();
        const nodeId = nodeTarget.id.replace("node-", "");
        for (let i = 0; i < 6; i++) {
          const p = new Particle(nodeId, "core", color);
          p.isBurst = true;
          p.spawnTime = now;
          p.alpha = 1;
          p.speed = 0.006 + Math.random() * 0.006;
          p.size = 2.0;
          particles.push(p);
        }
      };

      document.querySelectorAll(".node").forEach(node => {
        node.addEventListener("mouseenter", () => emitHoverParticles(node));
      });

      const loop = () => {
        flowCtx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
        const now = performance.now();
        particles = particles.filter(p => {
          if (p.isBurst && p.spawnTime !== undefined) {
            const elapsed = now - p.spawnTime;
            if (elapsed >= 800) return false;
          }
          return true;
        });
        particles.forEach(p => {
          p.update();
          p.draw(flowCtx);
        });
        if (typeof drawOrbitalsRef === "function") {
          drawOrbitalsRef(flowCtx, flowCanvas);
        }
        flowAnimationFrameId = requestAnimationFrame(loop);
      };
      loop();
    };

    const animateScore = () => {
      const el = document.getElementById("score-counter");
      const fill = document.querySelector(".core-bar-fill") as HTMLElement;
      const leftScore = document.getElementById("left-score");
      if (!el) return;

      el.textContent = "0%";
      if (leftScore) leftScore.textContent = "0%";

      const startTime = performance.now();
      const duration = 2600;
      const target = 87;

      function easeOutQuart(t: number) {
        return 1 - Math.pow(1 - t, 4);
      }

      function tick(now: number) {
        if (!el) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const value = Math.floor(eased * target);
        
        el.textContent = value + "%";
        if (leftScore) leftScore.textContent = value + "%";
        if (fill) fill.style.width = (eased * target) + "%";
        
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = "87%";
          if (leftScore) leftScore.textContent = "87%";
        }
      }
      requestAnimationFrame(tick);
    };

    const startOrbitalParticles = () => {
      const orbitals = [
        // Inner shell — 3 particles, faster
        { angle:0.0,          radius:145, speed:0.006,  size:1.6, color:'rgba(20,184,166,0.95)'  },
        { angle:Math.PI*0.66, radius:145, speed:0.006,  size:1.2, color:'rgba(91,75,219,0.85)'   },
        { angle:Math.PI*1.33, radius:145, speed:0.006,  size:1.4, color:'rgba(56,189,248,0.80)'  },
        
        // Middle shell — 3 particles, medium
        { angle:Math.PI*0.25, radius:178, speed:0.0038, size:1.8, color:'rgba(20,184,166,0.70)'  },
        { angle:Math.PI*1.0,  radius:178, speed:0.0038, size:1.3, color:'rgba(91,75,219,0.75)'   },
        { angle:Math.PI*1.75, radius:178, speed:0.0038, size:1.5, color:'rgba(56,189,248,0.65)'  },
        
        // Outer shell — 2 particles, slowest
        { angle:Math.PI*0.5,  radius:210, speed:0.0022, size:1.1, color:'rgba(20,184,166,0.45)'  },
        { angle:Math.PI*1.5,  radius:210, speed:0.0022, size:0.9, color:'rgba(91,75,219,0.40)'   },
      ];
      
      drawOrbitalsRef = (ctx) => {
        const canvasEl  = document.getElementById('flow-canvas') as HTMLCanvasElement;
        if (!canvasEl) return;
        const cr        = canvasEl.getBoundingClientRect();
        const coreEl    = document.querySelector('.intel-core');
        if (!coreEl) return;
        const nr        = coreEl.getBoundingClientRect();
        const center = {
          x: nr.left - cr.left + nr.width  / 2,
          y: nr.top  - cr.top  + nr.height / 2,
        };

        orbitals.forEach(o => {
          o.angle += o.speed;
          const x = center.x + Math.cos(o.angle) * o.radius;
          const y = center.y + Math.sin(o.angle) * o.radius * 0.32;

          // core dot
          ctx.beginPath();
          ctx.arc(x, y, o.size, 0, Math.PI * 2);
          ctx.fillStyle = o.color;
          ctx.globalAlpha = 0.9;
          ctx.fill();

          // inner glow
          ctx.beginPath();
          ctx.arc(x, y, o.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = o.color;
          ctx.globalAlpha = 0.15;
          ctx.fill();

          // outer glow halo
          ctx.beginPath();
          ctx.arc(x, y, o.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = o.color;
          ctx.globalAlpha = 0.05;
          ctx.fill();

          ctx.globalAlpha = 1;
        });
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      const heroLeft = document.querySelector(".hero-left") as HTMLElement;
      if (heroLeft) {
        heroLeft.style.transform = `translate(${dx * -5}px, ${dy * -3}px)`;
      }

      const mapContainer = document.querySelector(".map-container") as HTMLElement;
      if (mapContainer) {
        mapContainer.style.transform = `translate(${dx * 8}px, ${dy * 5}px) rotateY(${dx * 1.5}deg) rotateX(${dy * -1}deg)`;
      }
    };
    document.addEventListener("mousemove", handleMouseMove);

    const ambientCanvas = document.getElementById("ambient-canvas") as HTMLCanvasElement;
    if (ambientCanvas && typeof THREE !== "undefined") {
      const ambScene = new THREE.Scene();
      const ambCam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      ambCam.position.z = 60;

      ambRenderer = new THREE.WebGLRenderer({
        canvas: ambientCanvas,
        antialias: true,
        alpha: true,
      });
      ambRenderer.setSize(window.innerWidth, window.innerHeight);
      ambRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Particle system 1 (Teal)
      const geo = new THREE.BufferGeometry();
      const count = 150;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 140;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      
      const mat = new THREE.PointsMaterial({
        color: 0x14B8A6,
        size: 0.25,
        transparent: true,
        opacity: 0.25,
      });
      const points1 = new THREE.Points(geo, mat);
      ambScene.add(points1);

      // Particle system 2 (Violet)
      const geo2 = new THREE.BufferGeometry();
      const count2 = 150;
      const pos2 = new Float32Array(count2 * 3);
      for (let i = 0; i < count2 * 3; i++) {
        pos2[i] = (Math.random() - 0.5) * 140;
      }
      geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));
      
      const mat2 = new THREE.PointsMaterial({
        color: 0x5B4BDB,
        size: 0.15,
        transparent: true,
        opacity: 0.15,
      });
      const points2 = new THREE.Points(geo2, mat2);
      ambScene.add(points2);

      handleResizeListener = () => {
        ambCam.aspect = window.innerWidth / window.innerHeight;
        ambCam.updateProjectionMatrix();
        if (ambRenderer) ambRenderer.setSize(window.innerWidth, window.innerHeight);
        drawEdges();
      };
      window.addEventListener("resize", handleResizeListener);

      const ambLoop = () => {
        ambLoopId = requestAnimationFrame(ambLoop);
        points1.rotation.y += 0.0003;
        points1.rotation.x = Math.sin(Date.now() * 0.0001) * 0.08;
        points2.rotation.y += 0.0002;
        points2.rotation.x = Math.sin(Date.now() * 0.0001) * 0.05;
        if (ambRenderer) ambRenderer.render(ambScene, ambCam);
      };
      ambLoop();
    }

    const setCoreStormMode = (active: boolean) => {
      const core = document.querySelector(".core-glass") as HTMLElement;
      if (!core) return;
      if (active) {
        core.style.boxShadow = `
          0 0 0 1px rgba(239, 68, 68, 0.25),
          0 0 30px rgba(239, 68, 68, 0.40),
          0 0 80px rgba(91, 75, 219, 0.25),
          0 0 160px rgba(239, 68, 68, 0.10),
          inset 0 1px 0 rgba(232, 244, 253, 0.10),
          inset 0 0 40px rgba(239, 68, 68, 0.12)
        `;
        core.style.borderColor = "rgba(239, 68, 68, 0.45)";
      } else {
        core.style.boxShadow = `
          0 0 0 1px rgba(91, 75, 219, 0.20),
          0 0 30px rgba(20, 184, 166, 0.35),
          0 0 80px rgba(91, 75, 219, 0.25),
          0 0 160px rgba(20, 184, 166, 0.10),
          inset 0 1px 0 rgba(232, 244, 253, 0.12),
          inset 0 0 40px rgba(91, 75, 219, 0.15)
        `;
        core.style.borderColor = "rgba(20, 184, 166, 0.40)";
      }
      core.style.transition = "box-shadow 600ms ease, border-color 600ms ease";
    };

    const resetStormState = () => {
      document.querySelectorAll(".node-tooltip, .dp-tooltip").forEach((el) => el.remove());

      document.querySelectorAll(".node-circle").forEach((circle) => {
        const cEl = circle as HTMLElement;
        cEl.classList.remove("is-hit", "is-critical");
        cEl.style.boxShadow = "";
      });

      document.querySelectorAll("#edges-svg line").forEach((line) => {
        const lEl = line as SVGLineElement;
        const nodeName = lEl.getAttribute("data-node") || "";
        const isCritical = ["recursion", "trees", "dfs", "dp"].includes(nodeName);
        lEl.style.opacity = isCritical ? "0.35" : "0.07";
      });

      const coreGlass = document.querySelector(".core-glass") as HTMLElement;
      if (coreGlass) {
        coreGlass.classList.remove("is-critical");
        coreGlass.style.boxShadow = "";
        coreGlass.style.borderColor = "";
      }

      setCoreStormMode(false);

      const coreAlert = document.getElementById("core-alert");
      if (coreAlert) {
        coreAlert.textContent = "";
        coreAlert.style.opacity = "0";
      }

      document.querySelectorAll(".story-impact-item").forEach(i => i.classList.remove("active"));
      const storyConcept = document.querySelector(".story-concept") as HTMLElement;
      if (storyConcept) storyConcept.style.textShadow = "none";
    };

    const showTooltip = (nodeTarget: Element, type: "warn" | "critical") => {
      const cont = document.querySelector(".map-container");
      if (!cont) return;

      const rect = cont.getBoundingClientRect();
      const nodeRect = nodeTarget.getBoundingClientRect();
      const x = nodeRect.left - rect.left + nodeRect.width / 2;
      const y = nodeRect.top - rect.top + nodeRect.height / 2;

      const tooltip = document.createElement("div");
      if (type === "critical") {
        tooltip.className = "dp-tooltip";
        tooltip.innerHTML = `
          <div style="color:#EF4444; font-weight:bold; margin-bottom:4px; letter-spacing:0.1em; font-family:var(--f-body);">◉ PREDICTED FAILURE</div>
          <div style="font-weight:700; font-size:11px; margin-bottom:4px; font-family:var(--f-body);">Dynamic Programming</div>
          <div style="width:100%; height:1px; background:rgba(232,244,253,0.1); margin:6px 0;"></div>
          <div style="color:rgba(232,244,253,0.6); font-family:var(--f-body);">Caused by: <span style="color:#EF4444;">Recursion gap</span></div>
          <div style="color:rgba(232,244,253,0.6); margin-top:2px; font-family:var(--f-body);">Risk: <span style="color:#EF4444; font-weight:bold;">CRITICAL</span></div>
          <div style="color:rgba(232,244,253,0.6); margin-top:2px; font-family:var(--f-body);">Affected: 4 future concepts</div>
        `;
      } else {
        tooltip.className = "node-tooltip";
        tooltip.innerHTML = `
          <div style="color:#14B8A6; font-weight:bold; margin-bottom:2px; letter-spacing:0.1em; font-family:var(--f-body);">⚠ MISCONCEPTION</div>
          <div style="font-weight:bold; font-family:var(--f-body);">Detected: Recursion</div>
          <div style="color:rgba(232,244,253,0.5); margin-top:2px; font-family:var(--f-body);">Mastery: 32%</div>
        `;
      }

      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      cont.appendChild(tooltip);

      setTimeout(() => tooltip.classList.add("show"), 10);
      
      if (type === "warn") {
        setTimeout(() => {
          tooltip.classList.remove("show");
          setTimeout(() => tooltip.remove(), 200);
        }, 1500);
      }
    };

    const flashNode = (nodeEl: HTMLElement, type: "warn" | "hit" | "critical") => {
      const circle = nodeEl.querySelector(".node-circle") as HTMLElement;
      if (!circle) return;

      const colors = {
        warn:     "rgba(245, 158, 11, 0.8)",
        hit:      "rgba(239, 68, 68, 0.6)",
        critical: "rgba(239, 68, 68, 1.0)",
      };

      circle.style.transition = "transform 150ms ease, box-shadow 300ms ease";
      circle.style.transform  = "scale(1.4)";
      circle.style.boxShadow  = `0 0 40px ${colors[type]}`;

      spawnShockwave(nodeEl, type === "critical" ? 2 : 1);

      setTimeout(() => {
        circle.style.transform = "scale(1)";
      }, 200);

      if (type === "warn") {
        circle.classList.add("is-hit");
        showTooltip(nodeEl, "warn");
      } else if (type === "hit") {
        circle.classList.add("is-hit");
      } else if (type === "critical") {
        circle.classList.add("is-critical");
        // Fix: Never spawn dynamic overlapping tooltip to resolve duplication of predicted failure panel
      }
    };

    const spawnShockwave = (nodeEl: Element, count = 1) => {
      const container = document.querySelector(".map-container");
      if (!container) return;
      const cr = container.getBoundingClientRect();
      const nr = nodeEl.getBoundingClientRect();
      const cx = nr.left - cr.left + nr.width / 2;
      const cy = nr.top - cr.top + nr.height / 2;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const wave = document.createElement("div");
          wave.style.cssText = `
            position:absolute;
            left:${cx}px; top:${cy}px;
            width:0; height:0;
            border-radius:50%;
            border:1.5px solid rgba(239, 68, 68, 0.7);
            transform:translate(-50%,-50%);
            pointer-events:none;
            z-index:40;
            animation: shockExpand 700ms ease-out forwards;
          `;
          container.appendChild(wave);
          setTimeout(() => wave.remove(), 700);
        }, i * 160);
      }
    };

    const travelSignal = (fromEl: Element, toEl: Element, onArrive?: () => void) => {
      const container = document.querySelector(".map-container");
      if (!container) return;
      const cr = container.getBoundingClientRect();
      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();

      const x1 = fr.left - cr.left + fr.width / 2;
      const y1 = fr.top - cr.top + fr.height / 2;
      const x2 = tr.left - cr.left + tr.width / 2;
      const y2 = tr.top - cr.top + tr.height / 2;

      const dot = document.createElement("div");
      dot.style.cssText = `
        position:absolute;
        width:10px; height:10px;
        border-radius:50%;
        background:#EF4444;
        box-shadow:0 0 20px rgba(239, 68, 68, 0.9),
                   0 0 40px rgba(239, 68, 68, 0.4);
        pointer-events:none;
        z-index:50;
        transform:translate(-50%,-50%);
      `;
      dot.style.left = x1 + "px";
      dot.style.top = y1 + "px";
      container.appendChild(dot);

      const start = performance.now();
      const dur = 520;

      function frame(now: number) {
        const t = Math.min((now - start) / dur, 1);
        const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        dot.style.left = (x1 + (x2 - x1) * e) + "px";
        dot.style.top = (y1 + (y2 - y1) * e) + "px";
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          dot.remove();
          if (onArrive) onArrive();
        }
      }
      requestAnimationFrame(frame);
    };

    const dropScore = (from: number, to: number) => {
      const el = document.getElementById("score-counter");
      const fill = document.querySelector(".core-bar-fill") as HTMLElement;
      const coreGlass = document.querySelector(".core-glass") as HTMLElement;
      const coreAlert = document.getElementById("core-alert");
      const leftScore = document.getElementById("left-score");
      const critVal   = document.querySelector(".metric-value.critical-text") as HTMLElement | null;

      if (coreGlass) coreGlass.classList.add("is-critical");
      if (coreAlert) {
        coreAlert.textContent = "4 concepts at risk";
        coreAlert.style.color = "rgba(239, 68, 68, 0.85)";
        coreAlert.style.opacity = "1";
      }

      if (!el) return;
      const start = performance.now();
      const dur = 900;
      function tick(now: number) {
        if (!el) return;
        const t = Math.min((now - start) / dur, 1);
        const v = Math.floor(from + (to - from) * t);
        el.textContent = v + "%";
        if (leftScore) leftScore.textContent = v + "%";
        if (fill) fill.style.width = v + "%";
        
        // pulse critical risks counter
        if (critVal) {
          critVal.style.textShadow = `0 0 ${t * 20}px rgba(239, 68, 68, ${t * 0.8})`;
        }
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    const riseScore = (from: number, to: number) => {
      const el = document.getElementById("score-counter");
      const fill = document.querySelector(".core-bar-fill") as HTMLElement;
      const coreGlass = document.querySelector(".core-glass") as HTMLElement;
      const coreAlert = document.getElementById("core-alert");
      const leftScore = document.getElementById("left-score");
      const critVal   = document.querySelector(".metric-value.critical-text") as HTMLElement | null;

      if (coreAlert) {
        coreAlert.textContent = "Repair path generated";
        coreAlert.style.color = "rgba(34, 197, 94, 0.85)";
        coreAlert.style.opacity = "1";
      }

      if (!el) return;
      const start = performance.now();
      const dur = 700;
      function tick(now: number) {
        if (!el) return;
        const t = Math.min((now - start) / dur, 1);
        const v = Math.floor(from + (to - from) * t);
        el.textContent = v + "%";
        if (leftScore) leftScore.textContent = v + "%";
        if (fill) fill.style.width = v + "%";
        
        // fade out critical pulse
        if (critVal) {
          critVal.style.textShadow = `0 0 ${(1 - t) * 20}px rgba(239, 68, 68, ${(1 - t) * 0.8})`;
        }

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = "87%";
          if (leftScore) leftScore.textContent = "87%";
          if (fill) fill.style.width = "87%";
          if (coreGlass) coreGlass.classList.remove("is-critical");
          if (critVal) critVal.style.textShadow = "none";
          resetStormState();
        }
      }
      requestAnimationFrame(tick);
    };

    const runMisconceptionStorm = () => {
      try {
        stormTimeoutIds.forEach((id) => clearTimeout(id));
        stormTimeoutIds = [];

        const recursionNode = document.getElementById("node-recursion");
        const treesNode = document.getElementById("node-trees");
        const dfsNode = document.getElementById("node-dfs");
        const dpNode = document.getElementById("node-dp");

        if (!recursionNode || !treesNode || !dfsNode || !dpNode) {
          const retryId = window.setTimeout(runMisconceptionStorm, 500);
          stormTimeoutIds.push(retryId);
          return;
        }

        resetStormState();

        // 1s: Recursion pulses warning
        stormTimeoutIds.push(window.setTimeout(() => flashNode(recursionNode as HTMLElement, "warn"), 1000));
        
        // Beat 2 — Recursion identified (1.0s) / add storm-active to story-root
        stormTimeoutIds.push(window.setTimeout(() => {
          const storyRoot = document.querySelector(".story-root") as HTMLElement;
          if (storyRoot) {
            storyRoot.style.opacity = "1";
            storyRoot.classList.add("storm-active");
          }
          const storyConcept = document.querySelector(".story-concept") as HTMLElement;
          if (storyConcept) storyConcept.style.textShadow = "0 0 24px rgba(239,68,68,0.6)";
        }, 1000));

        // 2.2s: signal travels Recursion → Trees
        stormTimeoutIds.push(window.setTimeout(() => {
          travelSignal(recursionNode, treesNode, () => {
            flashNode(treesNode as HTMLElement, "hit");
            const edge = document.querySelector('line[data-node="trees"]') as SVGLineElement;
            if (edge) edge.style.opacity = "0.08";
          });
        }, 2200));

        // Beat 3 — Trees hit (2.8s)
        stormTimeoutIds.push(window.setTimeout(() => {
          const items = document.querySelectorAll(".story-impact-item");
          if (items[0]) items[0].classList.add("active");
        }, 2800));
        
        // 3.0s: Trees → DFS
        stormTimeoutIds.push(window.setTimeout(() => {
          travelSignal(treesNode, dfsNode, () => {
            flashNode(dfsNode as HTMLElement, "hit");
            const edge = document.querySelector('line[data-node="dfs"]') as SVGLineElement;
            if (edge) edge.style.opacity = "0.08";
          });
        }, 3000));

        // Beat 4 — DFS hit (3.6s)
        stormTimeoutIds.push(window.setTimeout(() => {
          const items = document.querySelectorAll(".story-impact-item");
          if (items[1]) items[1].classList.add("active");
        }, 3600));
        
        // 3.8s: DFS → DP (dramatic)
        stormTimeoutIds.push(window.setTimeout(() => {
          travelSignal(dfsNode, dpNode, () => {
            flashNode(dpNode as HTMLElement, "critical");
            const edge = document.querySelector('line[data-node="dp"]') as SVGLineElement;
            if (edge) edge.style.opacity = "0.08";
            dropScore(87, 87);
          });
        }, 3800));

        // Beat 5 — DP hit (4.4s)
        stormTimeoutIds.push(window.setTimeout(() => {
          const items = document.querySelectorAll(".story-impact-item");
          if (items[2]) items[2].classList.add("active");
          setCoreStormMode(true);
        }, 4400));
        
        // 5.5s: recover
        stormTimeoutIds.push(window.setTimeout(() => riseScore(87, 87), 5500));
        
        // Beat 7 — recovery (5.5s) / remove storm-active
        stormTimeoutIds.push(window.setTimeout(() => {
          const storyRoot = document.querySelector(".story-root") as HTMLElement;
          if (storyRoot) {
            storyRoot.classList.remove("storm-active");
          }
          document.querySelectorAll(".story-impact-item").forEach(i => i.classList.remove("active"));
          const storyConcept = document.querySelector(".story-concept") as HTMLElement;
          if (storyConcept) storyConcept.style.textShadow = "none";
          setCoreStormMode(false);
        }, 5500));

        // 7s: loop
        stormTimeoutIds.push(window.setTimeout(runMisconceptionStorm, 7000));
      } catch (err) {
        console.error("Error in misconception storm:", err);
        const errorRetryId = window.setTimeout(runMisconceptionStorm, 2000);
        stormTimeoutIds.push(errorRetryId);
      }
    };

    const waitForNodes = (callback: () => void) => {
      const check = setInterval(() => {
        const r = document.getElementById("node-recursion");
        const t = document.getElementById("node-trees");
        const d = document.getElementById("node-dfs");
        const p = document.getElementById("node-dp");
        if (r && t && d && p) {
          clearInterval(check);
          callback();
        }
      }, 100);
      return () => clearInterval(check);
    };

    const init = () => {
      startOrbitalParticles();
      addTimeout(drawEdges, 100);
      addTimeout(startNodeDrift, 150);
      addTimeout(initParticles, 200);
      addTimeout(animateScore, 900);
      const cancelWait = waitForNodes(() => {
        addTimeout(runMisconceptionStorm, 3000);
      });
      timeoutIds.push(window.setTimeout(cancelWait, 10000) as unknown as number); // guard check limit

      // Hover bridge
      document.querySelectorAll("[data-links-to]").forEach(el => {
        const enterHandler = () => {
          const id = el.getAttribute("data-links-to");
          const node = document.getElementById("node-" + id);
          if (!node) return;
          const circle = node.querySelector(".node-circle") as HTMLElement;
          if (!circle) return;

          // pulse the linked node
          circle.style.transition = "transform 200ms ease, box-shadow 300ms ease";
          circle.style.transform = "scale(1.35)";
          circle.style.boxShadow = "0 0 50px rgba(239,68,68,0.7), 0 0 100px rgba(239,68,68,0.3)";

          // spawn one shockwave on the map node
          spawnShockwave(node, 1);
        };

        const leaveHandler = () => {
          const id = el.getAttribute("data-links-to");
          const node = document.getElementById("node-" + id);
          if (!node) return;
          const circle = node.querySelector(".node-circle") as HTMLElement;
          if (!circle) return;

          circle.style.transform = "scale(1)";
          circle.style.boxShadow = ""; // revert to CSS class default
        };

        el.addEventListener("mouseenter", enterHandler);
        el.addEventListener("mouseleave", leaveHandler);
        hoverBridgeElements.push(el);
        mouseEnterHandlers.set(el, enterHandler);
        mouseLeaveHandlers.set(el, leaveHandler);
      });

      // Timeline animation observer
      const proofSection = document.getElementById("proof-section");
      const timelineSteps = document.querySelectorAll(".ht-node");
      const progressBar = document.getElementById("timeline-progress");

      timelineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Animate progress bar
            addTimeout(() => {
              if (progressBar) progressBar.style.width = "100%";
            }, 200);

            // Reveal steps one by one
            timelineSteps.forEach((step, i) => {
              addTimeout(() => {
                step.classList.add("st-visible");
              }, 300 + i * 150);
            });

            if (timelineObserver) {
              timelineObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      if (proofSection && timelineObserver) {
        timelineObserver.observe(proofSection);
      }

      // Count-up animation helper
      const countUp = (el: HTMLElement, target: number, suffix = "", duration = 2000) => {
        const startTime = performance.now();
        const isLarge = target > 10000;

        function easeOutQuart(t: number) {
          return 1 - Math.pow(1 - t, 4);
        }

        function format(val: number) {
          if (isLarge) {
            return Math.floor(val).toLocaleString() + suffix;
          }
          return Math.floor(val) + suffix;
        }

        function tick(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutQuart(progress);
          const value = eased * target;

          el.textContent = format(value);

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = format(target);
          }
        }

        requestAnimationFrame(tick);
      };

      // Social proof intersection observer
      const spSection = document.getElementById("social-proof");
      if (spSection) {
        spObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;

              const stats = entry.target.querySelectorAll(".sp-value");
              stats.forEach(el => {
                const htmlEl = el as HTMLElement;
                const targetVal = parseInt(htmlEl.dataset.target || "0");
                const suffixVal = htmlEl.dataset.suffix || "";
                addTimeout(() => {
                  countUp(htmlEl, targetVal, suffixVal, 2200);
                }, 150);
              });

              if (spObserver) {
                spObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.3 }
        );
        spObserver.observe(spSection);
      }

      // Misconception cascade observer
      const cascade = document.querySelector(".proof-cascade");
      if (cascade) {
        cascadeObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;

              const nodes = entry.target.querySelectorAll(".cascade-node");
              const connectors = entry.target.querySelectorAll(".cascade-connector");
              const footer = entry.target.querySelector(".cascade-footer");

              nodes.forEach((node, i) => {
                addTimeout(() => {
                  node.classList.add("cascade-visible");
                  const bar = node.querySelector(".cascade-bar-fill") as HTMLElement;
                  if (bar) {
                    const width = bar.dataset.width;
                    addTimeout(() => {
                      bar.style.width = width + "%";
                    }, 100);
                  }
                }, i * 300);

                if (connectors[i]) {
                  addTimeout(() => {
                    connectors[i].classList.add("cascade-visible");
                  }, i * 300 + 200);
                }
              });

              addTimeout(() => {
                if (footer) {
                  footer.classList.add("cascade-visible");
                }
              }, nodes.length * 300 + 400);

              if (cascadeObserver) {
                cascadeObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        cascadeObserver.observe(cascade);
      }

      // How it works pipeline steps observer
      const steps = document.querySelectorAll(".pipeline-step");
      if (steps.length > 0) {
        hiwObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("hiw-visible");
              if (hiwObserver) {
                hiwObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        steps.forEach(step => hiwObserver?.observe(step));
      }

      // Hero Cascade Node Animation Observer
      const heroCascadeTrigger = document.getElementById("hero-cascade-trigger");
      const chainVertical = document.querySelector(".chain-vertical");
      if (heroCascadeTrigger && chainVertical) {
        heroCascadeObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                chainVertical.classList.add("animate-start");
              } else {
                chainVertical.classList.remove("animate-start");
              }
            });
          },
          { threshold: 0.1 }
        );
        heroCascadeObserver.observe(heroCascadeTrigger);
      }

      // Animate the example sticky panel in a loop
      const animateExamplePanel = () => {
        const stepsList = document.querySelectorAll(".ef-step");
        if (stepsList.length === 0) return;
        let current = 2; // start at step 3 (index 2)

        examplePanelIntervalId = setInterval(() => {
          stepsList.forEach((s, i) => {
            s.classList.remove("ef-active", "ef-current", "ef-pending");
            if (i < current) s.classList.add("ef-active");
            if (i === current) s.classList.add("ef-current");
            if (i > current) s.classList.add("ef-pending");
          });

          current = (current + 1) % stepsList.length;
          if (current === 0) {
            stepsList.forEach(s => {
              s.classList.remove("ef-active", "ef-current", "ef-pending");
              s.classList.add("ef-pending");
            });
            const timeoutId = window.setTimeout(() => { current = 0; }, 800);
            timeoutIds.push(timeoutId);
          }
        }, 2000);
      };
      
      const panelTimeoutId = window.setTimeout(animateExamplePanel, 1000);
      timeoutIds.push(panelTimeoutId);

      // Animate vertical flow diagram center nodes
      const animateFlowDiagram = () => {
        const nodes = document.querySelectorAll(".fd-node");
        if (nodes.length === 0) return;
        let activeIndex = 0;
        flowDiagramIntervalId = setInterval(() => {
          nodes.forEach((node, idx) => {
            if (idx === activeIndex) {
              node.classList.add("active");
            } else {
              node.classList.remove("active");
            }
          });
          activeIndex = (activeIndex + 1) % nodes.length;
        }, 1500);
      };
      
      const flowDiagramTimeoutId = window.setTimeout(animateFlowDiagram, 1000);
      timeoutIds.push(flowDiagramTimeoutId);

      // Navbar scroll tracker
      window.addEventListener("scroll", handleScroll, { passive: true });
    };

    init();

    // Cleanups on unmount
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      stormTimeoutIds.forEach(id => clearTimeout(id));
      driftAFIds.forEach(id => cancelAnimationFrame(id));
      if (ambLoopId) cancelAnimationFrame(ambLoopId);
      if (flowAnimationFrameId) cancelAnimationFrame(flowAnimationFrameId);
      window.removeEventListener("resize", handleResizeListener);
      document.removeEventListener("mousemove", handleMouseMove);
      if (ambRenderer) {
        ambRenderer.dispose();
      }

      // Cleanup hover bridge event listeners
      hoverBridgeElements.forEach(el => {
        const enter = mouseEnterHandlers.get(el);
        const leave = mouseLeaveHandlers.get(el);
        if (enter) el.removeEventListener("mouseenter", enter);
        if (leave) el.removeEventListener("mouseleave", leave);
      });

      // Cleanup timeline observer
      if (timelineObserver) {
        timelineObserver.disconnect();
      }
      if (cascadeObserver) {
        cascadeObserver.disconnect();
      }
      if (hiwObserver) {
        hiwObserver.disconnect();
      }
      if (spObserver) {
        spObserver.disconnect();
      }
      if (heroCascadeObserver) {
        heroCascadeObserver.disconnect();
      }
      if (examplePanelIntervalId) {
        clearInterval(examplePanelIntervalId);
      }
      if (flowDiagramIntervalId) {
        clearInterval(flowDiagramIntervalId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Volumetric background noise */}
      <div className="noise-overlay" />

      {/* Fixed Ambient Depth Canvas */}
      <canvas id="ambient-canvas" />

      {/* Navigation Header */}
      <nav id="navbar">
        <a href="#" className="nav-logo">LearnLoop<em>.AI</em></a>
        <ul className="nav-links">
          <li><a href="#hero">Product</a></li>
          <li><a href="#how-it-works">Technology</a></li>
          <li><a href="#proof-section">Case Study</a></li>
          <li><a href="#research">Research</a></li>
        </ul>
        <button className="nav-cta">Request Access</button>
      </nav>

      {/* Hero Visualizer Section */}
      <section id="hero">
        
        {/* LEFT COLUMN: Narrative Summary */}
        <div className="hero-left">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-pulse" />
            <span className="badge-text">First AI Understanding Engine</span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            <span className="line-1">Find The Mistakes</span>
            <span className="line-2">You Haven&apos;t</span>
            <span className="line-3">Made Yet.</span>
          </h1>

          {/* Description Paragraphs */}
          <p className="hero-p1">
            Most learning platforms measure completion.
          </p>
          <p className="hero-p2">
            LearnLoop maps understanding, detects misconceptions, and predicts which future topics are at risk — before students ever reach them.
          </p>

          {/* Metrics Card Grid */}
          <div className="hero-metrics">
            <div className="hero-metric-card">
              <span className="hmc-value">11</span>
              <span className="hmc-label">Concepts Tracked</span>
            </div>
            <div className="hero-metric-card">
              <span className="hmc-value critical-text">4</span>
              <span className="hmc-label">Future Risks Found</span>
            </div>
            <div className="hero-metric-card">
              <span className="hmc-value weak-text">1</span>
              <span className="hmc-label">Root Cause Detected</span>
            </div>
            <div className="hero-metric-card">
              <span className="hmc-value teal-text" id="left-score">87%</span>
              <span className="hmc-label">Understanding Score</span>
            </div>
          </div>

          {/* Primary & Secondary Action Triggers */}
          <div className="cta-group">
            <button className="btn-primary">
              <span>Generate My Understanding Map</span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-ghost">See How It Works</button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Product Concept Graph */}
        <div className="hero-right">
          <div className="map-container">
            {/* Interactive JS Particle Flow Canvas Layer */}
            <canvas id="flow-canvas" />

            {/* Connection Edge Lines Layer */}
            <svg id="edges-svg" />

            {/* Central Score Reading Orb */}
            <div className="intel-core">
              <div className="core-ring ring-1" />
              <div className="core-ring ring-2" />
              <div className="core-ring ring-3" />
              <div className="core-ring ring-4" />
              <div className="core-glass">
                <span className="core-label">UNDERSTANDING SCORE</span>
                <span className="core-value" id="score-counter">0%</span>
                <div className="core-bar">
                  <div className="core-bar-fill" />
                </div>
                <span id="core-alert" className="core-alert-label" />
              </div>
            </div>

            {/* Nodes Rendered via React Mapping (Direct matching static markup template) */}
            {CONCEPTS.map((c) => {
              const col = statusColors[c.status];
              return (
                <div
                  key={c.id}
                  className="node"
                  id={`node-${c.id}`}
                  data-concept={c.id}
                  data-status={c.status}
                  style={{ top: c.top, left: c.left }}
                >
                  <div className="node-content">
                    <div
                      className="node-circle"
                      data-status={c.status}
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        backgroundColor: col.bg,
                        border: `1.5px solid ${col.border}`,
                        boxShadow: `0 0 20px rgba(${col.glow},0.2)`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'DM Sans', sans-serif",
                        position: "relative",
                      }}
                    >
                      <span style={{ fontSize: "13px", fontWeight: 600, color: col.text }}>
                        {c.mastery}%
                      </span>
                    </div>
                    <span
                      className="node-label"
                      style={{
                        fontSize: "9px",
                        color: "rgba(232,244,253,0.60)",
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "0.05em",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        marginTop: "4px",
                      }}
                    >
                      {c.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Floating analytical insight readout panels */}
            <div className="insight-panel panel-weakness">
              <div className="panel-dot dot-critical" />
              <div className="panel-label">WEAKEST CONCEPT</div>
              <div className="panel-value">Recursion</div>
              <div className="panel-sub">32% mastery</div>
            </div>

            <div className="insight-panel panel-risk">
              <div className="panel-dot dot-critical" />
              <div className="panel-label">PREDICTED FAILURE</div>
              <div className="panel-value">Dynamic Programming</div>
              <div className="panel-sub">Risk: HIGH</div>
            </div>

            <div className="insight-panel panel-risk-count">
              <div className="panel-dot dot-warning"></div>
              <div className="panel-label">FUTURE FAILURE RISK</div>
              <div className="panel-value" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "32px",
                fontWeight: 700,
                color: "#E8F4FD",
                lineHeight: 1,
                margin: "4px 0"
              }}>4 Concepts</div>
              <div className="panel-sub">
                at risk from 1 root cause
              </div>
              <div className="panel-chain-mini">
                <span className="mini-node">Trees</span>
                <span className="mini-arrow">·</span>
                <span className="mini-node">DFS</span>
                <span className="mini-arrow">·</span>
                <span className="mini-node">DP</span>
              </div>
            </div>

            {/* Floating vertical chain card */}
            <div className="insight-panel panel-chain" id="hero-cascade-trigger">
              <div className="panel-dot dot-critical" />
              <div className="panel-label">Root Cause Chain</div>
              <div className="chain-vertical">
                <div className="cv-node cascade-item" data-index="0">
                  <span className="cv-node-bullet critical"></span>
                  <span className="cv-node-text critical">Recursion</span>
                </div>
                
                <div className="cv-connector" data-index="0">
                  <svg width="10" height="20" viewBox="0 0 10 20">
                    <line x1="5" y1="0" x2="5" y2="20" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" strokeDasharray="20" strokeDashoffset="20" className="connector-line" />
                  </svg>
                </div>

                <div className="cv-node cascade-item" data-index="1">
                  <span className="cv-node-bullet"></span>
                  <span className="cv-node-text">Trees</span>
                </div>

                <div className="cv-connector" data-index="1">
                  <svg width="10" height="20" viewBox="0 0 10 20">
                    <line x1="5" y1="0" x2="5" y2="20" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" strokeDasharray="20" strokeDashoffset="20" className="connector-line" />
                  </svg>
                </div>

                <div className="cv-node cascade-item" data-index="2">
                  <span className="cv-node-bullet"></span>
                  <span className="cv-node-text">DFS</span>
                </div>

                <div className="cv-connector" data-index="2">
                  <svg width="10" height="20" viewBox="0 0 10 20">
                    <line x1="5" y1="0" x2="5" y2="20" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" strokeDasharray="20" strokeDashoffset="20" className="connector-line" />
                  </svg>
                </div>

                <div className="cv-node cascade-item" data-index="3">
                  <span className="cv-node-bullet critical"></span>
                  <span className="cv-node-text critical">Dynamic Programming</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Trust bar / Social Proof */}
        <div className="trust-bar">
          <span className="trust-label">Built for Computer Science Students</span>
          <div className="trust-chips">
            <span className="trust-chip">DSA</span>
            <span className="trust-chip-dot">·</span>
            <span className="trust-chip">Algorithms</span>
            <span className="trust-chip-dot">·</span>
            <span className="trust-chip">Graphs</span>
            <span className="trust-chip-dot">·</span>
            <span className="trust-chip">Dynamic Programming</span>
          </div>
        </div>
      </section>

      {/* PART B: CREDIBILITY SECTION */}
      <section id="proof-section">

        {/* Section label */}
        <div className="proof-section-eyebrow">
          <span className="eyebrow-line"></span>
          <span className="eyebrow-text">Real Detection. Real Impact.</span>
          <span className="eyebrow-line"></span>
        </div>

        {/* Main statement */}
        <div className="proof-statement">
          <h2 className="proof-headline">
            One misunderstanding in{" "}
            <span className="proof-highlight">Recursion</span>{" "}
            caused failures across{" "}
            <span className="proof-number">4 future topics</span>{" "}
            — before the student reached them.
          </h2>
          <p className="proof-subhead">
            LearnLoop identified the root cause 3 weeks{" "}
            before the student failed their exam.
          </p>
        </div>

        {/* New two-column layout */}
        <div className="proof-content">
          {/* Left Column: horizontal timeline container */}
          <div className="horizontal-timeline-container">
            <div className="horizontal-timeline">
              <div className="ht-track-line"></div>
              <div className="ht-nodes">
                <div className={`ht-node ${activeStep === 0 ? "active" : ""}`} data-step="0" onClick={() => setActiveStep(0)}>
                  <div className="ht-dot"></div>
                  <div className="ht-week">Week 1</div>
                  <div className="ht-label">Mastered</div>
                </div>
                <div className={`ht-node ${activeStep === 1 ? "active" : ""}`} data-step="1" onClick={() => setActiveStep(1)}>
                  <div className="ht-dot"></div>
                  <div className="ht-week">Week 3</div>
                  <div className="ht-label">Detected</div>
                </div>
                <div className={`ht-node ${activeStep === 2 ? "active" : ""}`} data-step="2" onClick={() => setActiveStep(2)}>
                  <div className="ht-dot"></div>
                  <div className="ht-week">Week 5</div>
                  <div className="ht-label">Predicted</div>
                </div>
                <div className={`ht-node ${activeStep === 3 ? "active" : ""}`} data-step="3" onClick={() => setActiveStep(3)}>
                  <div className="ht-dot"></div>
                  <div className="ht-week">Week 6</div>
                  <div className="ht-label">Repair</div>
                </div>
                <div className={`ht-node ${activeStep === 4 ? "active" : ""}`} data-step="4" onClick={() => setActiveStep(4)}>
                  <div className="ht-dot"></div>
                  <div className="ht-week">Week 8</div>
                  <div className="ht-label">Outcome</div>
                </div>
              </div>
            </div>

            <div className="ht-card-display">
              {activeStep === 0 && (
                <div className="st-card">
                  <div className="st-status mastered-status">✓ MASTERED</div>
                  <div className="st-concept">Arrays & Loops</div>
                  <div className="st-detail">94% mastery · No issues detected</div>
                </div>
              )}
              {activeStep === 1 && (
                <div className="st-card critical-card">
                  <div className="st-status critical-status">⚑ MISCONCEPTION DETECTED</div>
                  <div className="st-concept">Recursion</div>
                  <div className="st-detail">32% mastery · Base case logic incorrect</div>
                  
                  {/* Warning root cause chain details nested inside Week 3 card */}
                  <div className="rcc-chain" style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(239, 68, 68, 0.12)" }}>
                    <div className="rcc-chain-label" style={{ fontSize: "10px", color: "rgba(232, 244, 253, 0.25)", marginBottom: "6px" }}>
                      ↓ puts at risk
                    </div>
                    <div className="rcc-chain-concepts" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span className="rcc-chip" data-links-to="trees" style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "3px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "rgba(239, 68, 68, 0.75)" }}>Trees</span>
                      <span className="rcc-chip" data-links-to="dfs" style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "3px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "rgba(239, 68, 68, 0.75)" }}>DFS</span>
                      <span className="rcc-chip" data-links-to="dp" style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "3px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "rgba(239, 68, 68, 0.75)" }}>Dynamic Programming</span>
                    </div>
                  </div>
                  <div className="rcc-footer" style={{ marginTop: "8px", fontSize: "11px", color: "var(--text-ghost)" }}>
                    <span className="critical-text" style={{ fontWeight: 600 }}>4</span> future topics at risk
                  </div>
                </div>
              )}
              {activeStep === 2 && (
                <div className="st-card weak-card">
                  <div className="st-status weak-status">◎ PREDICTED FAILURE INCOMING</div>
                  <div className="st-concept">Trees — not yet studied</div>
                  <div className="st-detail">Risk: HIGH · Caused by Recursion gap</div>
                </div>
              )}
              {activeStep === 3 && (
                <div className="st-card repair-card">
                  <div className="st-status repair-status">↑ REPAIR PATH GENERATED</div>
                  <div className="st-concept">Targeted Recursion Review</div>
                  <div className="st-detail">3 micro-lessons · 32% → 81% mastery</div>
                </div>
              )}
              {activeStep === 4 && (
                <div className="st-card outcome-card">
                  <div className="st-status mastered-status">✓ OUTCOME</div>
                  <div className="st-concept">Trees · DFS · Dynamic Programming</div>
                  <div className="st-detail">87% average mastery</div>
                  <div className="st-outcome-result">Exam result: 91st percentile</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: animated misconception cascade visual */}
          <div className="proof-cascade">

            <div className="cascade-header">
              <span className="cascade-dot"></span>
              <span className="cascade-label">
                LIVE MISCONCEPTION TRACE
              </span>
            </div>

            <div className="cascade-chain">

              <div className="cascade-node" data-index="0" data-status="critical">
                <div className="cascade-node-inner">
                  <div className="cascade-node-top">
                    <span className="cascade-status-badge critical">
                      ROOT CAUSE
                    </span>
                  </div>
                  <div className="cascade-concept-name">Recursion</div>
                  <div className="cascade-mastery-row">
                    <div className="cascade-bar-track">
                      <div className="cascade-bar-fill critical-bar" data-width="32"></div>
                    </div>
                    <span className="cascade-pct critical-text">32%</span>
                  </div>
                  <div className="cascade-description">
                    Student confuses base case with loop termination condition.
                  </div>
                </div>
              </div>

              <div className="cascade-connector" data-index="0" style={{ "--signal-delay": "0s" } as React.CSSProperties}>
                <div className="cascade-arrow-line"></div>
                <div className="cascade-impact-label">
                  directly impacts
                </div>
                <div className="cascade-signal-dot"></div>
              </div>

              <div className="cascade-node" data-index="1" data-status="weak">
                <div className="cascade-node-inner">
                  <div className="cascade-node-top">
                    <span className="cascade-status-badge weak">
                      WEAKENING
                    </span>
                  </div>
                  <div className="cascade-concept-name">Trees</div>
                  <div className="cascade-mastery-row">
                    <div className="cascade-bar-track">
                      <div className="cascade-bar-fill weak-bar" data-width="87"></div>
                    </div>
                    <span className="cascade-pct weak-text">87%</span>
                  </div>
                  <div className="cascade-description">
                    Recursive tree traversal partially understood.
                  </div>
                </div>
              </div>

              <div className="cascade-connector" data-index="1" style={{ "--signal-delay": "0.5s" } as React.CSSProperties}>
                <div className="cascade-arrow-line"></div>
                <div className="cascade-impact-label">
                  propagates to
                </div>
                <div className="cascade-signal-dot"></div>
              </div>

              <div className="cascade-node" data-index="2" data-status="weak">
                <div className="cascade-node-inner">
                  <div className="cascade-node-top">
                    <span className="cascade-status-badge weak">
                      AT RISK
                    </span>
                  </div>
                  <div className="cascade-concept-name">DFS</div>
                  <div className="cascade-mastery-row">
                    <div className="cascade-bar-track">
                      <div className="cascade-bar-fill weak-bar" data-width="55"></div>
                    </div>
                    <span className="cascade-pct weak-text">55%</span>
                  </div>
                  <div className="cascade-description">
                    Depth-first logic breaks without recursion clarity.
                  </div>
                </div>
              </div>

              <div className="cascade-connector" data-index="2" style={{ "--signal-delay": "1.0s" } as React.CSSProperties}>
                <div className="cascade-arrow-line"></div>
                <div className="cascade-impact-label">
                  causes failure in
                </div>
                <div className="cascade-signal-dot"></div>
              </div>

              <div className="cascade-node" data-index="3" data-status="critical">
                <div className="cascade-node-inner">
                  <div className="cascade-node-top">
                    <span className="cascade-status-badge critical">
                      PREDICTED FAILURE
                    </span>
                  </div>
                  <div className="cascade-concept-name">Dynamic Programming</div>
                  <div className="cascade-mastery-row">
                    <div className="cascade-bar-track">
                      <div className="cascade-bar-fill critical-bar" data-width="28"></div>
                    </div>
                    <span className="cascade-pct critical-text">28%</span>
                  </div>
                  <div className="cascade-description">
                    Memoization patterns completely inaccessible.
                  </div>
                </div>
              </div>

            </div>

            <div className="cascade-footer">
              <div className="cascade-footer-inner">
                <span className="cascade-footer-icon">◎</span>
                <span className="cascade-footer-text">
                  LearnLoop detected this chain <strong>3 weeks</strong> before the student reached Dynamic Programming
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom credibility stats block */}
        <div className="proof-results-block">

          <div className="results-label">
            <span className="results-line"></span>
            <span className="results-text">Real Student Outcome</span>
            <span className="results-line"></span>
          </div>

          <div className="results-grid">

            <div className="result-card">
              <div className="result-icon teal-icon">◷</div>
              <div className="result-value">3 Weeks</div>
              <div className="result-title">Earlier Detection</div>
              <div className="result-desc">
                Identified before the student reached Dynamic Programming.
              </div>
            </div>

            <div className="result-card result-card-center">
              <div className="result-icon critical-icon">◉</div>
              <div className="result-value critical-text">4 Topics</div>
              <div className="result-title">Failures Prevented</div>
              <div className="result-desc">
                Trees, DFS, DP, Graph Algorithms — all repaired before the exam.
              </div>
            </div>

            <div className="result-card">
              <div className="result-icon mastered-icon">◈</div>
              <div className="result-value mastered-value">91st</div>
              <div className="result-title">Percentile Result</div>
              <div className="result-desc">
                Up from predicted 34th percentile at Week 3 knowledge state.
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* NEW SECTION: SOCIAL PROOF NUMBERS */}
      <section id="social-proof">
        <div className="sp-inner">

          <div className="sp-label">
            LearnLoop in Numbers
          </div>

          <div className="sp-grid">

            <div className="sp-stat">
              <div className="sp-value" data-target="14200" id="sp-1">0</div>
              <div className="sp-title">
                Misconceptions Detected
              </div>
              <div className="sp-sub">
                across beta test cohort
              </div>
            </div>

            <div className="sp-stat">
              <div className="sp-value" data-target="230000" id="sp-2">0</div>
              <div className="sp-title">
                Concept Relationships
              </div>
              <div className="sp-sub">
                mapped in knowledge database
              </div>
            </div>

            <div className="sp-stat">
              <div className="sp-value" data-target="94" id="sp-3" data-suffix="%">0</div>
              <div className="sp-title">
                Prediction Accuracy
              </div>
              <div className="sp-sub">
                on future concept failure
              </div>
            </div>

            <div className="sp-stat">
              <div className="sp-value" data-target="3" id="sp-4" data-suffix=" Weeks">0</div>
              <div className="sp-title">
                Earlier Detection
              </div>
              <div className="sp-sub">
                average across beta cohort
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PART B: SECTION 3 - HOW LEARNLOOP WORKS */}
      <section id="how-it-works">

        <div className="hiw-inner">

          <div className="hiw-header">
            <div className="hiw-eyebrow">
              <span className="eyebrow-dot teal-dot"></span>
              <span>How LearnLoop Works</span>
            </div>
            <h2 className="hiw-headline">
              From learning to understanding
              <br />in five intelligent steps.
            </h2>
            <p className="hiw-subhead">
              Every session feeds the system. Every answer reveals something deeper.
            </p>
          </div>

          <div className="hiw-pipeline">

            <div className="pipeline-step" data-step="1">
              <div className="ps-left">
                <div className="ps-number">01</div>
                <div className="ps-connector"></div>
              </div>
              <div className="ps-right">
                <div className="ps-icon-wrap teal-wrap">
                  <span className="ps-icon">▶</span>
                </div>
                <div className="ps-content">
                  <div className="ps-title">Learn a Topic</div>
                  <div className="ps-desc">
                    Student studies through any content — video, text, or problem sets. LearnLoop observes passively.
                  </div>
                  <div className="ps-tag">Input: any learning material</div>
                </div>
              </div>
            </div>

            <div className="pipeline-step" data-step="2">
              <div className="ps-left">
                <div className="ps-number">02</div>
                <div className="ps-connector"></div>
              </div>
              <div className="ps-right">
                <div className="ps-icon-wrap violet-wrap">
                  <span className="ps-icon">◎</span>
                </div>
                <div className="ps-content">
                  <div className="ps-title">Teach It Back</div>
                  <div className="ps-desc">
                    LearnLoop asks the student to explain the concept in their own words. This reveals what they actually understand versus what they think they understand.
                  </div>
                  <div className="ps-tag">The Feynman Technique, automated</div>
                </div>
              </div>
            </div>

            <div className="pipeline-step" data-step="3">
              <div className="ps-left">
                <div className="ps-number">03</div>
                <div className="ps-connector"></div>
              </div>
              <div className="ps-right">
                <div className="ps-icon-wrap critical-wrap">
                  <span className="ps-icon">⚑</span>
                </div>
                <div className="ps-content">
                  <div className="ps-title">AI Detects Misconceptions</div>
                  <div className="ps-desc">
                    The explanation is analyzed for incorrect mental models, gaps in reasoning, and false confidence. Not just wrong answers — wrong thinking patterns.
                  </div>
                  <div className="ps-tag">Misconception: identified</div>
                </div>
              </div>
            </div>

            <div className="pipeline-step" data-step="4">
              <div className="ps-left">
                <div className="ps-number">04</div>
                <div className="ps-connector"></div>
              </div>
              <div className="ps-right">
                <div className="ps-icon-wrap blue-wrap">
                  <span className="ps-icon">◈</span>
                </div>
                <div className="ps-content">
                  <div className="ps-title">Knowledge Graph Updates</div>
                  <div className="ps-desc">
                    Every concept has a node. Every misconception weakens edges to dependent concepts. The graph updates in real time — a live map of what the student actually understands.
                  </div>
                  <div className="ps-tag">Your knowledge twin, updated</div>
                </div>
              </div>
            </div>

            <div className="pipeline-step" data-step="5" style={{ "--no-connector": "true" } as React.CSSProperties}>
              <div className="ps-left">
                <div className="ps-number">05</div>
              </div>
              <div className="ps-right">
                <div className="ps-icon-wrap mastered-wrap">
                  <span className="ps-icon">◉</span>
                </div>
                <div className="ps-content">
                  <div className="ps-title">Future Risks Predicted</div>
                  <div className="ps-desc">
                    Weak nodes propagate risk forward through the graph. LearnLoop surfaces which future topics are now in danger — weeks before the student reaches them. Then generates a repair path.
                  </div>
                  <div className="ps-tag mastered-tag">Outcome: failure prevented</div>
                </div>
              </div>
            </div>

          </div>

          {/* Technology Architecture Flow Diagram */}
          <div className="hiw-flow-diagram">
            <div className="fd-track-line">
              <div className="fd-pulse-line"></div>
            </div>
            <div className="fd-nodes">
              <div className="fd-node" data-step="1">
                <span className="fd-node-dot"></span>
                <span className="fd-node-title">1. Student Activity</span>
                <span className="fd-node-desc">Captures natural learning inputs & syntax steps</span>
              </div>
              <div className="fd-node" data-step="2">
                <span className="fd-node-dot"></span>
                <span className="fd-node-title">2. Teach-back</span>
                <span className="fd-node-desc">Validates mental models via conversational prompts</span>
              </div>
              <div className="fd-node" data-step="3">
                <span className="fd-node-dot"></span>
                <span className="fd-node-title">3. AI Analysis</span>
                <span className="fd-node-desc">Pinpoints underlying concept misconceptions</span>
              </div>
              <div className="fd-node" data-step="4">
                <span className="fd-node-dot"></span>
                <span className="fd-node-title">4. Knowledge Graph</span>
                <span className="fd-node-desc">Maps dependency networks across codebases</span>
              </div>
              <div className="fd-node" data-step="5">
                <span className="fd-node-dot"></span>
                <span className="fd-node-title">5. Risk Engine</span>
                <span className="fd-node-desc">Predicts downstream failures before they occur</span>
              </div>
              <div className="fd-node" data-step="6">
                <span className="fd-node-dot"></span>
                <span className="fd-node-title">6. Repair Path</span>
                <span className="fd-node-desc">Spawns hyper-targeted recovery feedback loops</span>
              </div>
            </div>
          </div>

          {/* Side panel: live example */}
          <div className="hiw-example">
            <div className="hiw-example-label">
              <span className="example-dot"></span>
              Example trace running now
            </div>
            <div className="hiw-example-flow">
              <div className="ef-step ef-active">
                <span className="ef-num">1</span>
                <span className="ef-text">Student studies Recursion</span>
                <span className="ef-check">✓</span>
              </div>
              <div className="ef-divider"></div>
              <div className="ef-step ef-active">
                <span className="ef-num">2</span>
                <span className="ef-text">Teach-back: explains base case wrong</span>
                <span className="ef-check">✓</span>
              </div>
              <div className="ef-divider"></div>
              <div className="ef-step ef-current">
                <span className="ef-num">3</span>
                <span className="ef-text">Misconception detected</span>
                <span className="ef-spinner"></span>
              </div>
              <div className="ef-divider"></div>
              <div className="ef-step ef-pending">
                <span className="ef-num">4</span>
                <span className="ef-text">Graph updating...</span>
              </div>
              <div className="ef-divider"></div>
              <div className="ef-step ef-pending">
                <span className="ef-num">5</span>
                <span className="ef-text">Predicting: DFS, DP at risk</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* FINAL SECTION: CLOSING CTA */}
      <section id="research" className="final-cta-section">
        <div className="fcs-inner">

          <div className="fcs-eyebrow">
            <span className="fcs-line"></span>
            <span className="fcs-text">
              Start Understanding
            </span>
            <span className="fcs-line"></span>
          </div>

          <h2 className="fcs-headline">
            You Can&apos;t Fix
            <br />What You Can&apos;t See.
          </h2>

          <p className="fcs-desc">
            Find hidden misconceptions before they become future failures.
          </p>

          <div className="fcs-cta-group">
            <button className="btn-primary fcs-btn">
              Generate My Understanding Map
            </button>
            <div className="fcs-meta">
              <span className="fcs-meta-item">
                ✓ No signup required
              </span>
              <span className="fcs-meta-dot">·</span>
              <span className="fcs-meta-item">
                ✓ 2-minute analysis
              </span>
              <span className="fcs-meta-dot">·</span>
              <span className="fcs-meta-item">
                ✓ Full knowledge map generated
              </span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
