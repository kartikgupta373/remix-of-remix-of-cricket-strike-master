import { useRef } from 'react';
import * as THREE from 'three';

interface StumpsProps {
  position: [number, number, number];
  bailsFallen?: boolean;
}

export const Stumps = ({ position, bailsFallen = false }: StumpsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const stumpHeight = 0.72;
  const stumpRadius = 0.015;
  const stumpSpacing = 0.11;
  const bailLength = 0.12;
  const bailRadius = 0.01;
  
  return (
    <group ref={groupRef} position={position}>
      {/* Three stumps */}
      {[-stumpSpacing, 0, stumpSpacing].map((offset, i) => (
        <mesh key={i} position={[offset, stumpHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[stumpRadius, stumpRadius, stumpHeight, 8]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
      ))}
      
      {/* Bails */}
      {!bailsFallen ? (
        <>
          <mesh 
            position={[-stumpSpacing / 2, stumpHeight + bailRadius, 0]} 
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[bailRadius, bailRadius, bailLength, 8]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
          <mesh 
            position={[stumpSpacing / 2, stumpHeight + bailRadius, 0]} 
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[bailRadius, bailRadius, bailLength, 8]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
        </>
      ) : (
        <>
          {/* Fallen bails animation */}
          <mesh 
            position={[-stumpSpacing / 2 - 0.1, stumpHeight - 0.2, 0.1]} 
            rotation={[Math.PI / 4, Math.PI / 6, Math.PI / 3]}
          >
            <cylinderGeometry args={[bailRadius, bailRadius, bailLength, 8]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
          <mesh 
            position={[stumpSpacing / 2 + 0.15, stumpHeight - 0.3, -0.05]} 
            rotation={[-Math.PI / 5, -Math.PI / 4, Math.PI / 2]}
          >
            <cylinderGeometry args={[bailRadius, bailRadius, bailLength, 8]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
        </>
      )}
    </group>
  );
};
