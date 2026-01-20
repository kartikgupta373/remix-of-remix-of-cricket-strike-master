import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BatsmanProps {
  isSwinging: boolean;
  swingProgress: number;
}

export const Batsman = ({ isSwinging, swingProgress }: BatsmanProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const batGroupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!batGroupRef.current || !bodyRef.current) return;
    
    if (isSwinging) {
      // Dynamic bat swing animation
      const swingPhase = swingProgress;
      
      // Bat rotation - backswing to follow-through
      const batRotationZ = -Math.PI / 3 + swingPhase * Math.PI * 1.2;
      const batRotationY = -0.3 + swingPhase * 0.8;
      const batRotationX = swingPhase * 0.5;
      
      batGroupRef.current.rotation.set(batRotationX, batRotationY, batRotationZ);
      
      // Body rotation during swing
      bodyRef.current.rotation.y = swingPhase * 0.4;
      
      // Slight body lean into shot
      bodyRef.current.position.x = swingPhase * 0.1;
    } else {
      // Ready stance - bat raised, ready to strike
      batGroupRef.current.rotation.set(0, -0.2, -Math.PI / 3);
      bodyRef.current.rotation.y = 0;
      bodyRef.current.position.x = 0;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 6]} rotation={[0, Math.PI, 0]}>
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.5, 8, 16]} />
          <meshStandardMaterial color="#1565C0" /> {/* Blue jersey */}
        </mesh>
        
        {/* Head with helmet */}
        <group position={[0, 1.65, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#1565C0" /> {/* Blue helmet */}
          </mesh>
          {/* Helmet peak */}
          <mesh position={[0, -0.02, 0.14]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 0.02, 0.08]} />
            <meshStandardMaterial color="#0D47A1" />
          </mesh>
          {/* Helmet grill */}
          <mesh position={[0, -0.05, 0.15]} castShadow>
            <boxGeometry args={[0.16, 0.12, 0.02]} />
            <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Face */}
          <mesh position={[0, -0.02, 0.12]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FFCC80" />
          </mesh>
        </group>
        
        {/* Legs with pads */}
        <mesh position={[-0.12, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.45, 8, 16]} />
          <meshStandardMaterial color="#EEEEEE" /> {/* Batting pads */}
        </mesh>
        <mesh position={[0.12, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.45, 8, 16]} />
          <meshStandardMaterial color="#EEEEEE" />
        </mesh>
        
        {/* Shoes */}
        <mesh position={[-0.12, 0.05, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.18]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.12, 0.05, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.18]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Left arm (non-batting) */}
        <group position={[-0.32, 1.1, 0.1]}>
          <mesh rotation={[0.4, 0, -Math.PI / 5]} castShadow>
            <capsuleGeometry args={[0.055, 0.28, 8, 16]} />
            <meshStandardMaterial color="#1565C0" />
          </mesh>
          {/* Glove */}
          <mesh position={[-0.12, -0.15, 0.1]} castShadow>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
        
        {/* Right arm (batting arm) - connected to bat */}
        <group position={[0.32, 1.1, 0.15]}>
          <mesh rotation={[0.3, 0, Math.PI / 5]} castShadow>
            <capsuleGeometry args={[0.055, 0.28, 8, 16]} />
            <meshStandardMaterial color="#1565C0" />
          </mesh>
        </group>
        
        {/* Bat group - positioned at hands */}
        <group ref={batGroupRef} position={[0.15, 0.85, 0.25]}>
          {/* Handle grip area (where hands hold) */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.15, 8]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.022, 0.18, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Blade shoulder */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.08, 0.12, 0.035]} />
            <meshStandardMaterial color="#D2B48C" />
          </mesh>
          {/* Blade main */}
          <mesh position={[0, -0.22, 0]} castShadow>
            <boxGeometry args={[0.11, 0.42, 0.04]} />
            <meshStandardMaterial color="#DEB887" />
          </mesh>
          {/* Blade toe */}
          <mesh position={[0, -0.46, 0]} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.035]} />
            <meshStandardMaterial color="#D2B48C" />
          </mesh>
          {/* Bat sticker */}
          <mesh position={[0, -0.18, 0.022]} castShadow>
            <boxGeometry args={[0.08, 0.25, 0.002]} />
            <meshStandardMaterial color="#CC0000" />
          </mesh>
          {/* Gloves holding bat */}
          <mesh position={[0.03, 0.35, 0.02]} castShadow>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-0.03, 0.28, 0.02]} castShadow>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
