import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import stickmanImage from '@/assets/stickman.png';

interface BatsmanProps {
  isSwinging: boolean;
  swingProgress: number;
}

export const Batsman = ({ isSwinging, swingProgress }: BatsmanProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const batGroupRef = useRef<THREE.Group>(null);
  const stickmanTexture = useTexture(stickmanImage);

  useFrame(() => {
    if (!batGroupRef.current) return;

    if (isSwinging) {
      const swingPhase = swingProgress;

      // Bat rotation - dramatic backswing to follow-through
      const batRotationZ = -Math.PI / 2.5 + swingPhase * Math.PI * 1.5;
      const batRotationY = -0.4 + swingPhase * 1.2;
      const batRotationX = swingPhase * 0.8;

      batGroupRef.current.rotation.set(batRotationX, batRotationY, batRotationZ);
      batGroupRef.current.position.x = 0.4 + swingPhase * 0.3;
      batGroupRef.current.position.z = 0.2 + swingPhase * 0.4;
    } else {
      // Ready stance
      batGroupRef.current.rotation.set(-0.1, -0.3, -Math.PI / 2.5);
      batGroupRef.current.position.set(0.55, 0.95, 0.1);
    }
  });

  return (
    // Batsman shifted left of wicket, bat clearly visible on the right
    <group ref={groupRef} position={[-0.7, 0.1, 5.5]} rotation={[0, Math.PI * 0.15, 0]}>
      {/* Stickman image */}
      <mesh position={[0, 1.0, 0.1]} castShadow>
        <planeGeometry args={[1, 2]} /> {/* Adjusted for better aspect ratio */}
        <meshStandardMaterial map={stickmanTexture} transparent />
      </mesh>

      {/* Bat group - positioned to the right of batsman, flipped for right-hand grip */}
      <group ref={batGroupRef} position={[0.6, 0.95, 0.15]} rotation={[0.1, -0.5, Math.PI / 2.5]} scale={[1, -1, 1]}>
        {/* Handle grip */}
        <mesh position={[0, 0.35, 0]} castShadow renderOrder={1}>
          <cylinderGeometry args={[0.022, 0.022, 0.2, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Handle */}
        <mesh position={[0, 0.18, 0]} castShadow renderOrder={1}>
          <cylinderGeometry args={[0.02, 0.022, 0.15, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Blade shoulder */}
        <mesh position={[0, 0.04, 0]} castShadow renderOrder={1}>
          <boxGeometry args={[0.09, 0.14, 0.04]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        {/* Blade main */}
        <mesh position={[0, -0.24, 0]} castShadow renderOrder={1}>
          <boxGeometry args={[0.12, 0.48, 0.045]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        {/* Blade toe */}
        <mesh position={[0, -0.52, 0]} castShadow renderOrder={1}>
          <boxGeometry args={[0.11, 0.08, 0.04]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        {/* Bat sticker */}
        <mesh position={[0, -0.2, 0.024]} castShadow renderOrder={1}>
          <boxGeometry args={[0.09, 0.28, 0.002]} />
          <meshStandardMaterial color="#CC0000" />
        </mesh>
        {/* Gloves holding bat */}
        <mesh position={[0, 0.38, 0.02]} castShadow renderOrder={1}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.28, 0.02]} castShadow renderOrder={1}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
};
