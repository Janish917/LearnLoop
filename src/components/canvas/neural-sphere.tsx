"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GeodesicSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Exact requested rotation speed: 0.003 rad/frame
    // Assuming 60fps, 0.003 * 60 = 0.18 rad/sec.
    // In three.js useFrame runs on every frame, so we increment rotation by 0.003 each frame.
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x += 0.001;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= 0.0015;
    }

    const time = state.clock.getElapsedTime();
    // Electric blue pulse animation every 5 seconds
    const pulseCycle = time % 5;
    let pulseFactor = 0;
    if (pulseCycle < 1.2) {
      // Exponential decay decay for premium ease-out feel
      pulseFactor = Math.exp(-pulseCycle * 3.5);
    }

    // Dynamic material update based on pulse
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        // Base color is electric indigo (#4F46E5), pulses to ice blue (#06B6D4)
        const baseColor = new THREE.Color("#4F46E5");
        const pulseColor = new THREE.Color("#06B6D4");
        mat.color.copy(baseColor).lerp(pulseColor, pulseFactor);
        mat.opacity = 0.25 + pulseFactor * 0.45;
      }
    }
  });

  return (
    <group>
      {/* Geodesic Outer Lattice */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.0, 2]} />
        <meshBasicMaterial
          color="#4F46E5"
          wireframe
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Glowing Inner Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color="#1E1B4B"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Volumetric Core Glow */}
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial
          color="#4F46E5"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ParticleTrails() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 120;

  // Initialize electron-like particle trails orbiting the sphere safely on mount
  const positions = useMemo(() => new Float32Array(particleCount * 3), []);
  const phsRef = useRef<Float32Array | null>(null);
  const radRef = useRef<Float32Array | null>(null);
  const spdRef = useRef<Float32Array | null>(null);
  const angRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const phs = new Float32Array(particleCount);
    const rad = new Float32Array(particleCount);
    const spd = new Float32Array(particleCount);
    const ang = new Float32Array(particleCount * 2); // theta, phi

    for (let i = 0; i < particleCount; i++) {
      phs[i] = Math.random() * Math.PI * 2;
      rad[i] = 2.1 + Math.random() * 0.5;
      spd[i] = 0.4 + Math.random() * 0.6;
      ang[i * 2] = Math.random() * Math.PI; // theta
      ang[i * 2 + 1] = (Math.random() - 0.5) * 0.4; // slight phi wobble
    }

    phsRef.current = phs;
    radRef.current = rad;
    spdRef.current = spd;
    angRef.current = ang;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !phsRef.current || !radRef.current || !spdRef.current || !angRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positionAttribute = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const posArray = positionAttribute.array as Float32Array;
    const phs = phsRef.current;
    const spd = spdRef.current;
    const rad = radRef.current;
    const ang = angRef.current;

    for (let i = 0; i < particleCount; i++) {
      const currentPhase = phs[i] + time * spd[i];
      const r = rad[i];
      const theta = ang[i * 2];
      const phi = ang[i * 2 + 1];

      // Standard orbital coordinates with inclination
      const x = r * Math.cos(currentPhase);
      const z = r * Math.sin(currentPhase);
      
      // Apply tilt transformations
      posArray[i * 3] = x * Math.cos(phi) - z * Math.sin(phi);
      posArray[i * 3 + 1] = (x * Math.sin(phi) + z * Math.cos(phi)) * Math.sin(theta);
      posArray[i * 3 + 2] = (x * Math.sin(phi) + z * Math.cos(phi)) * Math.cos(theta);
    }

    positionAttribute.needsUpdate = true;
    
    // Rotate particle system slowly
    pointsRef.current.rotation.y += 0.0015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#06B6D4"
        size={0.035}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContainer() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle cinematic floating / breathing motion
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.12;
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <GeodesicSphere />
      <ParticleTrails />
    </group>
  );
}

export default function NeuralSphere() {
  return (
    <div className="w-full h-[450px] md:h-[550px] relative select-none flex items-center justify-center overflow-hidden">
      {/* Extremely subtle radial gradient behind the sphere — deep indigo bloom, barely visible */}
      <div className="absolute inset-0 bg-radial from-[#1E1B4B]/20 via-transparent to-transparent blur-[120px] pointer-events-none" />
      
      {/* 2-3 ultra-fine horizontal scanlines scrolling slowly upward (5% opacity) */}
      <div className="scanline-container opacity-[0.05]">
        <div className="scanline" />
        <div className="scanline" />
        <div className="scanline" />
      </div>

      <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }}>
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#4F46E5" />
        <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#06B6D4" />
        
        <SceneContainer />
      </Canvas>
    </div>
  );
}
