"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NetworkNodeProps {
  id: number;
  initialPosition: [number, number, number];
  color: string;
  size: number;
  glowTexture: THREE.Texture | null;
  onPositionUpdate: (id: number, position: THREE.Vector3) => void;
}

export function NetworkNode({
  id,
  initialPosition,
  color,
  size,
  glowTexture,
  onPositionUpdate,
}: NetworkNodeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const tempPos = useMemo(() => new THREE.Vector3(), []);

  // Pre-generate unique noise variables safely on client mount to remain pure during render
  const animConfigRef = useRef({
    speedX: 0.4,
    speedY: 0.5,
    speedZ: 0.4,
    amplitudeX: 0.18,
    amplitudeY: 0.2,
    amplitudeZ: 0.18,
    phaseX: 0,
    phaseY: 0,
    phaseZ: 0,
    pulseSpeed: 2.1,
    pulsePhase: 0,
  });

  useEffect(() => {
    animConfigRef.current = {
      speedX: 0.25 + Math.random() * 0.35,
      speedY: 0.3 + Math.random() * 0.4,
      speedZ: 0.25 + Math.random() * 0.4,
      amplitudeX: 0.12 + Math.random() * 0.12,
      amplitudeY: 0.14 + Math.random() * 0.12,
      amplitudeZ: 0.12 + Math.random() * 0.12,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseZ: Math.random() * Math.PI * 2,
      pulseSpeed: 1.2 + Math.random() * 1.8,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const pointer = state.pointer; // mouse coordinates ranging from -1 to 1
    const config = animConfigRef.current;

    // 1. Organic drifting float
    const driftX = Math.sin(time * config.speedX + config.phaseX) * config.amplitudeX;
    const driftY = Math.cos(time * config.speedY + config.phaseY) * config.amplitudeY;
    const driftZ = Math.sin(time * config.speedZ + config.phaseZ) * config.amplitudeZ;

    // 2. Parallax drift based on mouse position
    // Deeper nodes react slightly differently to create a volumetric 3D separation
    const depthFactor = (initialPosition[2] + 4) / 8; // normalize Z depth
    const mouseShiftX = pointer.x * 0.4 * depthFactor;
    const mouseShiftY = pointer.y * 0.4 * depthFactor;

    // 3. Set the target coordinates
    const targetX = initialPosition[0] + driftX + mouseShiftX;
    const targetY = initialPosition[1] + driftY + mouseShiftY;
    const targetZ = initialPosition[2] + driftZ;

    // Premium smooth lerp interpolation
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08);

    // 4. Subtle breathing/pulsing scale animation
    const pulseScale = 1 + Math.sin(time * config.pulseSpeed + config.pulsePhase) * 0.18;
    meshRef.current.scale.setScalar(pulseScale);

    // 5. Send position reports back to the parent component
    tempPos.set(meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z);
    onPositionUpdate(id, tempPos);
  });

  return (
    <group ref={meshRef} position={initialPosition}>
      {/* Volumetric glow sprite halo (Simulates bloom lighting) */}
      {glowTexture && (
        <sprite scale={size * 4.5}>
          <spriteMaterial
            map={glowTexture}
            color={color}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* Inner Active Core Mesh */}
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
