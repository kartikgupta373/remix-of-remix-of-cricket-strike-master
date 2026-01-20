import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StumpsProps {
  position: [number, number, number];
  bailsFallen?: boolean;
}

export const Stumps = ({ position, bailsFallen = false }: StumpsProps) => {
  const bailsRef = useRef<THREE.Group>(null);
  const stumpsGroupRef = useRef<THREE.Group>(null);
  const bailFallProgress = useRef(0);
  
  useFrame((state, delta) => {
    if (bailsFallen && bailsRef.current && bailFallProgress.current < 1) {
      bailFallProgress.current += delta * 3;
      
      // Animate bails falling dramatically
      bailsRef.current.rotation.z += delta * 10;
      bailsRef.current.rotation.x += delta * 5;
      bailsRef.current.position.y -= delta * 2.5;
      bailsRef.current.position.z -= delta * 1.2;
    }
  });
  
  const stumpHeight = 0.72;
  const stumpRadius = 0.016;
  const stumpSpacing = 0.115;
  
  return (
    <group position={position}>
      <group ref={stumpsGroupRef}>
        {/* Three stumps */}
        {[-stumpSpacing, 0, stumpSpacing].map((offset, i) => (
          <group key={i}>
            {/* Stump body */}
            <mesh position={[offset, stumpHeight / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[stumpRadius, stumpRadius * 1.15, stumpHeight, 12]} />
              <meshStandardMaterial 
                color="#F5DEB3" 
                roughness={0.55}
                metalness={0.05}
              />
            </mesh>
            {/* Stump top */}
            <mesh position={[offset, stumpHeight + 0.012, 0]} castShadow>
              <cylinderGeometry args={[stumpRadius * 1.25, stumpRadius, 0.025, 12]} />
              <meshStandardMaterial color="#E8D4A8" />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Bails */}
      <group ref={bailsRef} position={[0, stumpHeight + 0.028, 0]}>
        {/* Left bail */}
        <mesh position={[-stumpSpacing / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, stumpSpacing * 0.88, 8]} />
          <meshStandardMaterial color="#CD853F" roughness={0.45} />
        </mesh>
        {/* Right bail */}
        <mesh position={[stumpSpacing / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, stumpSpacing * 0.88, 8]} />
          <meshStandardMaterial color="#CD853F" roughness={0.45} />
        </mesh>
      </group>
      
      {/* Crease line */}
      <mesh position={[0, 0.006, 0.28]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.85, 0.045]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
      </mesh>
    </group>
  );
};
