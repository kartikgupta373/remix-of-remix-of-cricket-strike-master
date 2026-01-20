import { useRef } from 'react';
import * as THREE from 'three';

interface StumpsProps {
  position: [number, number, number];
  bailsFallen?: boolean;
}

export const Stumps = ({ position, bailsFallen = false }: StumpsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const stumpHeight = 0.72;
  const stumpRadius = 0.018;
  const stumpSpacing = 0.115;
  const bailLength = 0.115;
  const bailRadius = 0.012;
  
  return (
    <group ref={groupRef} position={position}>
      {/* Three stumps */}
      {[-stumpSpacing, 0, stumpSpacing].map((offset, i) => (
        <group key={i}>
          {/* Stump */}
          <mesh position={[offset, stumpHeight / 2, 0]} castShadow>
            <cylinderGeometry args={[stumpRadius, stumpRadius * 1.1, stumpHeight, 12]} />
            <meshStandardMaterial color="#DEB887" roughness={0.6} />
          </mesh>
          {/* Stump tip */}
          <mesh position={[offset, stumpHeight + 0.015, 0]} castShadow>
            <coneGeometry args={[stumpRadius * 1.2, 0.03, 12]} />
            <meshStandardMaterial color="#DEB887" roughness={0.6} />
          </mesh>
        </group>
      ))}
      
      {/* Bails */}
      {!bailsFallen ? (
        <>
          {/* Left bail */}
          <mesh 
            position={[-stumpSpacing / 2, stumpHeight + 0.035, 0]} 
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[bailRadius, bailRadius, bailLength, 8]} />
            <meshStandardMaterial color="#CD853F" roughness={0.5} />
          </mesh>
          {/* Right bail */}
          <mesh 
            position={[stumpSpacing / 2, stumpHeight + 0.035, 0]} 
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[bailRadius, bailRadius, bailLength, 8]} />
            <meshStandardMaterial color="#CD853F" roughness={0.5} />
          </mesh>
        </>
      ) : (
        <>
          {/* Fallen bails - flying off dramatically */}
          <mesh 
            position={[-stumpSpacing - 0.15, stumpHeight - 0.1, 0.15]} 
            rotation={[Math.PI / 3, Math.PI / 5, Math.PI / 2]}
          >
            <cylinderGeometry args={[bailRadius, bailRadius, bailLength, 8]} />
            <meshStandardMaterial color="#CD853F" roughness={0.5} />
          </mesh>
          <mesh 
            position={[stumpSpacing + 0.2, stumpHeight - 0.25, -0.1]} 
            rotation={[-Math.PI / 4, -Math.PI / 3, Math.PI / 3]}
          >
            <cylinderGeometry args={[bailRadius, bailRadius, bailLength, 8]} />
            <meshStandardMaterial color="#CD853F" roughness={0.5} />
          </mesh>
          
          {/* Middle stump knocked back slightly */}
          <mesh position={[0, stumpHeight / 2 - 0.05, 0.08]} rotation={[0.15, 0, 0]} castShadow>
            <cylinderGeometry args={[stumpRadius, stumpRadius * 1.1, stumpHeight, 12]} />
            <meshStandardMaterial color="#DEB887" roughness={0.6} />
          </mesh>
        </>
      )}
      
      {/* Ground marking at base of stumps */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[0.5, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
    </group>
  );
};
