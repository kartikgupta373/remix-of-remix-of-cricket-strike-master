import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BowlerProps {
  isBowling: boolean;
  bowlingProgress: number;
}

export const Bowler = ({ isBowling, bowlingProgress }: BowlerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current || !armRef.current) return;
    
    if (isBowling) {
      // Run-up animation
      if (bowlingProgress < 0.3) {
        const runProgress = bowlingProgress / 0.3;
        groupRef.current.position.z = -12 + runProgress * 2;
        // Running motion
        groupRef.current.rotation.x = Math.sin(runProgress * Math.PI * 4) * 0.1;
      } else if (bowlingProgress < 0.5) {
        // Jump and delivery stride
        const deliveryProgress = (bowlingProgress - 0.3) / 0.2;
        groupRef.current.position.z = -10;
        groupRef.current.position.y = Math.sin(deliveryProgress * Math.PI) * 0.3;
        
        // Arm windmill
        armRef.current.rotation.x = -deliveryProgress * Math.PI * 1.5;
      } else {
        // Follow through
        groupRef.current.position.y = 0;
        groupRef.current.position.z = -10;
        armRef.current.rotation.x = -Math.PI * 1.5 + (bowlingProgress - 0.5) * Math.PI * 0.5;
      }
    } else {
      // Reset position
      groupRef.current.position.set(0, 0, -12);
      groupRef.current.rotation.x = 0;
      armRef.current.rotation.x = 0;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -12]}>
      {/* Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.45, 8, 16]} />
        <meshStandardMaterial color="#D32F2F" /> {/* Red jersey */}
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#FFCC80" /> {/* Skin */}
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.4, 8, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.1, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.4, 8, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Bowling arm */}
      <group ref={armRef} position={[0.25, 1.2, 0]}>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
          <capsuleGeometry args={[0.05, 0.35, 8, 16]} />
          <meshStandardMaterial color="#D32F2F" />
        </mesh>
        {/* Hand */}
        <mesh position={[0.05, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#FFCC80" />
        </mesh>
      </group>
      
      {/* Other arm */}
      <mesh position={[-0.25, 1.0, 0.1]} rotation={[0.3, 0, -Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        <meshStandardMaterial color="#D32F2F" />
      </mesh>
    </group>
  );
};
