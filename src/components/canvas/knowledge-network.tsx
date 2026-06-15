"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Html } from "@react-three/drei";
import * as THREE_CORE from "three";
import { NetworkNode } from "./network-node";
import { NetworkConnections } from "./network-connection";

// Cinematic camera setup: guides camera path & handles smooth cursor parallax
function CinematicCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // 1. Cinematic circular orbit coordinates
    const orbitSpeed = 0.03;
    const radius = 9.6; // Increased by 60% to cover the massive new 3D scale
    const camX = Math.sin(time * orbitSpeed) * radius;
    const camZ = Math.cos(time * orbitSpeed) * radius;

    // 2. Parallax offsets based on cursor movement
    const targetX = camX + pointer.x * 1.8;
    const targetY = pointer.y * 1.4 + Math.sin(time * 0.02) * 0.5;
    const targetZ = camZ + pointer.x * 0.6;

    // 3. Smooth camera interpolation (lerp)
    const newX = THREE_CORE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    const newY = THREE_CORE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    const newZ = THREE_CORE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
    camera.position.set(newX, newY, newZ);

    // Keep camera focused on the central core
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Subcomponent rendering expanding "understanding waves" (concentric shockwaves emitting from core)
function ExpandingWaves() {
  const waveRef1 = useRef<THREE_CORE.Mesh>(null);
  const waveRef2 = useRef<THREE_CORE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (waveRef1.current) {
      // Loop wave progress from 0 to 1
      const progress = (time * 0.35) % 1;
      const scale = 0.5 + progress * 5.0;
      waveRef1.current.scale.setScalar(scale);
      
      const mat = waveRef1.current.material as THREE_CORE.MeshBasicMaterial;
      if (mat) mat.opacity = (1 - progress) * 0.16;
    }

    if (waveRef2.current) {
      // Loop wave offset by 1.5 seconds
      const progress = ((time + 1.4) * 0.35) % 1;
      const scale = 0.5 + progress * 5.0;
      waveRef2.current.scale.setScalar(scale);
      
      const mat = waveRef2.current.material as THREE_CORE.MeshBasicMaterial;
      if (mat) mat.opacity = (1 - progress) * 0.16;
    }
  });

  return (
    <group>
      {/* Horizontally flat shockwave rings */}
      <mesh ref={waveRef1} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.95, 32]} />
        <meshBasicMaterial color="#14B8A6" transparent opacity={0} side={THREE_CORE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={waveRef2} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.95, 32]} />
        <meshBasicMaterial color="#5B4BDB" transparent opacity={0} side={THREE_CORE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Subcomponent rendering layered particles: background stars, midground dots, and foreground bokeh glow
function BackgroundSpace({ glowTexture }: { glowTexture: THREE_CORE.Texture | null }) {
  const bgRef = useRef<THREE_CORE.Points>(null);
  const midRef = useRef<THREE_CORE.Points>(null);
  const fgRef = useRef<THREE_CORE.Group>(null);

  const particleCountBg = 800;
  const particleCountMid = 300;
  const particleCountFg = 45;

  // 1. Background stars positions (broad distribution)
  const positionsBg = useMemo(() => {
    let seed = 7;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    const pos = new Float32Array(particleCountBg * 3);
    for (let i = 0; i < particleCountBg; i++) {
      pos[i * 3] = (random() - 0.5) * 32;
      pos[i * 3 + 1] = (random() - 0.5) * 32;
      pos[i * 3 + 2] = (random() - 0.5) * 32;
    }
    return pos;
  }, []);

  // 2. Midground cluster positions (dense local distribution)
  const positionsMid = useMemo(() => {
    let seed = 14;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    const pos = new Float32Array(particleCountMid * 3);
    for (let i = 0; i < particleCountMid; i++) {
      pos[i * 3] = (random() - 0.5) * 20;
      pos[i * 3 + 1] = (random() - 0.5) * 20;
      pos[i * 3 + 2] = (random() - 0.5) * 20;
    }
    return pos;
  }, []);

  // 3. Foreground bokeh points data
  const fgPoints = useMemo(() => {
    let seed = 21;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: particleCountFg }).map(() => ({
      position: [
        (random() - 0.5) * 10,
        (random() - 0.5) * 10,
        (random() - 0.5) * 8,
      ] as [number, number, number],
      size: 0.15 + random() * 0.25,
      speed: 0.035 + random() * 0.045,
      phase: random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (bgRef.current) {
      bgRef.current.rotation.y = time * 0.005;
      bgRef.current.rotation.x = time * 0.002;
    }

    if (midRef.current) {
      midRef.current.rotation.y = -time * 0.008;
      midRef.current.rotation.z = time * 0.004;
    }

    if (fgRef.current) {
      fgRef.current.children.forEach((child, idx) => {
        const item = fgPoints[idx];
        if (item) {
          // Slow floating drift in foreground space
          child.position.y = item.position[1] + Math.sin(time * item.speed + item.phase) * 0.35;
          child.position.x = item.position[0] + Math.cos(time * (item.speed * 0.8) + item.phase) * 0.22;
        }
      });
    }
  });

  return (
    <group>
      {/* 1. Deep background stars */}
      <points ref={bgRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positionsBg, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#F8FAFC"
          size={0.025}
          transparent
          opacity={0.2}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* 2. Midground neural clusters */}
      <points ref={midRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positionsMid, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#14B8A6"
          size={0.04}
          transparent
          opacity={0.16}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* 3. Foreground bokeh blur particles */}
      {glowTexture && (
        <group ref={fgRef}>
          {fgPoints.map((p, idx) => (
            <sprite key={idx} position={p.position} scale={p.size}>
              <spriteMaterial
                map={glowTexture}
                color="#5B4BDB"
                transparent
                opacity={0.14}
                blending={THREE_CORE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          ))}
        </group>
      )}
    </group>
  );
}

// Subcomponent that animates energy data packets (pulses) along connection paths
function NetworkPulses({
  connections,
  nodesPositions,
  glowTexture,
}: {
  connections: [number, number][];
  nodesPositions: React.MutableRefObject<THREE_CORE.Vector3[]>;
  glowTexture: THREE_CORE.Texture | null;
}) {
  const pulseCount = 45; // density of active packet flows

  // Initialize pulse states
  const pulses = useMemo(() => {
    let seed = 123;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: pulseCount }).map(() => ({
      connectionIdx: Math.floor(random() * connections.length),
      progress: random(),
      speed: 0.18 + random() * 0.25,
    }));
  }, [connections]);

  const pointsRef = useRef<THREE_CORE.Points>(null);
  const initialPositions = useMemo(() => new Float32Array(pulseCount * 3), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !glowTexture) return;

    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.getAttribute("position") as THREE_CORE.BufferAttribute;

    if (!positionAttribute) return;

    const positions = positionAttribute.array as Float32Array;

    pulses.forEach((pulse, idx) => {
      // Advance pulse progress
      pulse.progress += pulse.speed * delta;
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        pulse.connectionIdx = Math.floor(Math.random() * connections.length);
        pulse.speed = 0.18 + Math.random() * 0.25;
      }

      // Calculate path coordinates
      const connection = connections[pulse.connectionIdx];
      if (connection) {
        const [startIdx, endIdx] = connection;
        const startPos = nodesPositions.current[startIdx];
        const endPos = nodesPositions.current[endIdx];

        if (startPos && endPos) {
          positions[idx * 3] = THREE_CORE.MathUtils.lerp(startPos.x, endPos.x, pulse.progress);
          positions[idx * 3 + 1] = THREE_CORE.MathUtils.lerp(startPos.y, endPos.y, pulse.progress);
          positions[idx * 3 + 2] = THREE_CORE.MathUtils.lerp(startPos.z, endPos.z, pulse.progress);
        }
      }
    });

    positionAttribute.needsUpdate = true;
  });

  if (!glowTexture) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#14B8A6"
        size={0.18}
        transparent
        opacity={0.9}
        map={glowTexture}
        blending={THREE_CORE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Subcomponent rendering the living multi-layer intelligence core
function IntelligenceCore({ glowTexture }: { glowTexture: THREE_CORE.Texture | null }) {
  const distortRef = useRef<THREE_CORE.Mesh>(null);
  const shellRef = useRef<THREE_CORE.Mesh>(null);
  const ringRef = useRef<THREE_CORE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (distortRef.current) {
      distortRef.current.rotation.x = time * 0.1;
      distortRef.current.rotation.y = time * 0.15;
    }

    if (shellRef.current) {
      shellRef.current.rotation.y = -time * 0.12;
      shellRef.current.rotation.x = time * 0.06;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.18;
      ringRef.current.rotation.x = Math.sin(time * 0.12) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Core Morphing Sphere (R3F) */}
      <mesh ref={distortRef}>
        <sphereGeometry args={[0.45, 64, 64]} />
        <MeshDistortMaterial
          color="#5B4BDB"
          distort={0.4}
          speed={1.5}
          roughness={0.1}
          metalness={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 2. Outer Rotating Wireframe Shell */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[0.62, 16, 16]} />
        <meshBasicMaterial
          color="#14B8A6"
          wireframe
          transparent
          opacity={0.15}
          blending={THREE_CORE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Orbiting Gold Alignment Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.92, 0.015, 8, 48]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.3}
          blending={THREE_CORE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Volumetric Core Glow Halos */}
      {glowTexture && (
        <>
          <sprite scale={3.2}>
            <spriteMaterial
              map={glowTexture}
              color="#5B4BDB"
              transparent
              opacity={0.28}
              blending={THREE_CORE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
          <sprite scale={4.8}>
            <spriteMaterial
              map={glowTexture}
              color="#14B8A6"
              transparent
              opacity={0.08}
              blending={THREE_CORE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        </>
      )}
    </group>
  );
}

const COLORS = {
  strong: "#22C55E",      // Green
  weak: "#EF4444",        // Red
  neutral: "#5B4BDB",     // Purple
  futureRisk: "#F59E0B",  // Gold
};

const TRACKS = [
  {
    id: 1, // Mastery Loop (Inner)
    radius: 2.0,
    rotation: [0.4, 0.2, 0] as [number, number, number],
    nodeCount: 8,
    color: COLORS.strong,
  },
  {
    id: 2, // Focus Loop (Middle)
    radius: 3.4,
    rotation: [-0.3, 0.4, 0.2] as [number, number, number],
    nodeCount: 10,
    color: COLORS.neutral,
  },
  {
    id: 3, // Risk Loop (Outer)
    radius: 4.8,
    rotation: [0.2, -0.5, 0.3] as [number, number, number],
    nodeCount: 14,
    color: COLORS.weak,
  },
];

export default function KnowledgeNetwork() {
  // Pre-generate custom volumetric canvas texture (Bloom helper)
  const glowTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.85)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE_CORE.CanvasTexture(canvas);
    return texture;
  }, []);

  // 1. Generate node data along circular orbits
  const nodeData = useMemo(() => {
    const nodes = [];

    // Master central node (Core)
    nodes.push({
      id: 0,
      initialPosition: [0, 0, 0] as [number, number, number],
      color: COLORS.neutral,
      size: 0.08,
    });

    let seed = 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    TRACKS.forEach((track) => {
      const { radius, rotation, nodeCount } = track;
      const euler = new THREE_CORE.Euler(...rotation);

      for (let i = 0; i < nodeCount; i++) {
        // Distribute node points evenly around track circumference
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // Apply 3D track rotation matrix
        const vec = new THREE_CORE.Vector3(x, y, 0).applyEuler(euler);

        // Map node colors according to track context (more mastered inner, active middle, warning outer)
        let color = COLORS.neutral;
        if (track.id === 1) {
          color = random() < 0.75 ? COLORS.strong : COLORS.neutral;
        } else if (track.id === 2) {
          color = random() < 0.6 ? COLORS.neutral : COLORS.futureRisk;
        } else {
          color = random() < 0.55 ? COLORS.weak : COLORS.futureRisk;
        }

        nodes.push({
          id: nodes.length,
          initialPosition: [vec.x, vec.y, vec.z] as [number, number, number],
          color,
          size: 0.045 + random() * 0.04,
        });
      }
    });

    return nodes;
  }, []);

  // 2. Generate line links (circuits along orbit rings + inter-track bridges + core sync lines)
  const connections = useMemo(() => {
    const connList: [number, number][] = [];

    // Connection Offset Pointer
    let nodeOffset = 1; // start after master node

    // A. Connect nodes in circular circuits on the same track loops
    TRACKS.forEach((track) => {
      for (let i = 0; i < track.nodeCount; i++) {
        const startIdx = nodeOffset + i;
        const endIdx = nodeOffset + ((i + 1) % track.nodeCount);
        connList.push([startIdx, endIdx]);
      }
      nodeOffset += track.nodeCount;
    });

    // B. Inter-track pathway bridges (concept dependencies)
    // Connect nodes between Mastery Loop (Inner) and Focus Loop (Middle)
    connList.push([2, 10]);
    connList.push([5, 14]);

    // Connect nodes between Focus Loop (Middle) and Risk Loop (Outer)
    connList.push([11, 23]);
    connList.push([15, 27]);
    connList.push([17, 32]);

    // C. Core Sync lines (sync inner mastered loops to core database)
    for (let i = 1; i <= 8; i++) {
      connList.push([0, i]);
    }

    return connList;
  }, []);

  // 3. Shared reference tracking node coordinates
  const nodesPositionsRef = useRef<THREE_CORE.Vector3[]>(
    nodeData.map((n) => new THREE_CORE.Vector3(...n.initialPosition))
  );

  const handlePositionUpdate = (id: number, pos: THREE_CORE.Vector3) => {
    if (nodesPositionsRef.current[id]) {
      nodesPositionsRef.current[id].copy(pos);
    }
  };

  return (
    <div className="w-full h-[380px] md:h-[520px] relative select-none">
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-radial from-[#5B4BDB]/12 via-transparent to-transparent blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-[#14B8A6]/7 via-transparent to-transparent blur-[100px] translate-x-12 translate-y-12 pointer-events-none" />

      <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }}>
        {/* Volumetric fog */}
        <fog attach="fog" args={["#050816", 5.0, 12.0]} />

        {/* Lights */}
        <ambientLight intensity={0.22} />
        <directionalLight position={[10, 10, 5]} intensity={2.2} color="#14B8A6" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#5B4BDB" />
        <pointLight position={[4, -4, 3]} intensity={1.2} color="#F59E0B" />

        {/* Space Elements */}
        <BackgroundSpace glowTexture={glowTexture} />

        {/* Central Pulsating Core */}
        <IntelligenceCore glowTexture={glowTexture} />

        {/* expanding core shockwaves */}
        <ExpandingWaves />

        {/* Circular Orbit Tracks visualizer paths */}
        {TRACKS.map((t) => (
          <mesh key={t.id} rotation={t.rotation}>
            <torusGeometry args={[t.radius, 0.008, 8, 64]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.06}
              blending={THREE_CORE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Concept Network Nodes */}
        {nodeData.map((node) => (
          <NetworkNode
            key={node.id}
            id={node.id}
            initialPosition={node.initialPosition}
            color={node.color}
            size={node.size}
            glowTexture={glowTexture}
            onPositionUpdate={handlePositionUpdate}
          />
        ))}

        {/* Dynamic Concept Connections */}
        <NetworkConnections
          connections={connections}
          nodesPositions={nodesPositionsRef}
        />

        {/* Travelling Energy Pulses */}
        <NetworkPulses
          connections={connections}
          nodesPositions={nodesPositionsRef}
          glowTexture={glowTexture}
        />

        {/* Floating Glass HUD Dashboards (Real-Time Learning Intelligence KPI Cards) */}
        {/* Card 1: Understanding Score: 87% */}
        <Html position={[-3.3, 1.8, 0.4]} center distanceFactor={8.8}>
          <div className="glass-panel border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-3 rounded-xl text-left select-none pointer-events-none w-[155px] bg-[#0B1020]/75 backdrop-blur-md animate-float">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              <span className="text-[8px] font-semibold text-white/45 tracking-widest uppercase font-heading">
                Understanding Score
              </span>
            </div>
            <div className="text-xl font-bold font-heading text-white tracking-tight leading-none mb-1">
              87%
            </div>
            {/* Sparkline Mastery Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5 flex">
              <div className="h-full bg-gradient-to-r from-[#5B4BDB] to-[#22C55E]" style={{ width: "87%" }} />
            </div>
          </div>
        </Html>

        {/* Card 2: Weak Concept: Recursion */}
        <Html position={[-3.6, -1.6, 1.0]} center distanceFactor={8.8}>
          <div className="glass-panel border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-3 rounded-xl text-left select-none pointer-events-none w-[155px] bg-[#0B1020]/75 backdrop-blur-md animate-float" style={{ animationDelay: "1.5s" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span className="text-[8px] font-semibold text-white/45 tracking-widest uppercase font-heading">
                Weak Concept
              </span>
            </div>
            <div className="text-lg font-bold font-heading text-white tracking-tight leading-none mb-1">
              Recursion
            </div>
            <div className="text-[9px] text-[#EF4444] font-medium font-body">
              Misconception Detected
            </div>
          </div>
        </Html>

        {/* Card 3: Predicted Risk: Trees */}
        <Html position={[3.6, -1.6, 0.4]} center distanceFactor={8.8}>
          <div className="glass-panel border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-3 rounded-xl text-left select-none pointer-events-none w-[155px] bg-[#0B1020]/75 backdrop-blur-md animate-float" style={{ animationDelay: "2.2s" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="text-[8px] font-semibold text-white/45 tracking-widest uppercase font-heading">
                Predicted Risk
              </span>
            </div>
            <div className="text-lg font-bold font-heading text-white tracking-tight leading-none mb-1">
              Binary Trees
            </div>
            <div className="text-[9px] text-[#F59E0B] font-medium font-body">
              Retention Decay Alert
            </div>
          </div>
        </Html>

        {/* Card 4: Learning Velocity: High */}
        <Html position={[3.3, 1.8, -0.8]} center distanceFactor={8.8}>
          <div className="glass-panel border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-3 rounded-xl text-left select-none pointer-events-none w-[155px] bg-[#0B1020]/75 backdrop-blur-md animate-float" style={{ animationDelay: "0.7s" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              <span className="text-[8px] font-semibold text-white/45 tracking-widest uppercase font-heading">
                Learning Velocity
              </span>
            </div>
            <div className="text-lg font-bold font-heading text-white tracking-tight leading-none mb-1">
              High
            </div>
            <div className="text-[9px] text-[#14B8A6] font-medium font-body flex items-center gap-1">
              <span>Path Boost (1.8x)</span>
            </div>
          </div>
        </Html>

        {/* Card 5: Knowledge Retention: 78% */}
        <Html position={[0.0, -2.8, 1.4]} center distanceFactor={8.8}>
          <div className="glass-panel border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-3 rounded-xl text-left select-none pointer-events-none w-[160px] bg-[#0B1020]/75 backdrop-blur-md animate-float" style={{ animationDelay: "2.8s" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B4BDB]" />
              <span className="text-[8px] font-semibold text-white/45 tracking-widest uppercase font-heading">
                Knowledge Retention
              </span>
            </div>
            <div className="text-xl font-bold font-heading text-white tracking-tight leading-none mb-1">
              78%
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5 flex">
              <div className="h-full bg-gradient-to-r from-[#EF4444] via-[#F59E0B] to-[#5B4BDB]" style={{ width: "78%" }} />
            </div>
          </div>
        </Html>

        {/* Camera Guidance Controls */}
        <CinematicCamera />
      </Canvas>
    </div>
  );
}
