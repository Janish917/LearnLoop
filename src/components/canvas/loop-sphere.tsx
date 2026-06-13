"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.3}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#5B4BDB"
        attach="material"
        distort={0.3}
        speed={1.8}
        roughness={0.15}
        metalness={0.9}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function LoopSphere() {
  return (
    <div className="w-full h-[320px] md:h-[420px] relative select-none">
      {/* Background radial highlight for the 3D element */}
      <div className="absolute inset-0 bg-radial from-[#5B4BDB]/10 via-transparent to-transparent blur-[50px] pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        {/* Futuristic primary and secondary lights */}
        <directionalLight position={[8, 8, 4]} intensity={2} color="#14B8A6" />
        <directionalLight position={[-8, -8, -4]} intensity={1.5} color="#5B4BDB" />
        <pointLight position={[2, -2, 3]} intensity={1.2} color="#F59E0B" />
        
        <AnimatedSphere />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}
