"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE_CORE from "three";

interface NetworkConnectionsProps {
  connections: [number, number][];
  nodesPositions: React.MutableRefObject<THREE_CORE.Vector3[]>;
}

export function NetworkConnections({
  connections,
  nodesPositions,
}: NetworkConnectionsProps) {
  const lineRef = useRef<THREE_CORE.LineSegments>(null);

  // Allocate positions array: 2 points per connection, 3 coordinates (x, y, z) per point
  const initialPositions = useMemo(() => {
    return new Float32Array(connections.length * 6);
  }, [connections]);

  useFrame(() => {
    if (!lineRef.current) return;

    const geometry = lineRef.current.geometry;
    const positionAttribute = geometry.getAttribute("position") as THREE_CORE.BufferAttribute;

    if (!positionAttribute) return;

    const positions = positionAttribute.array as Float32Array;
    let index = 0;

    for (let i = 0; i < connections.length; i++) {
      const [startIdx, endIdx] = connections[i];
      const startPos = nodesPositions.current[startIdx];
      const endPos = nodesPositions.current[endIdx];

      if (startPos && endPos) {
        positions[index++] = startPos.x;
        positions[index++] = startPos.y;
        positions[index++] = startPos.z;

        positions[index++] = endPos.x;
        positions[index++] = endPos.y;
        positions[index++] = endPos.z;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.25}
        blending={THREE_CORE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
