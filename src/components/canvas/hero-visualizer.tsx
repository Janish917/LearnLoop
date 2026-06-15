"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function RotatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.2}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#5B4BDB"
        attach="material"
        distort={0.25}
        speed={1.5}
        roughness={0.1}
        metalness={0.9}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

function ParticleOrbit() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 250;
  
  const positions = useMemo(() => {
    let seed = 99;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    const pos = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Set up ring orbit positions
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.1 + random() * 0.45;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (random() - 0.5) * 0.25;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.22;
      // Slight wobble to the ring path
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.15;
    }
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
        color="#14B8A6"
        size={0.06}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingCore() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Premium floating amplitude and frequency
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.1) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <RotatingSphere />
      <ParticleOrbit />
    </group>
  );
}

export default function HeroVisualizer() {
  return (
    <div className="w-full h-[360px] md:h-[480px] relative select-none">
      {/* Background glow highlights for depth */}
      <div className="absolute inset-0 bg-radial from-[#5B4BDB]/12 via-transparent to-transparent blur-[70px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-[#14B8A6]/8 via-transparent to-transparent blur-[90px] translate-x-10 translate-y-10 pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[8, 8, 4]} intensity={2.2} color="#14B8A6" />
        <directionalLight position={[-8, -8, -4]} intensity={1.4} color="#5B4BDB" />
        <pointLight position={[3, -3, 2]} intensity={1.2} color="#F59E0B" />
        
        <FloatingCore />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
