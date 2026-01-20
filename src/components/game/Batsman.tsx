import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BatsmanProps {
  isSwinging: boolean;
  swingProgress: number;
}

export const Batsman = ({ isSwinging, swingProgress }: BatsmanProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const batRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!batRef.current) return;
    
    if (isSwinging) {
      // Swing animation - bat goes from ready to follow-through
      const swingAngle = swingProgress * Math.PI * 0.8;
      batRef.current.rotation.z = -Math.PI / 4 + swingAngle;
      batRef.current.rotation.y = swingProgress * 0.3;
    } else {
      // Ready stance
      batRef.current.rotation.z = -Math.PI / 4;
      batRef.current.rotation.y = 0;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 8.5]} rotation={[0, Math.PI, 0]}>
      {/* Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.5, 8, 16]} />
        <meshStandardMaterial color="#1565C0" /> {/* Blue jersey */}
      </mesh>
      
      {/* Head with helmet */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#1565C0" /> {/* Blue helmet */}
      </mesh>
      {/* Helmet grill */}
      <mesh position={[0, 1.5, 0.12]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.05]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      
      {/* Legs with pads */}
      <mesh position={[-0.1, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
        <meshStandardMaterial color="#EEEEEE" /> {/* Batting pads */}
      </mesh>
      <mesh position={[0.1, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
        <meshStandardMaterial color="#EEEEEE" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3, 1.0, 0.1]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
        <meshStandardMaterial color="#1565C0" />
      </mesh>
      <mesh position={[0.3, 1.0, 0.1]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
        <meshStandardMaterial color="#1565C0" />
      </mesh>
      
      {/* Gloves */}
      <mesh position={[-0.4, 0.85, 0.2]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.4, 0.85, 0.2]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Bat */}
      <group ref={batRef} position={[0.35, 0.9, 0.25]}>
        {/* Handle */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 0.4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Handle grip */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        {/* Blade */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.12, 0.45, 0.04]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        {/* Bat face stickers */}
        <mesh position={[0, -0.1, 0.025]} castShadow>
          <boxGeometry args={[0.08, 0.2, 0.001]} />
          <meshStandardMaterial color="#CC0000" />
        </mesh>
      </group>
    </group>
  );
};
